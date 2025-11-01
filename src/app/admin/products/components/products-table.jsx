// app/admin/products/components/products-table.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductStatus from './product-status'
import { toggleProductAvailable } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'

export default function ProductsTable({ products }) {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedProducts(products.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
      setSelectAll(false)
    }
  }

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const result = await toggleProductAvailable(productId)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }

  const columns = [
    { key: 'select', label: '', width: 'w-12', sortable: false },
    { key: 'product', label: 'Продукт', width: 'w-64', sortable: true },
    { key: 'chef', label: 'Повар', width: 'w-48', sortable: true },
    { key: 'category', label: 'Категория', width: 'w-32', sortable: true },
    { key: 'price', label: 'Цена', width: 'w-24', sortable: true },
    { key: 'orders', label: 'Заказы', width: 'w-20', sortable: true },
    { key: 'reviews', label: 'Отзывы', width: 'w-20', sortable: true },
    { key: 'status', label: 'Статус', width: 'w-28', sortable: true },
    { key: 'created', label: 'Создан', width: 'w-32', sortable: true },
    { key: 'actions', label: 'Действия', width: 'w-24', sortable: false }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
      {/* Заголовок таблицы с количеством выбранных */}
      {selectedProducts.length > 0 && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-blue-800">
              Выбрано: {selectedProducts.length}
            </span>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Сбросить
            </button>
          </div>
          <div className="text-sm text-blue-600 font-medium">
            ⚡ Доступны массовые действия
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {columns.map((column, index) => (
                <th 
                  key={column.key}
                  className={`px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.width} animate-slide-in-right`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {column.key === 'select' ? (
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, rowIndex) => (
              <tr 
                key={product.id}
                className="hover:bg-gray-50 transition-all duration-200 group animate-fade-in-up"
                style={{animationDelay: `${rowIndex * 0.03}s`}}
              >
                {/* Чекбокс выбора */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                </td>

                {/* Продукт */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0].imageUrl} 
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <span className="text-lg">🍽️</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link 
                        href={`/admin/products/${product.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors duration-200 truncate block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description || 'Без описания'}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Повар */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span>👨‍🍳</span>
                    <span>{product.chef?.businessName || product.chef?.user?.firstName}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.chef?.user?.email}
                  </div>
                </td>

                {/* Категория */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category?.name || '—'}
                  </span>
                </td>

                {/* Цена */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {product.price} ₽
                </td>

                {/* Заказы */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>📦</span>
                    <span>{product._count?.orderItems || 0}</span>
                  </div>
                </td>

                {/* Отзывы */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>⭐</span>
                    <span>{product._count?.reviews || 0}</span>
                  </div>
                </td>

                {/* Статус */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <ProductStatus product={product} />
                </td>

                {/* Дата создания */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                </td>

                {/* Действия */}
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(product.id, product.isAvailable)}
                      className={`p-1 rounded transition-all duration-200 transform hover:scale-110 ${
                        product.isAvailable 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-red-600 hover:bg-red-100'
                      }`}
                      title={product.isAvailable ? 'Деактивировать' : 'Активировать'}
                    >
                      {product.isAvailable ? '✅' : '⏸️'}
                    </button>
                    
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded transition-all duration-200 transform hover:scale-110"
                      title="Просмотр"
                    >
                      👁️
                    </Link>
                    
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-green-600 hover:text-green-900 p-1 rounded transition-all duration-200 transform hover:scale-110"
                      title="Редактировать"
                    >
                      ✏️
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пустое состояние */}
      {products.length === 0 && (
        <div className="text-center py-12 animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Продукты не найдены</h3>
          <p className="text-gray-500">Создайте первый продукт или измените фильтры</p>
        </div>
      )}

      {/* Пагинация (можно добавить позже) */}
      {products.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Показано {products.length} из {products.length} продуктов
          </div>
          <div className="flex space-x-2">
            {/* Кнопки пагинации можно добавить здесь */}
          </div>
        </div>
      )}
    </div>
  )
}