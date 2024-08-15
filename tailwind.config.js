/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('tailwindcss-animate')],
  daisyui: {
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
    themes: [
      {
        pastel: {
          ...require('daisyui/src/theming/themes')['pastel'],
          'color-scheme': 'light',
        },
        dracula: {
          ...require('daisyui/src/theming/themes')['dracula'],
          primary: '#bd93f9',
          secondary: '#ffb86c',
          tertiary: '#ff79c6',
          'color-scheme': 'dark',
        },
      },
    ],
  },
}
