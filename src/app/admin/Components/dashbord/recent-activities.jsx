// src/app/admin/Components/admin/dashboard/recent-activities.jsx
'use client'

import { Calendar, User, ShoppingCart, Package, Clock } from 'lucide-react'
import Link from 'next/link'

const ActivityItem = ({ type, title, description, time, user, icon: Icon, delay = 0 }) => (
  <div 
    className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover-lift transition-all duration-300 group animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex-shrink-0 relative">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-5 w-5 text-white" />
      </div>
      {/* Индикатор новой активности */}
      {delay === 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </p>
        <span className="text-xs text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded-full">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {user && (
        <p className="text-xs text-gray-500 flex items-center">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 animate-pulse"></span>
          Пользователь: {user}
        </p>
      )}
    </div>
    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
  </div>
)

export default function RecentActivities({ stats }) {
  const { recent } = stats

  // Форматируем время для отображения
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} мин назад`
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`
    } else {
      return `${diffDays} дн назад`
    }
  }

  // Создаем демо-активности на основе реальных данных
  const activities = [
    ...(recent.orders?.slice(0, 3).map(order => ({
      type: 'order',
      title: `Новый заказ #${order.id}`,
      description: `Сумма: ₽${order.totalAmount?.toLocaleString() || '0'}`,
      time: formatTime(order.createdAt),
      user: order.user?.firstName || order.user?.email,
      icon: ShoppingCart
    })) || []),
    ...(recent.users?.slice(0, 2).map(user => ({
      type: 'user',
      title: 'Новый пользователь',
      description: user.email,
      time: formatTime(user.createdAt),
      user: user.firstName,
      icon: User
    })) || []),
    ...(recent.products?.slice(0, 2).map(product => ({
      type: 'product',
      title: `Добавлен товар: ${product.name}`,
      description: `Цена: ₽${product.price?.toLocaleString() || '0'}`,
      time: formatTime(product.createdAt),
      user: product.chef?.businessName,
      icon: Package
    })) || [])
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

  // Если нет активностей, показываем заглушку
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Последние активности
        </h3>
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Активности не найдены</h4>
          <p className="text-gray-500">Нет недавних действий в системе</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Последние активности
        </h3>
        <Link 
          href="/admin/activities" 
          className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover-lift flex items-center group"
        >
          Посмотреть все
          <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            type={activity.type}
            title={activity.title}
            description={activity.description}
            time={activity.time}
            user={activity.user}
            icon={activity.icon}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Индикатор количества активностей */}
      <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Показано {activities.length} из {recent.orders?.length + recent.users?.length + recent.products?.length} активностей
          </span>
        </div>
      </div>
    </div>
  )
}