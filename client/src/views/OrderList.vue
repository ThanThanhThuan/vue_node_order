<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    
    <main class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ $t('menu.orders') }}</h1>
        <button @click="openAddModal" class="btn-primary">+ {{ $t('actions.add') }}</button>
      </div>

      <!-- FILTERS -->
      <div class="card p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
           <label class="label">Status</label>
           <!-- Safety: Check if filters exists -->
           <select v-if="filters" v-model="filters.status" class="select" @change="fetchOrders">
             <option value="">All</option>
             <option value="NEW">New</option>
             <option value="PROCESSING">Processing</option>
             <option value="COMPLETED">Completed</option>
             <option value="CANCELLED">Cancelled</option>
           </select>
        </div>
        <div>
            <label class="label">From Date</label>
            <input v-if="filters" type="date" v-model="filters.startDate" class="input" @change="fetchOrders">
        </div>
        <div>
            <label class="label">To Date</label>
            <input v-if="filters" type="date" v-model="filters.endDate" class="input" @change="fetchOrders">
        </div>
         <!-- Only show Customer Filter if ADMIN -->
        <div v-if="isAdmin">
            <label class="label">Customer</label>
            <select v-model="filters.customer_id" class="select" @change="fetchOrders">
                <option value="">All Customers</option>
                <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
        </div>
      </div>

      <!-- TABLE -->
      <div class="card table-container">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Code</th>
              <th class="table-header">Customer</th>
              <th class="table-header">Items</th>
              <th class="table-header">Value</th>
              <th class="table-header">Status</th>
              <th class="table-header">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Safety: v-for only runs if orders has items -->
            <tr v-for="order in orders" :key="order?.id || Math.random()" class="hover:bg-slate-50">
              <td class="table-cell font-bold">{{ order?.order_code }}</td>
              <td class="table-cell">{{ order?.Customer?.name }}</td>
              
              <td class="table-cell">
                <span v-if="order?.OrderItems?.length > 0">
                  {{ order.OrderItems.length }} items
                </span>
                <span v-else>{{ order?.product_service }}</span>
              </td>
              
              <td class="table-cell font-mono">${{ order?.total_value }}</td>
                  <td class="table-cell">
                 <select 
                    v-model="order.status" 
                    @change="updateStatus(order)"
                    class="text-xs border rounded p-1 font-bold"
                    :class="statusColor(order.status)"
                 >
                    <option value="NEW">{{$t('status.new')}}</option>
                      <option value="PROCESSING">{{$t('status.processing')}}</option>
             <option value="COMPLETED">{{$t('status.completed')}}</option>
             <option value="CANCELLED">{{$t('status.cancelled')}}</option>
                 </select>
              </td>
              <!-- <td class="table-cell">
                 
                 <span :class="statusColor(order?.status)" class="px-2 py-1 rounded text-xs font-bold">
                    {{ order?.status }}
                 </span>
              </td> -->
              <td class="table-cell">
                 <button @click="openDetailModal(order)" class="text-blue-600 hover:underline">Details</button>
              </td>
            </tr>
            <tr v-if="!orders || orders.length === 0">
              <td colspan="6" class="p-6 text-center text-gray-500">No orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- === ADD MODAL === -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div class="bg-blue-600 px-6 py-4">
          <h3 class="text-white font-bold text-lg">Create Multi-Item Order</h3>
        </div>
        <form @submit.prevent="createOrder" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
             <div>
                <label class="label">Order Code</label>
                <input v-model="newOrder.order_code" class="input bg-gray-50" readonly>
             </div>
              <!-- CUSTOMER SELECT: Read-only if Customer, Dropdown if Admin -->
             <div>
                <label class="label">Customer</label>
                
                <select v-if="isAdmin" v-model="newOrder.customer_id" class="select" required>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>

                <input v-else :value="currentUserCustomerName" class="input bg-gray-100" readonly />
             </div>
          </div>

          <div class="border rounded-lg p-4 bg-gray-50">
             <div class="flex justify-between mb-2">
                <h4 class="font-bold text-gray-700">Order Items</h4>
                <button type="button" @click="addItem" class="text-blue-600 text-sm font-bold">+ Add Line</button>
             </div>
             <div v-for="(item, index) in newOrder.items" :key="index" class="flex gap-2 mb-2 items-end">
                <div class="flex-grow">
                   <label class="text-xs text-gray-500">Product</label>
                   <select v-model="item.product_id" class="select text-sm py-1" @change="onProductSelect(item)" required>
                      <option value="">Select...</option>
                      <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
                   </select>
                </div>
                <div class="w-20">
                   <label class="text-xs text-gray-500">Qty</label>
                   <input v-model="item.quantity" type="number" min="1" class="input text-sm py-1" required>
                </div>
                <div class="w-24">
                   <label class="text-xs text-gray-500">Price</label>
                   <input v-model="item.unit_price" type="number" class="input text-sm py-1" readonly>
                </div>
                <button type="button" @click="removeItem(index)" class="text-red-500 text-xl font-bold px-2">&times;</button>
             </div>
          </div>

          <div class="flex justify-between items-center pt-2">
             <div class="text-lg font-bold">Total: <span class="text-blue-600">${{ calculatedTotal }}</span></div>
             <div class="flex gap-2">
                <button type="button" @click="showAddModal = false" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Create Order</button>
             </div>
          </div>
        </form>
      </div>
    </div>
    
    <!-- === DETAIL MODAL === -->
    <!-- Safety: Ensure selectedOrder exists before rendering contents -->
    <div v-if="showDetailModal && selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
       <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
          <h3 class="text-xl font-bold mb-4">Order #{{ selectedOrder?.order_code }}</h3>
          
          <!-- Safety: Use ?.status here -->
          <div :class="statusColor(selectedOrder?.status)" class="p-3 rounded-lg border text-center font-bold mb-4">
            Current Status: {{ selectedOrder?.status }}
          </div>
          
          <table class="min-w-full text-sm mb-4">
             <thead>
               <tr class="bg-gray-100 text-left">
                  <th class="p-2">Item</th>
                  <th class="p-2">Qty</th>
                  <th class="p-2">Price</th>
                  <th class="p-2">Total</th>
               </tr>
             </thead>
             <tbody>
               <!-- Safety: Use ?. for nested items -->
               <tr v-for="item in selectedOrder?.OrderItems" :key="item?.id" class="border-b">
                  <td class="p-2">{{ item?.Product?.name || 'Unknown' }}</td>
                  <td class="p-2">{{ item?.quantity }}</td>
                  <td class="p-2">${{ item?.unit_price }}</td>
                  <td class="p-2 font-bold">${{ (item?.quantity || 0) * (item?.unit_price || 0) }}</td>
               </tr>
             </tbody>
          </table>
          
          <div class="text-right font-bold text-xl mb-4">
             Total: ${{ selectedOrder?.total_value }}
          </div>

          <div class="flex justify-between items-center">
            <button @click="deleteOrder(selectedOrder?.id)" class="text-red-600 hover:text-red-800 text-sm font-bold">
                Delete Order
            </button>
            <button @click="showDetailModal = false" class="btn-secondary w-full ml-4">Close</button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import api from '../api/axios';

const isAdmin = ref(false);
const currentUserId = ref(null);
const currentUserCustomerName = ref('');

const orders = ref([]);
const customers = ref([]);
const products = ref([]);
const showAddModal = ref(false);
const showDetailModal = ref(false);
const selectedOrder = ref(null);

const filters = reactive({ 
  status: '', 
  startDate: '', 
  endDate: '', 
  customer_id: '' 
});

const newOrder = reactive({
  order_code: '',
  customer_id: '',
  items: []
});

const calculatedTotal = computed(() => {
   if (!newOrder.items) return 0;
   return newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
});

const addItem = () => {
   newOrder.items.push({ product_id: '', quantity: 1, unit_price: 0 });
};

const removeItem = (index) => {
   newOrder.items.splice(index, 1);
};

const onProductSelect = (item) => {
   const prod = products.value.find(p => p.id === item.product_id);
   if(prod) {
      item.unit_price = prod.price;
   }
};

const openAddModal = () => {
  newOrder.customer_id = '';
  newOrder.items = [];
  addItem();
  newOrder.order_code = 'ORD-' + Math.floor(1000 + Math.random() * 9000); 
  // IF CUSTOMER: Auto-select their ID
  if (!isAdmin.value) {
      const myProfile = customers.value.find(c => c.user_id === currentUserId.value);
      if (myProfile) {
          newOrder.customer_id = myProfile.id;
      } else {
          alert("Error: Your user account is not linked to a Customer Profile. Contact Admin.");
          return;
      }
  } else {
      newOrder.customer_id = '';
  }
  
  showAddModal.value = true;
  
};

const openDetailModal = (order) => {
  if (!order) return;
  selectedOrder.value = order;
  showDetailModal.value = true;
};

const fetchOrders = async () => {
  try {
    const params = new URLSearchParams(filters);
    
    // IF CUSTOMER: Force filter by userId
    if (!isAdmin.value && currentUserId.value) {
        params.append('userId', currentUserId.value);
    }

    const res = await api.get(`/orders?${params.toString()}`);
    if (Array.isArray(res.data)) orders.value = res.data;
    else orders.value = [];
  }  catch (error) {
    console.error("Fetch error", error);
    orders.value = [];
  }
};

const createOrder = async () => {
  if(newOrder.items.length === 0) return alert("Add at least one item");
  try {
    await api.post('/orders', newOrder);
    showAddModal.value = false;
    fetchOrders();
  } catch (error) {
    alert("Failed: " + error.message);
  }
};

const deleteOrder = async (id) => {
    if(!id) return;
    if(!confirm("Are you sure?")) return;
    try {
        await api.delete(`/orders/${id}`);
        showDetailModal.value = false;
        fetchOrders();
    } catch (error) {
        alert("Delete failed");
    }
};

const statusColor = (s) => {
    if(!s) return 'bg-gray-100 text-gray-800'; // Guard clause
    if(s === 'NEW') return 'bg-blue-100 text-blue-800';
    if(s === 'COMPLETED') return 'bg-green-100 text-green-800';
    if(s === 'PROCESSING') return 'bg-purple-100 text-purple-800';
    if(s === 'CANCELLED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
};

const updateStatus = async (order) => {
  try {
    // 1. Call the Backend API to save the change
    await api.put(`/orders/${order.id}`, { 
        status: order.status 
    });
    
    // 2. (Optional) Console log or Toast notification
    console.log(`Order ${order.order_code} status updated to ${order.status}`);
    
    // Note: You don't need to refresh the list because v-model 
    // already updated the UI instantly!
    
  } catch (error) {
    console.error(error);
    alert("Failed to save status update");
    // Optional: Reload orders to revert the change in UI if API failed
    fetchOrders(); 
  }
};

// onMounted0(async () => {
//   try {
//       const [custRes, prodRes, ordRes] = await Promise.all([
//         api.get('/customers'),
//         api.get('/products'),
//         api.get('/orders')
//       ]);
//       customers.value = custRes.data || [];
//       products.value = prodRes.data || [];
//       orders.value = ordRes.data || [];
//   } catch (e) {
//       console.error("Init Error", e);
//   }
// });

onMounted(async () => {
  try {
      // 1. Check Role
      const userStr = localStorage.getItem('user');
      if (userStr) {
          const user = JSON.parse(userStr);
          isAdmin.value = user.role === 'ADMIN';
          currentUserId.value = user.id;
      }

      // 2. Load Data
      const [custRes, prodRes] = await Promise.all([
        api.get('/customers'),
        api.get('/products')
      ]);
      customers.value = custRes.data || [];
      products.value = prodRes.data || [];

      // 3. Identify Current Customer Name (for display in Add Modal)
      if (!isAdmin.value) {
          const myProfile = customers.value.find(c => c.user_id === currentUserId.value);
          if (myProfile) {
              currentUserCustomerName.value = myProfile.name;
              // Pre-fill filter logic not needed here, handled in fetchOrders
          }
      }

      fetchOrders();
  } catch (e) { console.error(e); }
});
</script>