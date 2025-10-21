// components/ProductTable.tsx
'use client'

import { toggleProductAvailable } from '../../lib/actions/product.actions'
import { AdminPagination  } from '../adminComponents/adminPagination'

export function ProductTable({ 
  products, 
  pagination,
  currentPage 
}: { 
  products: any[]
  pagination: any
  currentPage: number
}) {
  const handleToggleAvailable = async (productId: number, currentStatus: boolean) => {
    if (confirm(`Вы уверены, что хотите ${currentStatus ? 'отключить' : 'включить'} товар?`)) {
      const result = await toggleProductAvailable(productId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Пагинация сверху */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <AdminPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            basePath="/admin/products"
          />
        </div>
      )}

      {/* Таблица */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Товар
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Повар
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Цена
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Заказы
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Статус
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.category?.name || 'Без категории'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {product.chef.businessName}
                </div>
                <div className="text-sm text-gray-500">
                  {product.chef.user.email}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.price} ₽
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product._count.orderItems}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleAvailable(product.id, product.isAvailable)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                    product.isAvailable
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {product.isAvailable ? 'Доступен' : 'Недоступен'}
                </button>
              </td>
              <td className="px-6 py-4 text-sm font-medium space-x-2">
                <a
                  href={`/admin/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Просмотр
                </a>
                <a
                  href={`/admin/products/${product.id}/edit`}
                  className="text-green-600 hover:text-green-900"
                >
                  Редакт.
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация снизу */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <AdminPagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            basePath="/admin/products"
          />
        </div>
      )}
    </div>
  )
}