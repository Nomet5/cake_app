export default function ChefOrders({ chefId }) {
  // Временные данные заказов
  const orders = [
    { id: 'ORD-001', customer: 'Иван Иванов', amount: 1560, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Мария Петрова', amount: 890, status: 'processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Алексей Сидоров', amount: 2340, status: 'completed', date: '2024-01-14' },
  ]

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние заказы</h3>
      
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{order.amount} ₽</p>
              <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status]}`}>
                {order.status === 'completed' ? 'Завершен' : 
                 order.status === 'processing' ? 'В работе' : order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}