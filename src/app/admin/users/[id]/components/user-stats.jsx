// app/admin/users/[id]/components/user-stats.jsx
'use client'

import { AnimatedContainer, AnimatedCounter } from '../../../Components/animation-component'

export default function UserStats({ user }) {
  const stats = [
    {
      label: 'Всего заказов',
      value: user._count?.orders || 0,
      icon: '🛒',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      delay: 0
    },
    {
      label: 'Отзывов',
      value: user._count?.reviews || 0,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      delay: 100
    },
    {
      label: 'Адресов',
      value: user._count?.addresses || 0,
      icon: '🏠',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      delay: 200
    },
    {
      label: 'Активных заказов',
      value: user.orders?.filter(order => 
        order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
      ).length || 0,
      icon: '⏳',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      delay: 300
    }
  ]

  // Рассчитываем общую сумму заказов
  const totalSpent = user.orders?.reduce((total, order) => {
    return total + (order.totalAmount || 0)
  }, 0) || 0

  const averageOrder = user._count?.orders > 0 ? Math.round(totalSpent / user._count.orders) : 0

  // Определяем уровень лояльности
  const getLoyaltyLevel = () => {
    const orderCount = user._count?.orders || 0
    if (orderCount >= 10) return { level: 'VIP', percentage: 100 }
    if (orderCount >= 5) return { level: 'Постоянный', percentage: 50 }
    return { level: 'Новый', percentage: Math.min(orderCount * 10, 40) }
  }

  const loyalty = getLoyaltyLevel()

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
        Статистика пользователя
      </h3>
      
      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <AnimatedContainer
            key={index}
            animation="fadeInUp"
            delay={stat.delay}
            duration="normal"
          >
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 group bg-white">
              <div className="flex items-center space-x-3">
                <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-lg text-white">{stat.icon}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.label === 'Активных заказов' ? 'В процессе' : 'Всего'}
                  </p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                <AnimatedCounter 
                  value={stat.value}
                  duration={1500}
                  format={true}
                />
              </div>
            </div>
          </AnimatedContainer>
        ))}
      </div>

      {/* Финансовая статистика */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={400}
        duration="normal"
        className="border-t border-gray-200 pt-6"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          Финансовая статистика
        </h4>
        
        <div className="space-y-4">
          {/* Общая сумма */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Всего потрачено</span>
                <p className="text-xs text-gray-500">За все время</p>
              </div>
            </div>
            <span className="text-xl font-bold text-green-600">
              <AnimatedCounter 
                value={totalSpent}
                duration={2000}
                format={true}
              /> ₽
            </span>
          </div>

          {/* Средний чек */}
          {user._count?.orders > 0 && (
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Средний чек</span>
                  <p className="text-xs text-gray-500">На один заказ</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                <AnimatedCounter 
                  value={averageOrder}
                  duration={1800}
                  format={true}
                /> ₽
              </span>
            </div>
          )}

          {/* Прогресс лояльности */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">👑</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Уровень лояльности</span>
                  <p className="text-xs text-gray-500">На основе активности</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${
                loyalty.level === 'VIP' ? 'text-purple-600' : 
                loyalty.level === 'Постоянный' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {loyalty.level}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${loyalty.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={loyalty.level === 'Новый' ? 'font-semibold text-purple-600' : ''}>
                  Новый
                </span>
                <span className={loyalty.level === 'Постоянный' ? 'font-semibold text-blue-600' : ''}>
                  Постоянный
                </span>
                <span className={loyalty.level === 'VIP' ? 'font-semibold text-purple-600' : ''}>
                  VIP
                </span>
              </div>
            </div>

            {/* Дополнительная информация о лояльности */}
            <div className="mt-3 text-xs text-gray-600">
              {loyalty.level === 'Новый' && 'Сделайте больше заказов для повышения уровня'}
              {loyalty.level === 'Постоянный' && 'Отличная активность! Продолжайте в том же духе'}
              {loyalty.level === 'VIP' && 'Премиальный статус! Благодарим за лояльность'}
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Дополнительная информация */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={500}
        duration="normal"
        className="border-t border-gray-200 pt-6 mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📅</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Зарегистрирован</span>
              <p className="text-gray-500 text-xs">
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🔄</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Последняя активность</span>
              <p className="text-gray-500 text-xs">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}