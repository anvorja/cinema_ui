/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Sombras personalizadas para efectos glassmórficos
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },

      // Animaciones personalizadas
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },

      // Keyframes para las animaciones
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.5), 0 0 15px rgba(59, 130, 246, 0.5)'
          },
          '100%': {
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.8)'
          },
        },
      },

      // Colores personalizados para el tema glassmórfico
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.1)',
        },
      },

      // Backdrop blur personalizado
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px',
      },

      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    // Plugin para agregar utilidades de glassmorphism
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-effect': {
          'backdrop-filter': 'blur(16px) saturate(180%)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-effect-dark': {
          'backdrop-filter': 'blur(16px) saturate(180%)',
          'background-color': 'rgba(0, 0, 0, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-shadow': {
          'text-shadow': '2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '4px 4px 8px rgba(0, 0, 0, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}