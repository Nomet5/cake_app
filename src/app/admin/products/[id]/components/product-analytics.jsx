// app/admin/products/[id]/components/product-analytics.jsx
'use client'

export default function ProductAnalytics({ product }) {
  const analytics = [
    {
      label: 'Всего заказов',
      value: product._count?.orderItems || 0,
      icon: '📦',
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Средний рейтинг',
      value: product.reviews?.length > 0 
        ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
        : '0.0',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      change: '+0.3',
      trend: 'up'
    },
    {
      label: 'В корзинах',
      value: product._count?.cartItems || 0,
      icon: '🛒',
      color: 'from-green-500 to-emerald-500',
      change: '-2',
      trend: 'down'
    },
    {
      label: 'Доход',
      value: `${((product._count?.orderItems || 0) * product.price).toLocaleString()} ₽`,
      icon: '💰',
      color: 'from-purple-500 to-pink-500',
      change: '+15%',
      trend: 'up'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Аналитика продукта
      </h3>
      
      <div className="space-y-4">
        {analytics.map((stat, index) => (
          <div 
            key={stat.label}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-300 animate-slide-in-right"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
            
            <div className={`text-sm font-medium ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Быстрые действия</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium">
            📈 Статистика
          </button>
          <button className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium">
            📊 Отчеты
          </button>
        </div>
      </div>
    </div>
  )
}