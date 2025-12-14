/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury / Editorial Palette - Core
        alabaster: '#F9F8F6',
        charcoal: '#1A1A1A',
        charcoalLight: '#2A2A2A',    // For cards/surfaces in dark mode
        charcoalMuted: '#3A3A3A',    // For elevated elements

        // Warm Neutrals
        taupe: '#EBE5DE',
        taupeLight: '#F5F2ED',       // Lighter variant
        warmGrey: '#8A8580',         // Improved contrast
        warmGreyLight: '#B5AFA9',    // For placeholders
        warmGreyDark: '#5A5652',     // For important muted text

        // Accent Colors
        gold: '#D4AF37',
        goldLight: '#E5C158',        // For dark mode highlights
        goldDark: '#C49B2F',         // For hover states
        goldMuted: '#D4AF3720',      // For subtle backgrounds

        // Semantic Colors
        success: '#4A7C59',
        successLight: '#5A9469',
        error: '#9B4444',
        errorLight: '#B85555',

        // Semantic aliases (keeping backward compatibility)
        background: '#F9F8F6',
        foreground: '#1A1A1A',
        muted: {
          DEFAULT: '#EBE5DE',
          foreground: '#8A8580',
        },
        accent: {
          DEFAULT: '#D4AF37',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'micro': '10px',
      },
      letterSpacing: {
        'luxury': '0.2em',
        'editorial': '0.25em',
        'ultra': '0.3em',
      },
      lineHeight: {
        'tight-luxury': '0.9',
      },
      maxWidth: {
        'luxury': '1600px',
      },
      borderRadius: {
        'none': '0px',
      },
      boxShadow: {
        'luxury-sm': '0 2px 8px rgba(0,0,0,0.02)',
        'luxury': '0 4px 24px rgba(0,0,0,0.08)',
        'luxury-lg': '0 8px 32px rgba(0,0,0,0.12)',
        'luxury-button': '0 4px 16px rgba(0,0,0,0.15)',
        'luxury-button-hover': '0 8px 24px rgba(0,0,0,0.25)',
        'inner-border': 'inset 0 0 0 1px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        '500': '500ms',
        '700': '700ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
