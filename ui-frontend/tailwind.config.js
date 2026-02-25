export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        workspace: {
          darkest: '#0b0b0d',
          dark: '#121214',
          panel: '#18181b',
          border: '#27272a',
        },
        accent: {
          primary: '#4f46e5',
          hover: '#6366f1',
        }
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-in forwards',
      },
    },
  },
  plugins: [],
}