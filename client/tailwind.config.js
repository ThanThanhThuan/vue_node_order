/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Set Inter as default
            },
            colors: {
                // Corporate Brand Colors (Blue/Indigo)
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6', // Primary Blue
                    600: '#2563eb', // Hover Blue
                    700: '#1d4ed8', // Active Blue
                    900: '#1e3a8a', // Deep Navy
                }
            }
        },
    },
    plugins: [],
}