// app/admin/products/[id]/components/delete-product-modal.jsx
'use client'

import { useState } from 'react'
import { deleteProduct } from "../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { 
  AnimatedContainer,
  AnimatedButton,
  FloatingElement,
  SubtleHover 
} from "../Components/animation-component"

export default function DeleteProductModal({ product, isOpen, onClose, onSuccess }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!product) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await deleteProduct(product.id)
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || 'Произошла ошибка при удалении')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Произошла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const getProductConstraints = () => {
    const constraints = []
    
    if (product._count?.orderItems > 0) {
      constraints.push({
        type: 'orderItems',
        label: 'История заказов',
        count: product._count.orderItems,
        icon: '📦',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      })
    }
    
    if (product._count?.reviews > 0) {
      constraints.push({
        type: 'reviews',
        label: 'Отзывы',
        count: product._count.reviews,
        icon: '⭐',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      })
    }
    
    if (product._count?.cartItems > 0) {
      constraints.push({
        type: 'cartItems',
        label: 'В корзинах',
        count: product._count.cartItems,
        icon: '🛒',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      })
    }
    
    if (product.images?.length > 0) {
      constraints.push({
        type: 'images',
        label: 'Изображения',
        count: product.images.length,
        icon: '🖼️',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      })
    }
    
    return constraints
  }

  const constraints = getProductConstraints()
  const hasConstraints = constraints.length > 0

  if (!isOpen) return null

  return (
    <AnimatedContainer animation="fadeIn" duration="normal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <FloatingElement speed="normal">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Удаление продукта</h3>
                <p className="text-red-600 text-sm mt-1 font-medium">
                  Это действие нельзя отменить
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Info */}
            <AnimatedContainer animation="fadeInUp" delay={100}>
              <SubtleHover>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                  <div className="flex items-center space-x-3">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0].imageUrl} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-lg">🍽️</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                      <div className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                        <span>#{product.id}</span>
                        <span>•</span>
                        <span>{product.price} ₽</span>
                        <span>•</span>
                        <span className={product.isAvailable ? 'text-green-600' : 'text-red-600'}>
                          {product.isAvailable ? 'Доступен' : 'Недоступен'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SubtleHover>
            </AnimatedContainer>

            {/* Warning Message */}
            <AnimatedContainer animation="fadeInUp" delay={200}>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-800 text-sm font-medium">
                      Вы собираетесь удалить продукт "{product.name}"
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Все данные о продукте будут безвозвратно удалены из системы.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Constraints */}
            {hasConstraints && (
              <AnimatedContainer animation="fadeInUp" delay={300}>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Ограничения для удаления
                  </h4>
                  <div className="space-y-2">
                    {constraints.map((constraint, index) => (
                      <div 
                        key={constraint.type}
                        className={`flex items-center justify-between p-3 ${constraint.bgColor} rounded-lg border border-gray-200`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={constraint.color}>{constraint.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{constraint.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{constraint.count}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-red-600 text-xs mt-2">
                    Для удаления необходимо сначала очистить связанные данные
                  </p>
                </div>
              </AnimatedContainer>
            )}

            {/* Error Message */}
            {error && (
              <AnimatedContainer animation="fadeInUp" delay={400}>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">❌</span>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </AnimatedContainer>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
            <AnimatedButton
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Отмена
            </AnimatedButton>
            
            <AnimatedButton
              variant="danger"
              size="md"
              onClick={handleDelete}
              loading={isLoading}
              disabled={hasConstraints}
              className="min-w-[100px]"
            >
              {isLoading ? 'Удаление...' : 'Удалить'}
            </AnimatedButton>
          </div>

          {/* Additional Info */}
          <div className="px-6 py-3 bg-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span>ID продукта: {product.id}</span>
              </div>
              <span>Повар: {product.chef?.businessName}</span>
            </div>
          </div>
        </div>
      </FloatingElement>
    </AnimatedContainer>
  )
}