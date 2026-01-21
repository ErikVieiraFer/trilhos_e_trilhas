/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyan-400': '#22d3ee',
        'cyan-500': '#06b6d4',
        'cyan-600': '#0891b2',
        'pink-400': '#f472b6',
        'pink-500': '#ec4899',
        'pink-600': '#db2777',
        'blue-800': '#1e3a5f',
        'blue-900': '#0f172a',
        'blue-950': '#020617',
        'gray-100': '#f3f4f6',
        'gray-900': '#111827',
        'white': '#ffffff',
      }
    },
  },
  plugins: [],
}
