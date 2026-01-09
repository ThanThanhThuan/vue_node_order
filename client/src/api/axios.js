import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Points to your Node.js Server
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
// This runs before every request is sent
api.interceptors.request.use(
    (config) => {
        // 1. Send the current language to the backend (for i18n)
        const locale = localStorage.getItem('user-locale') || 'en';
        config.headers['Accept-Language'] = locale;

        // 2. (Optional) If you add JWT later, uncomment this:
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Optional)
// Good for handling global errors like "401 Unauthorized"
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If user is unauthorized, force logout
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;