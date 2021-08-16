module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'regal-blue': '#214563',
      },
      width: {
        'customWidth': '85.7142857%',
        'customeMenuWidth': '80%'
      },
      height: {
        'customHeight': '95.7142857%',
      },
      fontFamily: {
        'menuFontFamily': ['Calibri']
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      display: ["group-hover"]
    },
  },
  plugins: [],
}
