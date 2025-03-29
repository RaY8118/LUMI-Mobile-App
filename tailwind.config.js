/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          red: '#e78d6a',
          white: '#d9d9d9',
          green: '#7db166',
          yellow: '#e1b240',
          primary: "#FCBFD4",
          secondary: "#FFD0E2",
          tertiary: "#FDEEF5",
          textprimary: "#DBDAEC",
          textsecondary: "#E9EDF6"
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

