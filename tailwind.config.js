/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vs: "#7e501e",
        "zinc-850": "#212122"
      },
      backgroundImage: {
        "image-vs": "url('./assets/background.jpg')"
      }
    }
  },

  plugins: []
}
