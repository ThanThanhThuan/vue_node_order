<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    
    <main class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ $t('customer.title') }}</h1>
        <button @click="openModal()" class="btn-primary">
          + {{ $t('actions.add') }}
        </button>
      </div>

      <!-- Customer List -->
      <div class="card table-container">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">{{ $t('customer.name') }}</th>
              <th class="table-header">{{ $t('customer.phone') }}</th>
              <th class="table-header">{{ $t('customer.email') }}</th>
              <th class="table-header">User ID</th>
              <th class="table-header">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="c in customers" :key="c.id" class="hover:bg-slate-50">
              <td class="table-cell font-medium">{{ c.name }}</td>
              <td class="table-cell">{{ c.phone }}</td>
              <td class="table-cell">{{ c.email }}</td>
              <td class="table-cell text-gray-400 text-xs">
                {{ c.user_id ? `#${c.user_id}` : 'Unlinked' }}
              </td>
              <td class="table-cell space-x-2">
                <button @click="openModal(c)" class="text-blue-600 hover:underline">
                  Edit
                </button>
                <button @click="deleteCustomer(c.id)" class="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="customers.length === 0">
                <td colspan="5" class="p-6 text-center text-gray-500">No customers found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl w-96 overflow-hidden">
        <div class="bg-blue-600 px-6 py-4">
          <h3 class="text-white font-bold text-lg">
            {{ isEditing ? $t('customer.edit') : $t('customer.create') }}
          </h3>
        </div>
        
        <form @submit.prevent="saveCustomer" class="p-6 space-y-4">
          <div>
            <label class="label">{{ $t('customer.name') }}</label>
            <input v-model="form.name" class="input" required>
          </div>
          <div>
            <label class="label">{{ $t('customer.phone') }}</label>
            <input v-model="form.phone" class="input">
          </div>
          <div>
            <label class="label">{{ $t('customer.email') }}</label>
            <input v-model="form.email" type="email" class="input">
          </div>
          <div>
            <label class="label">User ID (Optional)</label>
            <input v-model="form.user_id" type="number" class="input" placeholder="Link to login account ID">
          </div>
          <div>
            <label class="label">{{ $t('customer.notes') }}</label>
            <textarea v-model="form.notes" class="input" rows="3"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="showModal = false" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import api from '../api/axios';

const customers = ref([]);
const showModal = ref(false);
const isEditing = ref(false);

const form = reactive({
    id: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
    user_id: ''
});

// Load Data
const fetchCustomers = async () => {
    try {
        const res = await api.get('/customers');
        customers.value = res.data;
    } catch (e) {
        console.error(e);
    }
};

// Open Modal (Handle both Create and Edit)
const openModal = (customer = null) => {
    if (customer) {
        // Edit Mode
        isEditing.value = true;
        form.id = customer.id;
        form.name = customer.name;
        form.phone = customer.phone;
        form.email = customer.email;
        form.notes = customer.notes;
        form.user_id = customer.user_id;
    } else {
        // Create Mode
        isEditing.value = false;
        form.id = null;
        form.name = '';
        form.phone = '';
        form.email = '';
        form.notes = '';
        form.user_id = '';
    }
    showModal.value = true;
};

// Save (Create or Update)
const saveCustomer = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/customers/${form.id}`, form);
        } else {
            await api.post('/customers', form);
        }
        showModal.value = false;
        fetchCustomers();
    } catch (error) {
        alert("Failed to save: " + error.message);
    }
};

// Delete
const deleteCustomer = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
    } catch (error) {
        // Backend blocks delete if orders exist (returns 400)
        alert(error.response?.data?.message || "Delete failed");
    }
};

onMounted(fetchCustomers);
</script>