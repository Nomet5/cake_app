export default function StatsOverview({ stats }) {
  // Используем данные из getChefStats()
  const statItems = [
    {
      label: 'Всего поваров',
      value: stats?.total || 0,
      color: 'bg-blue-50 text-blue-700',
      icon: '👨‍🍳',
      description: 'Всего зарегистрировано'
    },
    {
      label: 'Активных',
      value: stats?.active || 0,
      color: 'bg-green-50 text-green-700',
      icon: '✅',
      description: 'Работают сейчас'
    },
    {
      label: 'Верифицированных',
      value: stats?.verified || 0,
      color: 'bg-purple-50 text-purple-700',
      icon: '⭐',
      description: 'Прошли проверку'
    },
    {
      label: 'С товарами',
      value: stats?.withProducts || 0,
      color: 'bg-orange-50 text-orange-700',
      icon: '🍰',
      description: 'Имеют товары'
    },
    {
      label: 'Среднее товаров',
      value: stats?.averageProducts || 0,
      color: 'bg-indigo-50 text-indigo-700',
      icon: '📊',
      description: 'На повара'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-2xl ${item.color} p-2 rounded-lg`}>
              {item.icon}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{item.description}</p>
        </div>
      ))}
    </div>
  )
}