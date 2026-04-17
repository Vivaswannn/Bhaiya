import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        violet: '#7B5BFF',
        'violet-dim': 'rgba(123,91,255,0.18)',
        'open-green': '#00dc64',
        'closed-red': '#ff7070',
        'bg-dark': '#07071c',
        'bg-light': '#f5f4fe',
      },
    },
  },
  plugins: [],
}
export default config
