// app/admin/users/[id]/components/user-activity.jsx
'use client'

import { useState } from 'react'
import { 
  AnimatedContainer, 
  AnimatedList,
  AnimatedCard,
  FloatingElement,
  SubtleHover,
  AnimatedButton
} from '../../../Components/animation-component'

export default function UserActivity({ user }) {
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Собираем активность из разных источников
  const activities = []

  // Добавляем заказы как активность
  if (user.orders) {
    user.orders.slice(0, 5).forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `Создан заказ #${order.id}`,
        date: order.createdAt,
        icon: '🛒',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500'
      })
    })
  }

  // Добавляем отзывы как активность
  if (user.reviews) {
    user.reviews.slice(0, 5).forEach(review => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review',
        message: `Оставлен отзыв на "${review.product?.name || 'товар'}"`,
        date: review.createdAt,
        icon: '⭐',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500'
      })
    })
  }

  // Добавляем регистрацию как активность
  activities.push({
    id: 'registration',
    type: 'registration',
    message: 'Зарегистрирован в системе',
    date: user.createdAt,
    icon: '👤',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500'
  })

  // Сортируем по дате (новые сверху)
  activities.sort((a, b) => new Date(b.date) - new Date(a.date))

  const displayedActivities = showAll ? activities : activities.slice(0, 5)

  const handleToggleShowAll = async () => {
    setIsLoading(true)
    // Имитация загрузки данных
    await new Promise(resolve => setTimeout(resolve, 500))
    setShowAll(!showAll)
    setIsLoading(false)
  }

  if (activities.length === 0) {
    return (
      <AnimatedCard 
        animation="scaleIn" 
        delay={200}
        className="p-6"
      >
        <div className="text-center py-12">
          <FloatingElement speed="slow" className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto hover-lift transition-all duration-300">
              <svg className="w-10 h-10 text-gray-400 icon-animated" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </FloatingElement>
          <AnimatedContainer animation="fadeInUp" delay={300}>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Активности нет</h4>
          </AnimatedContainer>
          <AnimatedContainer animation="fadeInUp" delay={400}>
            <p className="text-gray-500">Пользователь еще не проявлял активность</p>
          </AnimatedContainer>
        </div>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard 
      animation="fadeInUp" 
      delay={100}
      className="p-6 relative overflow-hidden"
    >
      {/* Декоративные элементы как в layout */}
      <FloatingElement speed="slow">
        <div className="absolute top-2 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-20 pointer-events-none"></div>
      </FloatingElement>
      <FloatingElement speed="normal">
        <div className="absolute bottom-4 left-6 w-1 h-1 bg-purple-300 rounded-full opacity-15 pointer-events-none"></div>
      </FloatingElement>
      
      <div className="flex items-center justify-between mb-6">
        <AnimatedContainer animation="fadeInLeft" delay={150}>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></span>
            Последняя активность
          </h3>
        </AnimatedContainer>
        
        <AnimatedContainer animation="fadeInRight" delay={150}>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover-lift transition-all duration-300">
              {activities.length} действий
            </span>
          </div>
        </AnimatedContainer>
      </div>
      
      <div className="space-y-3">
        <AnimatedList
          items={displayedActivities}
          animation="fadeInUp"
          staggerDelay={80}
          renderItem={(activity, index) => (
            <SubtleHover className="w-full">
              <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover-lift transition-all duration-300 group admin-transition">
                <div className="flex-shrink-0 relative">
                  <div className={`h-12 w-12 ${activity.bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 hover-glow`}>
                    <span className="text-lg text-white icon-animated">{activity.icon}</span>
                  </div>
                  {/* Индикатор новой активности */}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse-gentle"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 animate-pulse-gentle"></span>
                    {formatDate(activity.date)}
                  </p>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-gentle"></div>
                </div>
              </div>
            </SubtleHover>
          )}
        />
      </div>

      {activities.length > 5 && (
        <AnimatedContainer animation="fadeInUp" delay={500} className="mt-6 pt-6 border-t border-gray-200">
          <AnimatedButton
            variant="ghost"
            size="md"
            loading={isLoading}
            onClick={handleToggleShowAll}
            className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group"
          >
            {showAll ? (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-y-1 icon-animated" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Скрыть
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-1 icon-animated" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Показать всю активность ({activities.length})
              </>
            )}
          </AnimatedButton>
        </AnimatedContainer>
      )}

      {/* Progress indicator при загрузке */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center space-y-3">
            <div className="loader-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="text-sm text-gray-500">Загрузка...</span>
          </div>
        </div>
      )}
    </AnimatedCard>
  )
}