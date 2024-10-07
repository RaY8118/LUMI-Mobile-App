/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  content: [],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mregular: ["Moonshine-Regular", "sans-serif"],
        mbold: ["Moonshine-Bold", "sans-serif"],
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        dsbold: ["Dancing-Script-Bold", "sans-serif"],
        dsregular: ["Dancing-Script-Regular", "sans-serif"],
        dsssemibold: ["Dancing-Script-SemiBold", "sans-serif"],
        dsmmedium: ["Dancing-Script-Medium", "sans-serif"],
        ps2pregular: ["PressStart2P-Regular", "sans-serif"],
        pdbold: ["Playfair-Display-Bold", "sans-serif"],
        pdregular: ["Playfair-Display-Regular", "sans-serif"],
        pdblack: ["Playfair-Display-Black", "sans-serif"],
        pdbolditalic: ["Playfair-Display-BoldItalic", "sans-serif"],
        pditalic: ["Playfair-Display-Italic", "sans-serif"],
        pdblackitalic: ["Playfair-Display-BlackItalic", "sans-serif"], 
        nsbold: ["NotoSerif-Bold", "sans-serif"],
        nsregular: ["NotoSerif-Regular", "sans-serif"],
        nsblack: ["NotoSerif-Black", "sans-serif"],
        nsthine: ["NotoSerif-Thin", "sans-serif"],
        nsmmedium: ["NotoSerif-Medium", "sans-serif"],
      },
      colors: {
        custom: {
          red: '#e78d6a',
          white: '#d9d9d9',
          green: '#7db166',
          yellow: '#e1b240',
        },
      },
    },
  },
  plugins: [],
}

