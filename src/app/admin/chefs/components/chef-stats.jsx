export default function ChefStats({ chef }) {
  const stats = [
    { label: 'Выполнено заказов', value: chef.ordersCompleted || 0 },
    { label: 'Активных заказов', value: chef.activeOrders || 0 },
    { label: 'Всего продуктов', value: chef.productsCount || 0 },
    { label: 'Средний рейтинг', value: chef.rating || 0 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="text-lg font-semibold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}