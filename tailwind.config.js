/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          mint: "#E8F5E9",
          "mint-light": "#F1F8E9",
          "mint-border": "#C8E6C9",
          "mint-dark": "#2E7D32",
          lavender: "#F3E5F5",
          "lavender-light": "#FBF5FC",
          "lavender-border": "#E1BEE7",
          "lavender-dark": "#7B1FA2",
          cyan: "#E0F7FA",
          "cyan-light": "#E8FBFD",
          "cyan-border": "#B2EBF2",
          "cyan-dark": "#00838F",
          peach: "#FFF3E0",
          "peach-border": "#FFE0B2",
          rose: "#FFEBEE",
          "rose-border": "#FFCDD2",
        },
        slate: {
          header: "#1E293B",
          sub: "#475569",
          dark: "#0F172A",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'pastel-mint': '0 8px 24px -4px rgba(46, 125, 50, 0.12)',
        'pastel-lavender': '0 8px 24px -4px rgba(123, 31, 162, 0.12)',
        'pastel-cyan': '0 8px 24px -4px rgba(0, 131, 143, 0.12)',
        'alert-glow': '0 0 25px rgba(239, 68, 68, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanline 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(46, 125, 50, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(46, 125, 50, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
