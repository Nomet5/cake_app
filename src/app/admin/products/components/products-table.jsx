// app/admin/products/components/products-table.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductStatus from './product-status'
import { toggleProductAvailable } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { 
  AnimatedTableContainer,
  AnimatedTableRow,
  TableActionButton,
  SubtleHover
} from '../../Components/animation-component'

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

  const getProductImage = (product) => {
    if (product.images?.[0]) {
      return (
        <img 
          src={product.images[0].imageUrl} 
          alt={product.name}
          className="w-10 h-10 rounded-lg object-cover shadow-sm"
        />
      )
    }
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-lg">🍽️</span>
      </div>
    )
  }

  const getChefInfo = (product) => {
    const chefName = product.chef?.businessName || product.chef?.user?.firstName || 'Не указан'
    const chefEmail = product.chef?.user?.email
    
    return (
      <div>
        <div className="text-sm font-medium text-gray-900">{chefName}</div>
        {chefEmail && (
          <div className="text-sm text-gray-500">{chefEmail}</div>
        )}
      </div>
    )
  }

  const getCategoryBadge = (product) => {
    const categoryName = product.category?.name
    if (!categoryName) return null
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {categoryName}
      </span>
    )
  }

  const getStatsBadges = (product) => {
    const orderCount = product._count?.orderItems || 0
    const reviewCount = product._count?.reviews || 0

    return (
      <div className="flex gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {orderCount} зак.
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          {reviewCount} отз.
        </span>
      </div>
    )
  }

  return (
    <>
      <AnimatedTableContainer
        delay={100}
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        {/* Заголовок таблицы */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SubtleHover className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </SubtleHover>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Список продуктов
                </h3>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-blue-800 font-medium">
                      Выбрано: {selectedProducts.length}
                    </span>
                    <button
                      onClick={() => setSelectedProducts([])}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Сбросить
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Всего: <span className="text-green-600 font-semibold">{products.length}</span>
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Продукт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Повар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статистика
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Создан
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <AnimatedTableRow
                  key={product.id}
                  index={index}
                  delay={100}
                  className="group hover:bg-gray-50"
                >
                  {/* Чекбокс выбора */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                    />
                  </td>

                  {/* Продукт */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SubtleHover>
                        {getProductImage(product)}
                      </SubtleHover>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {product.description || 'Без описания'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Повар */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getChefInfo(product)}
                  </td>

                  {/* Категория */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCategoryBadge(product)}
                  </td>

                  {/* Цена */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {product.price} ₽
                    </div>
                  </td>

                  {/* Статистика */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatsBadges(product)}
                  </td>

                  {/* Статус */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductStatus product={product} />
                  </td>

                  {/* Дата создания */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                  </td>

                  {/* Действия */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Просмотр
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                      >
                        Редакт.
                      </Link>
                      <TableActionButton
                        variant={product.isAvailable ? "warning" : "success"}
                        onClick={() => handleToggleStatus(product.id, product.isAvailable)}
                      >
                        {product.isAvailable ? 'Выкл.' : 'Вкл.'}
                      </TableActionButton>
                    </div>
                  </td>
                </AnimatedTableRow>
              ))}
            </tbody>
          </table>
        </div>

        {/* Сообщение о пустой таблице */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Продукты не найдены</h3>
            <p className="text-gray-500 text-sm">
              Создайте первый продукт или измените параметры фильтрации
            </p>
          </div>
        )}

        {/* Пагинация */}
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
      </AnimatedTableContainer>
    </>
  )
}