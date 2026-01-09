<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        
        <!-- Left Side: Logo & Links -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center cursor-pointer" @click="$router.push('/dashboard')">
            <span class="text-xl font-bold text-blue-600">OMS System</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/dashboard" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              {{ $t('menu.dashboard') }}
            </router-link>

            <router-link 
              to="/orders" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              {{ $t('menu.orders') }}
            </router-link>
            
            <!-- ADMIN ONLY LINKS -->
            <router-link 
              v-if="userRole === 'ADMIN'" 
              to="/customers" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              {{ $t('menu.customers') }}
            </router-link>

            <router-link 
              v-if="userRole === 'ADMIN'" 
              to="/products" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              {{$t('menu.products')}}
            </router-link>
          </div>
        </div>

        <!-- Right Side: Email & Logout -->
        <div class="flex items-center space-x-4">
          
          <!-- NEW: User Email Label -->
          <span class="text-sm text-gray-600 font-medium hidden md:block">
            {{ userEmail }}
          </span>
          
          <span class="text-gray-300 hidden md:block">|</span>

          <!-- Logout Button -->
          <button 
            @click="handleLogout" 
            class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded text-sm font-medium transition"
          >
            {{ $t('menu.logout') }}
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userRole = ref('');
const userEmail = ref(''); // <--- New State

onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    userRole.value = user.role;
    userEmail.value = user.email; // <--- Set Email
  }
});

const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem('user');
    router.push('/login');
  }
};
</script>