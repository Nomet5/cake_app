// app/admin/products/components/product-card.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toggleProductAvailable, deleteProduct } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'

export default function ProductCard({ product, onSelect, isSelected, showCheckbox = true }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleToggleStatus = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const result = await toggleProductAvailable(product.id)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const result = await deleteProduct(product.id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Ошибка при удалении продукта')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка при удалении продукта')
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCardClick = (e) => {
    // Если клик по интерактивным элементам, не переходим по ссылке
    if (e.target.type === 'checkbox' || 
        e.target.closest('button') || 
        e.target.closest('.no-navigate')) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const stats = [
    {
      label: 'Заказы',
      value: product._count?.orderItems || 0,
      icon: '📦',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Отзывы',
      value: product._count?.reviews || 0,
      icon: '⭐',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'В корзинах',
      value: product._count?.cartItems || 0,
      icon: '🛒',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const getStatusBadge = () => {
    if (product.isAvailable) {
      return {
        text: 'Доступен',
        color: 'bg-green-100 text-green-800 border-green-200',
        dot: 'bg-green-500'
      }
    } else {
      return {
        text: 'Недоступен',
        color: 'bg-red-100 text-red-800 border-red-200',
        dot: 'bg-red-500'
      }
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <div 
      className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden group animate-fade-in-up ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-gray-200'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      {/* Header with Checkbox and Quick Actions */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect?.(product.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
            />
          )}
          <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-lg border">
            ID: {product.id}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status Toggle */}
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
              product.isAvailable 
                ? 'text-green-600 hover:bg-green-100' 
                : 'text-red-600 hover:bg-red-100'
            }`}
            title={product.isAvailable ? 'Деактивировать' : 'Активировать'}
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              product.isAvailable ? '✅' : '⏸️'
            )}
          </button>

          {/* Delete Button */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
              title="Удалить продукт"
            >
              🗑️
            </button>
          ) : (
            <div className="flex items-center space-x-1 no-navigate">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-200 disabled:opacity-50"
                title="Подтвердить удаление"
              >
                ✅
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200 disabled:opacity-50"
                title="Отменить"
              >
                ❌
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Link href={`/admin/products/${product.id}`} onClick={handleCardClick}>
        <div className="p-6">
          {/* Product Image and Basic Info */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0].imageUrl} 
                  alt={product.name}
                  className="w-18 h-18 rounded-xl object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-400">🍽️</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors duration-200 mb-2">
                {product.name}
              </h3>
              
              {/* Status and Price */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.color}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${statusBadge.dot} animate-pulse`}></span>
                  {statusBadge.text}
                </span>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  {product.price} ₽
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {product.description || 'Описание продукта отсутствует...'}
              </p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-3 text-sm">
            {/* Chef Info */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-lg">👨‍🍳</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {product.chef?.businessName || product.chef?.user?.firstName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {product.chef?.user?.email}
                  </div>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {product.category?.name || 'Без категории'}
              </span>
            </div>

            {/* Date and Additional Info */}
            <div className="flex items-center justify-between text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span className="text-xs">{new Date(product.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
                {product.updatedAt !== product.createdAt && (
                  <div className="flex items-center space-x-1">
                    <span>✏️</span>
                    <span className="text-xs">Изменен</span>
                  </div>
                )}
              </div>
              
              {/* Rating if available */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <span className="text-yellow-600">⭐</span>
                  <span className="text-xs font-medium text-yellow-700">
                    {product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center transition-all duration-300 transform hover:scale-110 group/stat"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover/stat:scale-110 transition-transform duration-300`}>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Actions Footer */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex justify-between items-center">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200 flex items-center space-x-2 group/view no-navigate"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover/view:scale-110 transition-transform duration-300">
            <span className="text-blue-600">👁️</span>
          </div>
          <span className="group-hover/view:underline">Детали</span>
        </Link>
        
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="text-green-600 hover:text-green-800 text-sm font-medium transition-all duration-200 flex items-center space-x-2 group/edit no-navigate"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover/edit:scale-110 transition-transform duration-300">
            <span className="text-green-600">✏️</span>
          </div>
          <span className="group-hover/edit:underline">Редактировать</span>
        </Link>

        {/* Quick View Stats */}
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>📊</span>
          <span>Активен</span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}