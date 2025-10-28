/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Обновленная палитра - темнее и насыщеннее
        bakery: {
          50: '#FFF8F0',      // Более насыщенный кремовый
          100: '#FEF0E0',     // Насыщенный теплый белый
          150: '#FAE8D5',     // Более темный мягкий крем
          200: '#F5DCC0',     // Насыщенный пудровый
          250: '#F0D0A8',     // Более насыщенный бежевый

          // Теплые акцентные цвета - темнее и насыщеннее
          300: '#FF8A5C',     // Более насыщенный персиковый
          400: '#FF6B3A',     // Насыщенный абрикосовый
          500: '#E85A2E',     // Более темная терракота

          // Золотые тона - темнее и насыщеннее
          600: '#E0A45C',     // Насыщенное светлое золото
          700: '#D49448',     // Более темное медовое золото
          800: '#C78232',     // Насыщенная золотистая корочка

          // Натуральные тона - темнее
          900: '#7DA342',     // Более темная свежая зелень
          950: '#6B8F38',     // Насыщенный оливковый

          // Шоколадные и кофейные тона - темнее
          1000: '#9C623F',    // Более насыщенная карамель
          1050: '#7A4A2A',    // Темный молочный шоколад
          1100: '#5C3718',    // Насыщенный горький шоколад
          1150: '#42200C',    // Более темный эспрессо

          // Ягодные акценты - темнее и насыщеннее
          1200: '#FF5A7A',    // Насыщенный клубничный
          1250: '#E84265',    // Более темная малина
          1300: '#CC2A4F',    // Насыщенный вишневый
        }
      },

      // Обновленные градиенты с более насыщенными цветами
      backgroundImage: {
        'bakery-light': 'linear-gradient(135deg, #FFF8F0 0%, #FEF0E0 100%)',
        'apricot-gradient': 'linear-gradient(135deg, #E85A2E 0%, #E0A45C 100%)',
        'fresh-gradient': 'linear-gradient(135deg, #7DA342 0%, #7A4A2A 100%)',
      },

      // Более насыщенные тени
      boxShadow: {
        'bakery-soft': '0 4px 20px rgba(122, 74, 42, 0.15)',
        'bakery-medium': '0 8px 32px rgba(122, 74, 42, 0.2)',
        'bakery-hard': '0 15px 40px rgba(122, 74, 42, 0.25)',
      },

      // Анимации
      fontSize: {
        // Mobile First подход
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.005em' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0em' }],      // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.015em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.025em' }],          // 48px
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],        // 60px
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.035em' }],        // 72px

        // Адаптивные размеры для разных экранов
        'responsive-sm': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0.01em',
          }
        ],
        'responsive-base': [
          '1rem',
          {
            lineHeight: '1.5rem',
            letterSpacing: '0.005em',
          }
        ],
        'responsive-lg': [
          '1.125rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '0em',
          }
        ],
        'responsive-xl': [
          '1.25rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '-0.005em',
          }
        ],
        'responsive-2xl': [
          '1.5rem',
          {
            lineHeight: '2rem',
            letterSpacing: '-0.01em',
          }
        ],
        'responsive-3xl': [
          '1.875rem',
          {
            lineHeight: '2.25rem',
            letterSpacing: '-0.015em',
          }
        ],
        'responsive-4xl': [
          '2.25rem',
          {
            lineHeight: '2.5rem',
            letterSpacing: '-0.02em',
          }
        ],
        'responsive-5xl': [
          '3rem',
          {
            lineHeight: '1',
            letterSpacing: '-0.025em',
          }
        ],
      },

      // Кастомные шрифты
      fontFamily: {
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Roboto', 'system-ui', 'sans-serif'],     // Для заголовков
        'body': ['Inter', 'system-ui', 'sans-serif'],         // Для основного текста
      },

      // Font weights
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },

      // Letter spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },

      // Line height
      lineHeight: {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
    },

  },
  plugins: [],
}