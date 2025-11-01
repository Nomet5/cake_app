// app/admin/users/[id]/components/user-orders.jsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedContainer, AnimatedButton } from '../../../Components/animation-component'

export default function UserOrders({ user }) {
  const [showAll, setShowAll] = useState(false)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (amount) => {
    return amount?.toLocaleString('ru-RU') + ' ₽' || '0 ₽'
  }

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: { bg: 'from-yellow-100 to-orange-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      CONFIRMED: { bg: 'from-blue-100 to-cyan-100', text: 'text-blue-800', border: 'border-blue-200' },
      PREPARING: { bg: 'from-purple-100 to-pink-100', text: 'text-purple-800', border: 'border-purple-200' },
      READY: { bg: 'from-indigo-100 to-purple-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      DELIVERED: { bg: 'from-green-100 to-emerald-100', text: 'text-green-800', border: 'border-green-200' },
      CANCELLED: { bg: 'from-red-100 to-pink-100', text: 'text-red-800', border: 'border-red-200' }
    }
    return statusColors[status] || { bg: 'from-gray-100 to-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
  }

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: '⏳ Ожидание',
      CONFIRMED: '✅ Подтвержден',
      PREPARING: '👨‍🍳 Готовится',
      READY: '🎯 Готов',
      DELIVERED: '🚚 Доставлен',
      CANCELLED: '❌ Отменен'
    }
    return statusTexts[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: '⏳',
      CONFIRMED: '✅',
      PREPARING: '👨‍🍳',
      READY: '🎯',
      DELIVERED: '🚚',
      CANCELLED: '❌'
    }
    return icons[status] || '📦'
  }

  const displayedOrders = showAll ? user.orders : user.orders.slice(0, 3)

  if (!user.orders || user.orders.length === 0) {
    return (
      <AnimatedContainer
        animation="fadeInUp"
        duration="normal"
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          История заказов
        </h3>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Заказов нет</h4>
          <p className="text-gray-500 mb-6">Пользователь еще не совершал заказов</p>
          <AnimatedButton
            as={Link}
            href="/admin/orders"
            variant="primary"
            size="sm"
          >
            Перейти к заказам
          </AnimatedButton>
        </div>
      </AnimatedContainer>
    )
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      {/* Заголовок и навигация */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          История заказов ({user.orders.length})
        </h3>
        <AnimatedButton
          as={Link}
          href={`/admin/orders?user=${user.id}`}
          variant="ghost"
          size="sm"
          className="group"
        >
          Все заказы
          <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </AnimatedButton>
      </div>

      {/* Список заказов */}
      <div className="space-y-4">
        {displayedOrders.map((order, index) => {
          const statusColor = getStatusColor(order.status)
          
          return (
            <AnimatedContainer
              key={order.id}
              animation="fadeInUp"
              delay={index * 100}
              duration="normal"
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 group"
            >
              {/* Заголовок заказа */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-gray-900 text-lg">#{order.id}</span>
                    <div className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {formatDateTime(order.createdAt)}
                    </span>
                    <span>•</span>
                    <span>{order.items?.length || 0} товаров</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  {order.chef && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center justify-end">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                      {order.chef.businessName}
                    </p>
                  )}
                </div>
              </div>

              {/* Товары в заказе */}
              {order.items && order.items.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Состав заказа:
                    </div>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">
                            {item.quantity} × {item.product?.name || 'Товар'}
                          </span>
                          <span className="font-semibold text-gray-700">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-gray-400 text-xs font-medium pt-1">
                          ... и еще {order.items.length - 3} товара
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Футер заказа */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <AnimatedButton
                  as={Link}
                  href={`/admin/orders/${order.id}`}
                  variant="ghost"
                  size="sm"
                  className="group"
                >
                  Подробнее
                  <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </AnimatedButton>
                <span className="text-xs text-gray-400 font-mono">
                  ID: {order.id}
                </span>
              </div>
            </AnimatedContainer>
          )
        })}
      </div>

      {/* Кнопка показать все/скрыть */}
      {user.orders.length > 3 && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={400}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <AnimatedButton
            onClick={() => setShowAll(!showAll)}
            variant="secondary"
            size="md"
            className="w-full justify-center group"
          >
            {showAll ? (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Скрыть заказы
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Показать все заказы ({user.orders.length})
              </>
            )}
          </AnimatedButton>
        </AnimatedContainer>
      )}

      {/* Краткая статистика */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={500}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{user.orders.length}</div>
            <div className="text-blue-700 font-medium">Всего заказов</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {user.orders.filter(o => o.status === 'DELIVERED').length}
            </div>
            <div className="text-green-700 font-medium">Доставлено</div>
          </div>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}