/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      // Custom animations for drag and drop
      animation: {
        'bounce-gentle': 'bounce 1s ease-in-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Custom colors for better kanban experience
      colors: {
        kanban: {
          todo: '#f3f4f6',
          progress: '#dbeafe', 
          done: '#d1fae5',
          card: '#ffffff',
          hover: '#f9fafb'
        }
      }
    },
  },
  plugins: [],
}