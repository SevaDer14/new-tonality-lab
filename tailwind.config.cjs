/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend:
    {
      fontFamily: {
        'fira-mono': ['Fira Mono', 'monospace'],
        'fjalla-one': ['Fjalla One', 'sans-serif'],
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(at 100% 0%, #204B6C 0%, #05172F 100%)',
      },
      colors: {
        transparent: 'rgba(255, 255, 255, 0)',
        white: {
          DEFAULT: 'rgba(255, 255, 255, 1)',
          '65': 'rgba(255, 255, 255, 0.65)',
          '25': 'rgba(255, 255, 255, 0.25)',
          '15': 'rgba(255, 255, 255, 0.15)',
          '5': 'rgba(255, 255, 255, 0.05)',
        },
        blue: {
          DEFAULT: 'rgba(0, 189, 249, 1)',
          '65': 'rgba(0, 189, 249, 0.65)',
          '25': 'rgba(0, 189, 249, 0.25)',
          '5': 'rgba(0, 189, 249, 0.05)',
        },
        green: {
          DEFAULT: 'rgba(105, 255, 111, 1)',
          '65': 'rgba(105, 255, 111, 0.65)',
          '25': 'rgba(105, 255, 111, 0.25)',
          '5': 'rgba(105, 255, 111, 0.05)',
        },
        yellow: {
          DEFAULT: 'rgba(255, 230, 0, 1)',
          '65': 'rgba(255, 230, 0, 0.65)',
          '25': 'rgba(255, 230, 0, 0.25)',
          '5': 'rgba(255, 230, 0, 0.05)',
        },
        orange: {
          DEFAULT: 'rgba(255, 177, 61, 1)',
          '65': 'rgba(255, 177, 61, 0.65)',
          '25': 'rgba(255, 177, 61, 0.25)',
          '5': 'rgba(255, 177, 61, 0.05)',
        },
        pink: {
          DEFAULT: 'rgba(255, 61, 177, 1)',
          '65': 'rgba(255, 61, 177, 0.65)',
          '25': 'rgba(255, 61, 177, 0.25)',
          '5': 'rgba(255, 61, 177, 0.05)',
        },
      },
    },
  },
  plugins: [],
}
