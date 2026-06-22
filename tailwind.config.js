/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        panel: '#11141a',
        panel2: '#161a22',
        border: '#232834',
        accent: '#5865f2',
        accent2: '#7289da',
      },
    },
  },
  plugins: [],
};
