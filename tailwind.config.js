/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFBF7',
          100: '#FAF5EC',
          200: '#F4EADA',
          300: '#EBDDC7',
          400: '#DFCDB4',
        },
        clay: {
          dark: '#3D2817',
          DEFAULT: '#523824',
          light: '#7A583E'
        },
        terracotta: {
          DEFAULT: '#E26D5C',
          dark: '#C85342',
          light: '#F49082',
          soft: '#FDECE9'
        },
        sunny: {
          DEFAULT: '#F3B749',
          dark: '#D99B26',
          light: '#FBD47D',
          soft: '#FEF6E4'
        },
        sage: {
          DEFAULT: '#6EA888',
          dark: '#528C6C',
          light: '#9BC7AF',
          soft: '#EBF4EF'
        },
        skywood: {
          DEFAULT: '#6AA8C8',
          dark: '#4D8AA8',
          light: '#9AC9E0',
          soft: '#EAF4F9'
        },
        plum: {
          DEFAULT: '#9A7AA0',
          dark: '#7A5B80',
          light: '#BA9EC0',
          soft: '#F4EEF6'
        }
      },
      fontFamily: {
        bubble: ['"Fredoka"', 'system-ui', 'sans-serif'],
        hand: ['"Comic Neue"', '"Fredoka"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'clay-sm': '0 3px 0 0 #3D2817',
        'clay': '0 6px 0 0 #3D2817',
        'clay-lg': '0 9px 0 0 #3D2817',
        'clay-active': '0 2px 0 0 #3D2817',
        'paper-card': '4px 5px 0px 0px rgba(61,40,23,0.15)',
      },
      borderRadius: {
        'wobbly-1': '255px 15px 225px 15px/15px 225px 15px 255px',
        'wobbly-2': '20px 255px 20px 255px/255px 20px 255px 20px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'bounce-gentle': 'bounceGentle 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'wiggle': 'wiggle 0.8s ease-in-out infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(1.5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
