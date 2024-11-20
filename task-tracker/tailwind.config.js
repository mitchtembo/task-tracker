/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-custom': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }, keyframes: {
        pulse: {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: 0.8,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
           },
        },
      }
    },
  },
  plugins: [],
}