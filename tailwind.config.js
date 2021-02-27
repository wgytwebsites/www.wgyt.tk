module.exports = {
  purge: {
    enabled: true,
    layers: ['base', 'components', 'utilities'],
    content: ['./**/*.html'],
  },

  darkMode: 'class', // or 'media' or 'false'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),]
}