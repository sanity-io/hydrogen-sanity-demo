module.exports = {
  purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  variants: {},
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};
