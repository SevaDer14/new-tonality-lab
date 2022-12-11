/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  theme: {
    extend:
    {
      fontFamily: {
        'fira-mono': ['Fira Mono', 'monospace'],
        'fjalla-one': ['Fjalla One', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(at 100% 0%, #537895 0%, #09203F 100%)',
      }
    },
  },
  plugins: [],
}
