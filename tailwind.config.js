/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html,js}",
    "./src/**/*.{html,js}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#5b4bf6',
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3'
        },
        pastel: {
          pink: '#fdf2f8',
          pinkBorder: '#fbcfe8',
          pinkText: '#db2777',
          blue: '#f0f9ff',
          blueBorder: '#bae6fd',
          blueText: '#0284c7',
          peach: '#fff7ed',
          peachBorder: '#fed7aa',
          peachText: '#ea580c',
          teal: '#f0fdfa',
          tealBorder: '#99f6e4',
          tealText: '#0d9488',
          purple: '#faf5ff',
          purpleBorder: '#e9d5ff',
          purpleText: '#7e22ce'
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d'
        },
        gemma: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(99, 102, 241, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'app': '0 25px 60px -15px rgba(91, 75, 246, 0.15)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
}
