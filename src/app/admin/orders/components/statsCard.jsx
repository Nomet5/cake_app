// src/app/admin/Components/StatsCard.jsx
'use client'

import { 
  AnimatedContainer, 
  AnimatedCounter, 
  FloatingElement 
} from '../../Components/animation-component'

export default function StatsCard({ title, value, icon, color = 'blue', trend, description, isPrice = false }) {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100 text-green-600'
    },
    yellow: {
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100 text-yellow-600'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100 text-red-600'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  const getTrendInfo = () => {
    if (!trend) return null;
    
    if (trend.value > 0) {
      return { text: `↑ ${Math.abs(trend.value)}% ${trend.label}`, color: 'text-green-600' };
    } else if (trend.value < 0) {
      return { text: `↓ ${Math.abs(trend.value)}% ${trend.label}`, color: 'text-red-600' };
    } else {
      return { text: `→ ${trend.label}`, color: 'text-gray-600' };
    }
  };

  const trendInfo = getTrendInfo();

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="h-full"
    >
      <FloatingElement speed="normal">
        <div 
          className={`
            bg-white rounded-xl border-2 ${config.borderColor} 
            p-6 hover-lift hover-glow transition-all duration-300 
            h-full flex flex-col justify-between
            shadow-sm hover:shadow-md
          `}
        >
          {/* Верхняя часть с иконкой и заголовком */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-2xl mb-2 transform hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {title}
              </h3>
            </div>
            
            {/* Анимированный счетчик */}
            <div className="text-right">
              {isPrice ? (
                <div className={`text-3xl font-bold ${config.textColor}`}>
                  {value.toLocaleString('ru-RU')} ₽
                </div>
              ) : (
                <AnimatedCounter 
                  value={value}
                  duration={2000}
                  className={`text-3xl font-bold ${config.textColor}`}
                  format={true}
                />
              )}
            </div>
          </div>

          {/* Тренд и прогресс-бар */}
          <div className="mb-4">
            {trendInfo && (
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-medium flex items-center ${trendInfo.color}`}>
                  <svg 
                    className="w-3 h-3 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {trendInfo.text}
                </span>
              </div>
            )}

            {/* Прогресс-бар для визуализации */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-2000 ease-out`}
                style={{ 
                  width: '100%', // Можно адаптировать под реальные проценты если нужно
                }}
              />
            </div>
          </div>

          {/* Описание */}
          <div className="mt-auto">
            <p className="text-xs text-gray-500 flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${config.bgColor}`}></span>
              {description || `Статистика по ${title.toLowerCase()}`}
            </p>
          </div>
        </div>
      </FloatingElement>
    </AnimatedContainer>
  );
}