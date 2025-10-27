import Link from 'next/link'

export default function ChefProducts({ chefId }) {
  // Временные данные продуктов
  const products = [
    { id: 1, name: 'Паста Карбонара', price: 890, status: 'active', image: '/pasta.jpg' },
    { id: 2, name: 'Пицца Маргарита', price: 750, status: 'active', image: '/pizza.jpg' },
    { id: 3, name: 'Тирамису', price: 450, status: 'inactive', image: '/tiramisu.jpg' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Продукты повара</h3>
        <Link 
          href={`/admin/products?chef=${chefId}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Все продукты →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <span className="text-gray-400">Нет изображения</span>
              )}
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">{product.price} ₽</span>
              <span className={`text-xs px-2 py-1 rounded ${
                product.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.status === 'active' ? 'Активен' : 'Неактивен'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}