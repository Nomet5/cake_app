// src/app/admin/orders/components/DeleteOrderModal.jsx
'use client'

import { useState, useEffect } from 'react'
import { deleteOrder } from '../../../actions/admin/order.actions'
import { 
  AnimatedContainer,
  AnimatedButton,
  FloatingElement,
  SubtleHover
} from '../../Components/animation-component'

export default function DeleteOrderModal({ order, isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (!order) return
    
    setIsLoading(true)
    setError('')

    try {
      const result = await deleteOrder(order.id)
      
      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error || 'Ошибка при удалении заказа')
      }
    } catch (err) {
      setError('Произошла непредвиденная ошибка')
      console.error('Delete order error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AnimatedContainer
        animation={isVisible ? "slideUp" : "slideDown"}
        duration="normal"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-gray-100 overflow-hidden"
      >
        {/* Заголовок модального окна с анимацией */}
        <AnimatedContainer
          animation="fadeInUp"
          delay={100}
          duration="normal"
          className="bg-gradient-to-r from-red-500 to-red-600 p-6"
        >
          <div className="flex items-center space-x-4">
            <FloatingElement speed="slow">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-xl">⚠️</span>
              </div>
            </FloatingElement>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                Удалить заказ?
              </h3>
              <p className="text-red-100 text-sm mt-1">
                Это действие нельзя отменить
              </p>
            </div>
          </div>
        </AnimatedContainer>

        {/* Содержимое модального окна */}
        <div className="p-6">
          {/* Анимированная ошибка */}
          {error && (
            <AnimatedContainer
              animation="shake"
              duration="fast"
              className="mb-4"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 text-lg">❌</span>
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Информация о заказе с анимациями */}
          <AnimatedContainer
            animation="fadeInUp"
            delay={200}
            duration="normal"
            className="mb-6"
          >
            <SubtleHover>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <div className="space-y-3">
                  <InfoRow 
                    label="Номер заказа" 
                    value={`#${order.orderNumber}`}
                    delay={250}
                  />
                  <InfoRow 
                    label="Клиент" 
                    value={order.user?.firstName || 'Не указан'}
                    delay={300}
                  />
                  <InfoRow 
                    label="Сумма" 
                    value={`${order.totalAmount} ₽`}
                    delay={350}
                  />
                  <InfoRow 
                    label="Товаров" 
                    value={`${order.items?.length || 0} шт.`}
                    delay={400}
                  />
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Статус:</span>
                    <AnimatedContainer
                      animation="fadeInUp"
                      delay={450}
                      duration="normal"
                    >
                      <StatusBadge status={order.status} />
                    </AnimatedContainer>
                  </div>
                </div>
              </div>
            </SubtleHover>
          </AnimatedContainer>

          {/* Предупреждение с анимацией */}
          <AnimatedContainer
            animation="fadeInUp"
            delay={500}
            duration="normal"
            className="mb-6"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <span className="text-orange-500 text-lg mt-0.5">💡</span>
                <div>
                  <p className="text-orange-800 text-sm font-medium">
                    Внимание! Удаление заказа
                  </p>
                  <p className="text-orange-700 text-xs mt-1">
                    Все данные заказа будут удалены безвозвратно, 
                    включая {order.items?.length || 0} товаров в заказе и историю операций.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* Кнопки действий с анимациями */}
          <AnimatedContainer
            animation="fadeInUp"
            delay={600}
            duration="normal"
            className="flex flex-col sm:flex-row gap-3"
          >
            <AnimatedButton
              onClick={handleClose}
              disabled={isLoading}
              variant="secondary"
              className="flex-1 py-3 text-sm font-medium"
              animation="bounce"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>↩️</span>
                <span>Отмена</span>
              </span>
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handleDelete}
              disabled={isLoading}
              variant="danger"
              loading={isLoading}
              className="flex-1 py-3 text-sm font-medium"
              animation="pulse"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Удаление...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>🗑️</span>
                  <span>Удалить заказ</span>
                </span>
              )}
            </AnimatedButton>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>
    </div>
  )
}

// Компонент для анимированных строк информации
function InfoRow({ label, value, delay = 0 }) {
  return (
    <AnimatedContainer
      animation="fadeInUp"
      delay={delay}
      duration="normal"
    >
      <div className="flex justify-between items-center py-1">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
    </AnimatedContainer>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: { 
      gradient: 'from-yellow-500 to-yellow-600',
      label: 'Ожидание',
      icon: '⏳'
    },
    CONFIRMED: { 
      gradient: 'from-blue-500 to-blue-600',
      label: 'Подтвержден',
      icon: '✅'
    },
    PREPARING: { 
      gradient: 'from-purple-500 to-purple-600',
      label: 'Готовится',
      icon: '👨‍🍳'
    },
    READY: { 
      gradient: 'from-green-500 to-green-600',
      label: 'Готов',
      icon: '🎯'
    },
    DELIVERED: { 
      gradient: 'from-green-500 to-green-600',
      label: 'Доставлен',
      icon: '🚚'
    },
    CANCELLED: { 
      gradient: 'from-red-500 to-red-600',
      label: 'Отменен',
      icon: '❌'
    },
  }

  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <FloatingElement speed="normal">
      <span 
        className={`
          inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold text-white
          bg-gradient-to-r ${config.gradient} shadow-sm
        `}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    </FloatingElement>
  )
}