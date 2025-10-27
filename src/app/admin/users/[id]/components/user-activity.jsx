// app/admin/users/[id]/components/user-activity.jsx
'use client'

import { useState } from 'react'

export default function UserActivity({ user }) {
  const [showAll, setShowAll] = useState(false)
  
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
        color: 'from-blue-500 to-cyan-500'
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
        color: 'from-yellow-500 to-orange-500'
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
    color: 'from-green-500 to-emerald-500'
  })

  // Сортируем по дате (новые сверху)
  activities.sort((a, b) => new Date(b.date) - new Date(a.date))

  const displayedActivities = showAll ? activities : activities.slice(0, 5)

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Последняя активность
        </h3>
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Активности нет</h4>
          <p className="text-gray-500">Пользователь еще не проявлял активность</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Последняя активность
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full animate-fade-in">
            {activities.length} действий
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {displayedActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover-lift transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 relative">
              <div className={`h-12 w-12 bg-gradient-to-r ${activity.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-lg text-white">{activity.icon}</span>
              </div>
              {/* Индикатор новой активности */}
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 animate-pulse"></span>
                {formatDate(activity.date)}
              </p>
            </div>
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 5 && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-all duration-300 hover-lift flex items-center justify-center group"
          >
            {showAll ? (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Скрыть
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Показать всю активность ({activities.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}