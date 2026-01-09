<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    <main class="page-container">
      <h1 class="text-3xl mb-6">{{ $t('menu.dashboard') }}</h1>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card p-6 border-l-4 border-blue-500">
          <h3 class="text-gray-500">{{ $t('dashboard.total_orders') }}</h3>
          <p class="text-3xl font-bold mt-2">{{ stats.totalOrders }}</p>
        </div>
        <div class="card p-6 border-l-4 border-green-500">
          <h3 class="text-gray-500">{{ $t('dashboard.revenue') }}</h3>
          <p class="text-3xl font-bold mt-2">${{ formatMoney(stats.revenue) }}</p>
        </div>
      </div>

      <!-- Status Chart (Simple List for MVP) -->
      <div class="card p-6">
        <h3 class="text-lg font-bold mb-4">{{$t('status.order_status_breakdown')}}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="s in stats.statusBreakdown" :key="s.status" class="bg-gray-50 p-4 rounded text-center">
            <span :class="statusBadge(s.status)" class="px-2 py-1 rounded text-xs font-bold">{{ s.status }}</span>
            <p class="text-xl font-bold mt-2">{{ s.count }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import api from '../api/axios';

const stats = ref({ totalOrders: 0, revenue: 0, statusBreakdown: [] });

// onMounted0(async () => {
//     const res = await api.get('/orders/stats');
//     stats.value = res.data;
// });

onMounted(async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Build query params
    const params = new URLSearchParams();
    if (user.role === 'CUSTOMER') {
        params.append('userId', user.id);
    }

    const res = await api.get(`/orders/stats?${params.toString()}`);
    stats.value = res.data;
});

const formatMoney = (val) => Number(val).toLocaleString();
const statusBadge = (s) => {
    if(s === 'NEW') return 'bg-blue-100 text-blue-800';
    if(s === 'COMPLETED') return 'bg-green-100 text-green-800';
    if(s === 'CANCELLED') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
};
</script>