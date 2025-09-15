/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: '#f9a828', // A vibrant accent color
        'primary-dark': '#f59e0b',
        dark: '#121212', // Slightly darker for more depth
        'dark-2': '#1e1e1e',
        light: '#ffffff',
        grey: '#9ca3af',
        'light-grey': '#f3f4f6',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(249, 168, 40, 0.3)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #121212 0%, #000000 100%)',
      },
    },
  },
  plugins: [],
}
