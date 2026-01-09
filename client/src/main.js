import { createApp } from 'vue'
import './style.css' // Ensure Tailwind styles are loaded
import App from './App.vue'
import router from './router' // <--- Import Router
import { createI18n } from 'vue-i18n'

// Simple i18n setup (Empty for now to prevent errors)
import en from './locales/en.json'
import vi from './locales/vi.json'
const i18n = createI18n({
    legacy: false,

    // CHANGE THIS LINE:
    // Check LocalStorage first (saved user preference), otherwise default to 'vi'
    locale: localStorage.getItem('user-locale') || 'en',

    fallbackLocale: 'en', // Use English if a Vietnamese translation is missing
    messages: {
        en,
        // en
    }
})

const app = createApp(App)

app.use(router) // <--- Use Router
app.use(i18n)
app.mount('#app')