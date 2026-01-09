import { createRouter, createWebHistory } from 'vue-router';

// Import your views
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import OrderList from '../views/OrderList.vue';
import ProductList from '../views/ProductList.vue';
import CustomerList from '../views/CustomerList.vue';


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/orders', component: OrderList },
    { path: '/products', component: ProductList },
    { path: '/customers', component: CustomerList },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;