/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Основная палитра пекарни из изображения
        bakery: {
          50: '#FFFEFC',      // Теплый белый - основной фон
          100: '#FDFAF7',     // Кремовый снег - вторичный фон
          150: '#FAF6F2',     // Мягкий крем - карточки
          200: '#F5F1EC',     // Пудровый - разделители
          
          // Теплые акцентные цвета
          300: '#FF9E7A',     // Персиковый рассвет - ховер-акценты
          400: '#FF8A5C',     // Абрикосовый закат - основные кнопки
          500: '#E8714A',     // Терракотовый - активные состояния
          
          // Золотые тона выпечки
          600: '#E3B574',     // Светлое золото - вторичные кнопки
          700: '#D4A15A',     // Медовое золото - акценты
          800: '#C1893E',     // Золотистая корочка - важные элементы
          
          // Натуральные тона
          900: '#8CB452',     // Свежая зелень - успех, эко
          950: '#76A341',     // Оливковый - активная зелень
          
          // Шоколадные и кофейные тона
          1000: '#A86F4D',    // Карамельный латте - нейтральные акценты
          1050: '#8B5A3A',    // Молочный шоколад - текст средний
          1100: '#5D3A1F',    // Горький шоколад - основной текст
          1150: '#3D2614',    // Эспрессо - заголовки
          
          // Ягодные акценты
          1200: '#FF6B8B',    // Клубничный щербет - акции
          1250: '#E85775',    // Малиновый джем - важные акции
          1300: '#D13A5C',    // Вишневый сироп - скидки
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