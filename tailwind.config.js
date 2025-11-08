/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gold Theme Colors
        'gold': {
          50: '#FFFBF0',
          100: '#FFF4D6',
          200: '#FFE8AD',
          300: '#FFD700',
          400: '#F5C842',
          500: '#E6B800',
          600: '#D4A017',
          700: '#B8860B',
          800: '#996F00',
          900: '#7A5600',
        },
        'cream': {
          50: '#FFFEF7',
          100: '#FFFCF0',
          200: '#FFF8E1',
          300: '#FFF3C4',
          400: '#FFECB3',
          500: '#FFE082',
          600: '#FFD54F',
          700: '#FFC107',
          800: '#FF8F00',
          900: '#E65100',
        },
        'bmtc': {
          gold: '#D4A017',
          cream: '#FFF8E1',
          white: '#FFFFFF',
          dark: '#2C1810',
          accent: '#B8860B',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'slide-left': 'slideLeft 0.8s ease-out',
        'slide-right': 'slideRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'rotate-in': 'rotateIn 0.8s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'card-hover': 'cardHover 0.3s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'swing': 'swing 1s ease-in-out',
        'wobble': 'wobble 1s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 160, 23, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 160, 23, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 160, 23, 0.7)' },
        },
        cardHover: {
          '0%': { transform: 'translateY(0) rotateX(0)' },
          '100%': { transform: 'translateY(-10px) rotateX(5deg)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        swing: {
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        wobble: {
          '0%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25px) rotate(-5deg)' },
          '30%': { transform: 'translateX(20px) rotate(3deg)' },
          '45%': { transform: 'translateX(-15px) rotate(-3deg)' },
          '60%': { transform: 'translateX(10px) rotate(2deg)' },
          '75%': { transform: 'translateX(-5px) rotate(-1deg)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        'cream-gradient': 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 50%, #FFE082 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
      },
      boxShadow: {
        'gold': '0 10px 25px rgba(212, 160, 23, 0.3)',
        'gold-lg': '0 20px 40px rgba(212, 160, 23, 0.4)',
        'inner-gold': 'inset 0 2px 4px rgba(212, 160, 23, 0.2)',
        '3d': '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)',
        '3d-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
};