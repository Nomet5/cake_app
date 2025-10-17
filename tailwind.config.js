/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Основная палитра пекарни из изображения
        bakery: {
          white: '#FFFFFF',        // Чистый белый
          snow: '#F8F9FA',         // Свежий снег
          apricot: '#E27B58',      // Абрикосовый рассвет
          crust: '#D4A574',        // Золотистая корочка
          chocolate: '#8B4513',    // Горький шоколад
          olive: '#68BE23',        // Оливковая ветвь
          berry: '#DC143C',        // Ягодный взрыв
          caramel: '#2D1B00',      // Карамельная глазурь
        },
        // Альтернативная нумерация для градиентов
        primary: {
          50: '#FFFFFF',      // Чистый белый
          100: '#F8F9FA',     // Свежий снег
          200: '#E27B58',     // Абрикосовый рассвет
          300: '#D4A574',     // Золотистая корочка
          400: '#68BE23',     // Оливковая ветвь
          500: '#DC143C',     // Ягодный взрыв
          600: '#8B4513',     // Горький шоколад
          700: '#2D1B00',     // Карамельная глазурь
        }
      },
      
      // Кастомные градиенты
      backgroundImage: {
        'bakery-light': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
        'apricot-gradient': 'linear-gradient(135deg, #E27B58 0%, #D4A574 100%)',
        'fresh-gradient': 'linear-gradient(135deg, #68BE23 0%, #8B4513 100%)',
      },
      
      // Кастомные тени
      boxShadow: {
        'bakery-soft': '0 4px 20px rgba(139, 69, 19, 0.1)',
        'bakery-medium': '0 8px 32px rgba(139, 69, 19, 0.15)',
        'bakery-hard': '0 15px 40px rgba(139, 69, 19, 0.2)',
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