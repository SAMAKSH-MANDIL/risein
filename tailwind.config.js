/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stellar: {
          50:  '#f0f4ff',
          100: '#e5edff',
          200: '#c8d9ff',
          300: '#93b4ff',
          400: '#6690f5',
          500: '#3e6be8',
          600: '#2d0eab',
          700: '#250887',
          800: '#1d0670',
          900: '#15064c',
          950: '#0d0330',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

