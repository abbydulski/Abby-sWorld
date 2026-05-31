import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E8417A',
          light: '#FFE0EE',
          muted: '#FFD0E5',
        },
        accent: {
          DEFAULT: '#FF1FA3',
          light: '#FFF0F8',
          fill: '#FFE8F4',
        },
        rose: {
          DEFAULT: '#C41F62',
          light: '#FCEEF5',
        },
        surface: '#FFFFFF',
        bg: '#FFF7FA',
        panel: '#FFF0F6',
        border: '#F0B8D0',
        'border-soft': '#FAE5EF',
        text: {
          primary: '#1A0812',
          secondary: '#7A3558',
          tertiary: '#C49AB5',
        },
      },
      fontFamily: {
        sans: ['"Space Mono"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        base: ['13px', { lineHeight: '1.7' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(232,65,122,0.08), 0 0 0 1px rgba(240,184,208,0.4)',
        'card-hover': '0 4px 16px rgba(232,65,122,0.14)',
        panel: '0 8px 40px rgba(232,65,122,0.12), 0 0 0 1px rgba(240,184,208,0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
