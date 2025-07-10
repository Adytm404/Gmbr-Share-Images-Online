/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Ini wajib untuk fitur dark/light mode
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}", // Sesuaikan dengan struktur project
  ],
  theme: {
    extend: {
      colors: {
        // Extend warna sesuai kebutuhan
        slate: {
          900: '#0f172a',
        }
      },
    },
  },
  plugins: [],
}