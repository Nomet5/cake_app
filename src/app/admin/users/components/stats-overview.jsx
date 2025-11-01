// app/admin/users/components/stats-overview.jsx
'use client'

import { useState, useEffect } from 'react'
import { 
  AnimatedContainer, 
  AnimatedCounter, 
  FloatingElement, 
} from '../../Components/animation-component' // Обновите путь

export default function StatsOverview({ users }) {
  const [hasAnimated, setHasAnimated] = useState(false)

  const stats = {
    totalUsers: users.length,
    withOrders: users.filter(user => user._count?.orders > 0).length,
    withReviews: users.filter(user => user._count?.reviews > 0).length,
    withChefProfile: users.filter(user => user.chefProfile).length
  }

  const statItems = [
    {
      key: 'totalUsers',
      label: 'Всего пользователей',
      value: stats.totalUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: '👥',
      description: 'Зарегистрировано в системе',
      delay: 0
    },
    {
      key: 'withOrders',
      label: 'С заказами',
      value: stats.withOrders,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '🛒',
      description: 'Совершали покупки',
      delay: 100
    },
    {
      key: 'withReviews',
      label: 'С отзывами',
      value: stats.withReviews,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: '⭐',
      description: 'Оставляли отзывы',
      delay: 200
    },
    {
      key: 'withChefProfile',
      label: 'Повара',
      value: stats.withChefProfile,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '👨‍🍳',
      description: 'Имеют профиль повара',
      delay: 300
    }
  ]

  useEffect(() => {
    // Триггерим анимацию при монтировании
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const calculatePercentage = (value) => {
    return stats.totalUsers > 0 ? Math.round((value / stats.totalUsers) * 100) : 0
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
                  <AnimatedCounter 
                    value={item.value}
                    duration={2000}
                    className={`text-3xl font-bold ${item.textColor}`}
                    format={true}
                  />
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out`}
                    style={{ 
                      width: hasAnimated ? `${calculatePercentage(item.value)}%` : '0%',
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
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
              </div>

              {/* Описание и дополнительная информация */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${item.bgColor}`}></span>
                  {item.description}
                </p>
                
                {/* Дополнительные метрики */}
                {item.key === 'withOrders' && stats.withOrders > 0 && (
                  <div className="text-xs text-gray-400">
                    Средний чек: рассчитывается...
                  </div>
                )}
                
                {item.key === 'withChefProfile' && stats.withChefProfile > 0 && (
                  <div className="text-xs text-gray-400">
                    {Math.round((stats.withChefProfile / stats.totalUsers) * 100)}% от пользователей
                  </div>
                )}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </FloatingElement>
              
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Общая статистика пользователей</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.withOrders > 0 
                    ? `${calculatePercentage(stats.withOrders)}% пользователей совершали заказы` 
                    : 'Пока нет данных о заказах'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <AnimatedCounter 
                value={stats.totalUsers}
                duration={2500}
                className="text-3xl font-bold text-blue-600"
                format={true}
              />
              <div className="text-sm text-gray-500 font-medium">всего пользователей</div>
              
              {/* Дополнительные метрики */}
              <div className="flex space-x-4 mt-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-green-600">{stats.withOrders}</div>
                  <div className="text-gray-500">заказы</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">{stats.withReviews}</div>
                  <div className="text-gray-500">отзывы</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{stats.withChefProfile}</div>
                  <div className="text-gray-500">повара</div>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная аналитика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{calculatePercentage(stats.withOrders)}%</div>
              <div className="text-xs text-gray-600">Совершают заказы</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{calculatePercentage(stats.withChefProfile)}%</div>
              <div className="text-xs text-gray-600">Являются поварами</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats.totalUsers > 0 ? Math.round((stats.withReviews / stats.totalUsers) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">Оставляют отзывы</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats.totalUsers - stats.withOrders}
              </div>
              <div className="text-xs text-gray-600">Без заказов</div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}