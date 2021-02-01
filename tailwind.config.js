module.exports = {
  purge: {
    enabled: true,
    layers: ['base', 'components', 'utilities'],
    content: ['./**/*.html'],
  },

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
