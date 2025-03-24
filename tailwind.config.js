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
  safelist: [
    // Safelist colors for daisyUI
    'bg-emerald-100',
    'bg-emerald-200',
    'bg-emerald-300',
    'bg-emerald-400',
    'bg-emerald-500',
    'bg-emerald-600',
    'bg-sky-100',
    'bg-sky-200',
    'bg-sky-300',
    'bg-sky-400',
    'bg-sky-500',
    'bg-sky-600',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
  ],
}
