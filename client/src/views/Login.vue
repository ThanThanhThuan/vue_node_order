<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="card p-8 w-96">
      <h1 class="text-2xl font-bold mb-4 text-center">{{$t('auth.login')}} OMS</h1>
      <form @submit.prevent="handleLogin">
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input mb-4" placeholder="admin@oms.com" required>
        <button type="submit" class="btn-primary w-full">{{$t('auth.access_system')}}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const email = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    // Simple check: The backend should just check if email exists in 'users' table
    const res = await api.post('/auth/login', { email: email.value });
    
    // Store user
    localStorage.setItem('user', JSON.stringify(res.data.user));
    router.push('/dashboard');
  } catch (e) {
    alert("Access Denied: Email not found.");
  }
};
</script>