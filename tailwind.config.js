/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1e1e1e',
        primary: '#F7941E',  
        success: '#21dd74',  
        dark: {
          100: '#353535',
          200: '#2a2a2a',
          300: '#1e1e1e',
          400: '#1C1C1C',
        }
      },
    },
  },
  plugins: [],
}