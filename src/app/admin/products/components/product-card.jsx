// app/admin/products/components/product-card.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toggleProductAvailable, deleteProduct } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { 
  AnimatedCard,
  AnimatedButton,
  FloatingElement,
  SubtleHover,
  SkeletonLoader 
} from '../../Components/animation-component'

export default function ProductCard({ product, onSelect, isSelected, showCheckbox = true }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

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

  const stats = [
    {
      label: 'Заказы',
      value: product._count?.orderItems || 0,
      icon: '📦',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Отзывы',
      value: product._count?.reviews || 0,
      icon: '⭐',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'В корзинах',
      value: product._count?.cartItems || 0,
      icon: '🛒',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const getStatusInfo = () => {
    if (product.isAvailable) {
      return {
        text: 'Доступен',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
        gradient: 'from-green-400 to-green-600'
      }
    } else {
      return {
        text: 'Недоступен',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '⏸️',
        gradient: 'from-red-400 to-red-600'
      }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <AnimatedCard 
      hoverable 
      animated 
      className={`relative overflow-hidden border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-blue-400 ring-2 ring-blue-200 shadow-xl' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isLoading ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {showCheckbox && (
            <SubtleHover>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect?.(product.id, e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              />
            </SubtleHover>
          )}
          <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200">
            #{product.id}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status Toggle */}
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isLoading}
            className="p-2 rounded-lg"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <span className="text-lg">{statusInfo.icon}</span>
            )}
          </AnimatedButton>

          {/* Delete Button */}
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
          >
            🗑️
          </AnimatedButton>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
          <div className="text-center p-6">
            <div className="text-white text-lg font-semibold mb-4">
              Удалить продукт?
            </div>
            <div className="flex space-x-3 justify-center">
              <AnimatedButton
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-white text-red-600 hover:bg-red-50"
              >
                Да
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="bg-white text-gray-600 hover:bg-gray-50"
              >
                Нет
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Link href={`/admin/products/${product.id}`}>
        <div className="p-5">
          {/* Product Image and Basic Info */}
          <div className="flex items-start space-x-4 mb-4">
            <FloatingElement speed="slow">
              <SubtleHover className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                  {product.images?.[0] ? (
                    <>
                      {!imageLoaded && <SkeletonLoader type="card" className="w-20 h-20" />}
                      <img 
                        src={product.images[0].imageUrl} 
                        alt={product.name}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </>
                  ) : (
                    <span className="text-3xl text-gray-400">🍽️</span>
                  )}
                </div>
                {/* Status Badge Overlay */}
                <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold border-2 ${statusInfo.color}`}>
                  {statusInfo.text}
                </div>
              </SubtleHover>
            </FloatingElement>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {product.name}
              </h3>
              
              {/* Price */}
              <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {product.price} ₽
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {product.description || 'Описание отсутствует'}
              </p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="space-y-3">
            {/* Chef Info */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <span className="text-lg">👨‍🍳</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {product.chef?.businessName || product.chef?.user?.firstName || 'Неизвестный повар'}
                  </div>
                </div>
              </div>
              {product.category?.name && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {product.category.name}
                </span>
              )}
            </div>

            {/* Date Info */}
            <div className="flex items-center justify-between text-gray-500 text-xs">
              <div className="flex items-center space-x-1">
                <span>📅</span>
                <span>{new Date(product.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <span className="text-yellow-600">⭐</span>
                  <span className="font-medium text-yellow-700">
                    {(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat, index) => (
                <FloatingElement key={stat.label} speed="normal">
                  <div className="text-center group/stat">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-1 group-hover/stat:scale-110 transition-transform duration-300`}>
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                  </div>
                </FloatingElement>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Actions Footer */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex justify-between items-center">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200 flex items-center space-x-2 group/view"
        >
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover/view:scale-110 transition-transform duration-300">
            <span className="text-blue-600 text-sm">👁️</span>
          </div>
          <span>Просмотр</span>
        </Link>
        
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="text-green-600 hover:text-green-800 text-sm font-medium transition-all duration-200 flex items-center space-x-2 group/edit"
        >
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center group-hover/edit:scale-110 transition-transform duration-300">
            <span className="text-green-600 text-sm">✏️</span>
          </div>
          <span>Редактировать</span>
        </Link>
      </div>

      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </AnimatedCard>
  )
}