<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    <main class="page-container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Products</h1>
        <button @click="openModal" class="btn-primary">+ Add Product</button>
      </div>

      <div class="card table-container">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">SKU</th>
              <th class="table-header">Name</th>
              <th class="table-header">Price</th>
              <th class="table-header">Stock</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="p in products" :key="p.id">
              <td class="table-cell font-mono">{{ p.sku }}</td>
              <td class="table-cell font-bold">{{ p.name }}</td>
              <td class="table-cell">${{ p.price }}</td>
              <td class="table-cell">{{ p.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Simple Add Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white rounded p-6 w-96 shadow-lg">
        <h2 class="text-xl font-bold mb-4">New Product</h2>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <input v-model="form.name" placeholder="Name" class="input" required>
          <input v-model="form.sku" placeholder="SKU" class="input" required>
          <input v-model="form.price" type="number" placeholder="Price" class="input" required>
          <input v-model="form.stock" type="number" placeholder="Stock" class="input">
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showModal=false" class="btn-secondary">Cancel</button>
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

const products = ref([]);
const showModal = ref(false);
const form = reactive({ name: '', sku: '', price: 0, stock: 0 });

const fetchProducts = async () => {
  const res = await api.get('/products');
  products.value = res.data;
};

const saveProduct = async () => {
  await api.post('/products', form);
  showModal.value = false;
  fetchProducts();
};

const openModal = () => {
  form.name = ''; form.sku = ''; form.price = 0; form.stock = 100;
  showModal.value = true;
};

onMounted(fetchProducts);
</script>