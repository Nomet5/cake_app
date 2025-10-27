// components/admin/dashboard/recent-activities.jsx
'use client'

import { Calendar, User, ShoppingCart, Package, Clock } from 'lucide-react'
import Link from 'next/link'

const ActivityItem = ({ type, title, description, time, user, icon: Icon }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex-shrink-0">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <span className="text-xs text-gray-500 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {time}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      {user && (
        <p className="text-xs text-gray-500 mt-1">Пользователь: {user}</p>
      )}
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
      description: `Сумма: ₽${order.totalAmount}`,
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
      description: `Цена: ₽${product.price}`,
      time: formatTime(product.createdAt),
      user: product.chef?.businessName,
      icon: Package
    })) || [])
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

  // Если нет активностей, показываем заглушку
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние активности</h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Активности не найдены</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Последние активности</h3>
        <Link 
          href="/admin/activities" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Посмотреть все
        </Link>
      </div>
      
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            type={activity.type}
            title={activity.title}
            description={activity.description}
            time={activity.time}
            user={activity.user}
            icon={activity.icon}
          />
        ))}
      </div>
    </div>
  )
}