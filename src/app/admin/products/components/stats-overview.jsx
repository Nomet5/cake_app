// app/admin/products/components/stats-overview.jsx
'use client'

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: 'Всего продуктов',
      value: stats?.total || 0,
      icon: '📦',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      delay: 0
    },
    {
      title: 'Доступно',
      value: stats?.available || 0,
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      delay: 0.1
    },
    {
      title: 'Недоступно',
      value: stats?.unavailable || 0,
      icon: '⏸️',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      delay: 0.2
    },
    {
      title: 'Средняя цена',
      value: `${Math.round(stats?.averagePrice || 0)} ₽`,
      icon: '💰',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      delay: 0.3
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in-up`}
          style={{ animationDelay: `${stat.delay}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-1000`}
                style={{ 
                  width: stat.title === 'Средняя цена' 
                    ? '100%' 
                    : `${Math.min(100, (stat.value / Math.max(1, stats?.total || 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}