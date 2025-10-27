// app/admin/users/[id]/components/user-stats.jsx
'use client'

export default function UserStats({ user }) {
  const stats = [
    {
      label: 'Всего заказов',
      value: user._count?.orders || 0,
      icon: '🛒',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      delay: 0
    },
    {
      label: 'Отзывов',
      value: user._count?.reviews || 0,
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      delay: 0.1
    },
    {
      label: 'Адресов',
      value: user._count?.addresses || 0,
      icon: '🏠',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      delay: 0.2
    },
    {
      label: 'Активных заказов',
      value: user.orders?.filter(order => 
        order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
      ).length || 0,
      icon: '⏳',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      delay: 0.3
    }
  ]

  // Рассчитываем общую сумму заказов
  const totalSpent = user.orders?.reduce((total, order) => {
    return total + (order.totalAmount || 0)
  }, 0) || 0

  const averageOrder = user._count?.orders > 0 ? Math.round(totalSpent / user._count.orders) : 0

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        Статистика
      </h3>
      
      <div className="space-y-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover-lift transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${stat.delay}s` }}
          >
            <div className="flex items-center space-x-4">
              <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-xl text-white">{stat.icon}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                  {stat.label}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.label === 'Активных заказов' ? 'В процессе' : 'Всего'}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Финансовая статистика */}
      <div className="border-t border-gray-200 pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Финансы
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <span className="text-sm font-medium text-gray-700">Всего потрачено:</span>
            <span className="text-xl font-bold text-green-600">
              {totalSpent.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          {user._count?.orders > 0 && (
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Средний чек:</span>
              <span className="text-lg font-semibold text-blue-600">
                {averageOrder.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          )}

          {/* Прогресс лояльности */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Уровень лояльности</span>
              <span className="text-sm font-semibold text-purple-600">
                {user._count?.orders >= 10 ? 'VIP' : user._count?.orders >= 5 ? 'Постоянный' : 'Новый'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((user._count?.orders || 0) * 10, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Новый</span>
              <span>Постоянный</span>
              <span>VIP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}