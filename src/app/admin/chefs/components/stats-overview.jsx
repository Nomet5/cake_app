// app/admin/chefs/components/stats-overview.jsx
'use client'

import { useState, useEffect } from 'react'
import { 
  AnimatedContainer, 
  AnimatedCounter, 
  FloatingElement, 
} from '../../Components/animation-component'

export default function ChefStatsOverview({ stats }) {
  const [hasAnimated, setHasAnimated] = useState(false)

  const statItems = [
    {
      key: 'total',
      label: 'Всего поваров',
      value: stats?.total || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: '👨‍🍳',
      description: 'Зарегистрировано в системе',
      delay: 0
    },
    {
      key: 'active',
      label: 'Активных',
      value: stats?.active || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✅',
      description: 'Работают сейчас',
      delay: 100
    },
    {
      key: 'verified',
      label: 'Верифицированных',
      value: stats?.verified || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: '⭐',
      description: 'Прошли проверку',
      delay: 200
    },
    {
      key: 'withProducts',
      label: 'С товарами',
      value: stats?.withProducts || 0,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '🍰',
      description: 'Имеют товары',
      delay: 300
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const calculatePercentage = (value, total = stats?.total || 1) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
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
                h-full flex flex-col
                shadow-sm hover:shadow-md
              `}
            >
              {/* Верхняя часть с иконкой и значением */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                  <span className="text-2xl text-white">
                    {item.icon}
                  </span>
                </div>
                <div className="text-right">
                  <AnimatedCounter 
                    value={item.value}
                    duration={2000}
                    className={`text-3xl font-bold ${item.textColor}`}
                    format={true}
                  />
                </div>
              </div>

              {/* Заголовок и описание */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>

              {/* Прогресс-бар и процент */}
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {calculatePercentage(item.value)}% от общего числа
                  </span>
                  {item.value > 0 && (
                    <span className="text-xs font-medium text-green-600 flex items-center">
                      <svg 
                        className="w-3 h-3 mr-1" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Активно
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out`}
                    style={{ 
                      width: hasAnimated ? `${calculatePercentage(item.value)}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </FloatingElement>
        </AnimatedContainer>
      ))}

      {/* Общая сводка по поварам */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={400}
        duration="normal"
        className="col-span-full"
      >
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FloatingElement speed="slow">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-xl text-white">👨‍🍳</span>
                </div>
              </FloatingElement>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">Общая статистика поваров</h3>
                <p className="text-gray-600 mt-1">
                  Аналитика активности и эффективности поваров
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <AnimatedCounter 
                value={stats?.total || 0}
                duration={2500}
                className="text-3xl font-bold text-orange-600"
                format={true}
              />
              <div className="text-sm text-gray-500 font-medium">всего поваров</div>
            </div>
          </div>

          {/* Детальная аналитика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-orange-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{calculatePercentage(stats?.active || 0)}%</div>
              <div className="text-sm text-gray-600 mt-1">Активных</div>
              <div className="text-xs text-gray-500">Работают сейчас</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{calculatePercentage(stats?.verified || 0)}%</div>
              <div className="text-sm text-gray-600 mt-1">Верифицированы</div>
              <div className="text-xs text-gray-500">Прошли проверку</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{calculatePercentage(stats?.withProducts || 0)}%</div>
              <div className="text-sm text-gray-600 mt-1">С товарами</div>
              <div className="text-xs text-gray-500">Имеют товары</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.averageProducts || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Среднее товаров</div>
              <div className="text-xs text-gray-500">На повара</div>
            </div>
          </div>

          {/* Дополнительные показатели */}
          <div className="mt-6 pt-6 border-t border-orange-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Активных поваров: <strong>{stats?.active || 0}</strong>
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Верифицировано: <strong>{stats?.verified || 0}</strong>
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Общее количество товаров: <strong>{stats?.totalProducts || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}