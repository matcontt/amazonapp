/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'navy-red': '#FF0000',    // Rojo navideño
        'navy-green': '#008000',  // Verde navideño
        'navy-gold': '#FFD700',   // Dorado navideño
        'snow-pattern': '#F0F8FF', // Blanco con vibe nieve
        'dark-snow': '#1A2A44',   // Gris oscuro navideño
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('christmas', '.christmas &');
      addVariant('christmas-dark', '.christmas-dark &');
    },
  ],
};