import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: {
            50:  '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
          },
          blue: {
            50:  '#eff6ff',
            100: '#dbeafe',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
