/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
    './styles/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E3A8A',
          accent: '#F97316'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};

