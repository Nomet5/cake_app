// app/admin/users/components/stats-overview.jsx
'use client'

import { useState, useEffect, useRef } from 'react'

export default function StatsOverview({ users }) {
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    withOrders: 0,
    withReviews: 0,
    withChefProfile: 0
  })

  const statsRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const stats = {
    totalUsers: users.length,
    withOrders: users.filter(user => user._count?.orders > 0).length,
    withReviews: users.filter(user => user._count?.reviews > 0).length,
    withChefProfile: users.filter(user => user.chefProfile).length
  }

  const statItems = [
    {
      label: 'Всего пользователей',
      value: stats.totalUsers,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: '👥',
      description: 'Зарегистрировано в системе',
      delay: 0
    },
    {
      label: 'С заказами',
      value: stats.withOrders,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: '🛒',
      description: 'Совершали покупки',
      delay: 0.1
    },
    {
      label: 'С отзывами',
      value: stats.withReviews,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      icon: '⭐',
      description: 'Оставляли отзывы',
      delay: 0.2
    },
    {
      label: 'Повара',
      value: stats.withChefProfile,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      icon: '👨‍🍳',
      description: 'Имеют профиль повара',
      delay: 0.3
    }
  ]

  // Анимация счетчиков
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateCounters()
        }
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [hasAnimated])

  const animateCounters = () => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepTime = duration / steps

    statItems.forEach((item, index) => {
      const targetValue = item.value
      let currentValue = 0
      const increment = targetValue / steps

      const timer = setInterval(() => {
        currentValue += increment
        if (currentValue >= targetValue) {
          currentValue = targetValue
          clearInterval(timer)
        }

        setAnimatedStats(prev => ({
          ...prev,
          [Object.keys(stats)[index]]: Math.floor(currentValue)
        }))
      }, stepTime)
    })
  }

  return (
    <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 hover-lift hover-glow transition-all duration-500 animate-scale-in"
          style={{ animationDelay: `${item.delay}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            {/* Анимированная иконка */}
            <div 
              className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-transform duration-300 hover:scale-110`}
            >
              {item.icon}
            </div>
            
            {/* Анимированный счетчик */}
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 animate-pulse">
                {animatedStats[Object.keys(stats)[index]]}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1">{item.label}</p>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out`}
              style={{ 
                width: hasAnimated ? '100%' : '0%',
                transitionDelay: `${item.delay + 0.2}s`
              }}
            ></div>
          </div>

          {/* Описание */}
          <p className="text-xs text-gray-500 flex items-center">
            <span className="w-1.5 h-1.5 bg-current rounded-full mr-2 animate-pulse"></span>
            {item.description}
          </p>

          {/* Индикатор изменения */}
          {item.value > 0 && (
            <div className={`mt-3 text-xs ${item.textColor} font-medium flex items-center`}>
              <svg 
                className="w-3 h-3 mr-1 animate-bounce" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Активные пользователи
            </div>
          )}
        </div>
      ))}

      {/* Дополнительная статистика */}
      <div className="col-span-full mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Общая статистика</h3>
                <p className="text-sm text-gray-600">
                  {stats.withOrders > 0 ? `${Math.round((stats.withOrders / stats.totalUsers) * 100)}% пользователей совершали заказы` : 'Нет данных о заказах'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500">всего</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}