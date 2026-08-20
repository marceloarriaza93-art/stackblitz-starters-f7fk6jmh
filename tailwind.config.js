/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Caveat"', 'cursive'],
        body: ['Kalam', '"Comic Neue"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['"Atkinson Hyperlegible"', '"Comic Neue"', 'sans-serif'],
      },
      colors: {
        refugio: {
          bg: '#e6e3ed',
          ink: '#2f2a3a',
          inkSoft: '#5b5470',
          violet: '#b9a7d9',
          green: '#a9c9a4',
          amber: '#c79f6c',
          rose: '#c9968f',
        },
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.4)', opacity: '0.9' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        breathe: 'breathe 8s ease-in-out infinite',
        fadeIn: 'fadeIn 600ms ease-out',
        slideIn: 'slideIn 350ms ease-out',
      },
    },
  },
  plugins: [],
};
