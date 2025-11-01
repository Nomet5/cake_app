// app/admin/products/components/stats-overview.jsx
'use client'

import { useState, useEffect } from 'react'
import { 
  AnimatedContainer, 
  AnimatedCounter, 
  FloatingElement, 
} from '../../Components/animation-component'

export default function StatsOverview({ stats }) {
  const [hasAnimated, setHasAnimated] = useState(false)

  const statItems = [
    {
      key: 'total',
      label: 'Всего продуктов',
      value: stats?.total || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: '📦',
      description: 'Продуктов в системе',
      delay: 0
    },
    {
      key: 'available',
      label: 'Доступно',
      value: stats?.available || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✅',
      description: 'Доступно для заказа',
      delay: 100
    },
    {
      key: 'unavailable',
      label: 'Недоступно',
      value: stats?.unavailable || 0,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '⏸️',
      description: 'Временно недоступно',
      delay: 200
    },
    {
      key: 'averagePrice',
      label: 'Средняя цена',
      value: Math.round(stats?.averagePrice || 0),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: '💰',
      description: 'Средняя стоимость',
      delay: 300,
      isPrice: true
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const calculatePercentage = (value, key) => {
    if (key === 'averagePrice') return 100
    const total = stats?.total || 1
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const getTrendInfo = (key) => {
    if (key === 'available') {
      const percentage = calculatePercentage(stats?.available || 0, 'available')
      return percentage > 70 ? 'Высокая доступность' : 'Требует внимания'
    }
    if (key === 'unavailable') {
      const percentage = calculatePercentage(stats?.unavailable || 0, 'unavailable')
      return percentage > 30 ? 'Много недоступных' : 'В пределах нормы'
    }
    return 'Стабильно'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <AnimatedContainer
          key={item.key}
          animation="fadeInUp"
          delay={item.delay}
          duration="normal"
          className="h-full"
        >
          <FloatingElement speed="normal">
            <div 
              className={`
                bg-white rounded-xl border-2 ${item.borderColor} 
                p-6 hover-lift hover-glow transition-all duration-300 
                h-full flex flex-col justify-between
                shadow-sm hover:shadow-md
              `}
            >
              {/* Верхняя часть с иконкой и заголовком */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-2xl mb-2 transform hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {item.label}
                  </h3>
                </div>
                
                {/* Анимированный счетчик */}
                <div className="text-right">
                  {item.isPrice ? (
                    <div className="text-3xl font-bold text-purple-700">
                      {item.value.toLocaleString()} ₽
                    </div>
                  ) : (
                    <AnimatedCounter 
                      value={item.value}
                      duration={2000}
                      className={`text-3xl font-bold ${item.textColor}`}
                      format={true}
                    />
                  )}
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out`}
                    style={{ 
                      width: hasAnimated ? `${calculatePercentage(item.value, item.key)}%` : '0%',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {item.key === 'averagePrice' ? 'Средний показатель' : `${calculatePercentage(item.value, item.key)}% от общего числа`}
                  </span>
                  {item.value > 0 && item.key !== 'averagePrice' && (
                    <span className={`text-xs font-medium flex items-center ${
                      item.key === 'available' ? 'text-green-600' : 
                      item.key === 'unavailable' ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      <svg 
                        className="w-3 h-3 mr-1" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {getTrendInfo(item.key)}
                    </span>
                  )}
                </div>
              </div>

              {/* Описание */}
              <div className="mt-auto">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.bgColor}`}></span>
                  {item.description}
                </p>
              </div>
            </div>
          </FloatingElement>
        </AnimatedContainer>
      ))}

      {/* Общая сводка */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={400}
        duration="normal"
        className="col-span-full"
      >
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FloatingElement speed="slow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </FloatingElement>
              
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Общая статистика продуктов</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {stats?.available > 0 
                    ? `${calculatePercentage(stats.available, 'available')}% продуктов доступно для заказа` 
                    : 'Нет доступных продуктов'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <AnimatedCounter 
                value={stats?.total || 0}
                duration={2500}
                className="text-3xl font-bold text-blue-600"
                format={true}
              />
              <div className="text-sm text-gray-500 font-medium">всего продуктов</div>
              
              {/* Дополнительные метрики */}
              <div className="flex space-x-4 mt-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-green-600">{stats?.available || 0}</div>
                  <div className="text-gray-500">доступно</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{stats?.unavailable || 0}</div>
                  <div className="text-gray-500">недоступно</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">
                    {Math.round(stats?.averagePrice || 0).toLocaleString()} ₽
                  </div>
                  <div className="text-gray-500">средняя цена</div>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная аналитика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {calculatePercentage(stats?.available || 0, 'available')}%
              </div>
              <div className="text-xs text-gray-600">Доступно для заказа</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {calculatePercentage(stats?.unavailable || 0, 'unavailable')}%
              </div>
              <div className="text-xs text-gray-600">Требуют внимания</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats?.total ? Math.round((stats.available / stats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">Уровень доступности</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats?.total || 0}
              </div>
              <div className="text-xs text-gray-600">Всего в каталоге</div>
            </div>
          </div>

          {/* Мини-график доступности */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Распределение продуктов</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
              {stats?.available > 0 && (
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 transition-all duration-2000"
                  style={{ width: `${calculatePercentage(stats.available, 'available')}%` }}
                  title={`Доступно: ${stats.available}`}
                />
              )}
              {stats?.unavailable > 0 && (
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 transition-all duration-2000"
                  style={{ width: `${calculatePercentage(stats.unavailable, 'unavailable')}%` }}
                  title={`Недоступно: ${stats.unavailable}`}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Доступно</span>
              <span>Недоступно</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}