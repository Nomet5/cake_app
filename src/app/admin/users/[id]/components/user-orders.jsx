// app/admin/users/[id]/components/user-orders.jsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function UserOrders({ user }) {
  const [showAll, setShowAll] = useState(false)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const formatPrice = (amount) => {
    return amount?.toLocaleString('ru-RU') + ' ₽' || '0 ₽'
  }

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: 'from-yellow-400 to-orange-500',
      CONFIRMED: 'from-blue-400 to-cyan-500',
      PREPARING: 'from-purple-400 to-pink-500',
      READY: 'from-indigo-400 to-purple-500',
      DELIVERED: 'from-green-400 to-emerald-500',
      CANCELLED: 'from-red-400 to-pink-500'
    }
    return statusColors[status] || 'from-gray-400 to-gray-500'
  }

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: 'Ожидание',
      CONFIRMED: 'Подтвержден',
      PREPARING: 'Готовится',
      READY: 'Готов',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменен'
    }
    return statusTexts[status] || status
  }

  const displayedOrders = showAll ? user.orders : user.orders.slice(0, 3)

  if (!user.orders || user.orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Последние заказы
        </h3>
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Заказов нет</h4>
          <p className="text-gray-500">Пользователь еще не совершал заказов</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Последние заказы
        </h3>
        <Link 
          href={`/admin/orders?user=${user.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover-lift flex items-center group"
        >
          Все заказы
          <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="space-y-4">
        {displayedOrders.map((order, index) => (
          <div 
            key={order.id} 
            className="border border-gray-200 rounded-2xl p-5 hover-lift transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-bold text-gray-900 text-lg">#{order.id}</span>
                  <div className={`px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r ${getStatusColor(order.status)} shadow-lg`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 animate-pulse"></span>
                  {formatDate(order.createdAt)} • {order.items?.length || 0} товаров
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                {order.chef && (
                  <p className="text-sm text-gray-500 mt-1">👨‍🍳 {order.chef.businessName}</p>
                )}
              </div>
            </div>

            {/* Товары в заказе */}
            {order.items && order.items.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Товары в заказе:
                  </div>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between items-center animate-fade-in">
                        <span className="truncate font-medium">
                          {item.quantity} × {item.product?.name || 'Товар'}
                        </span>
                        <span className="font-semibold">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-gray-400 text-xs font-medium pt-2">
                        ... и еще {order.items.length - 2} товаров
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 flex items-center group"
              >
                Подробнее
                <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="text-xs text-gray-400 font-mono">
                ID: {order.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {user.orders.length > 3 && (
        <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-all duration-300 hover-lift flex items-center justify-center group"
          >
            {showAll ? (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Скрыть
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Показать все заказы ({user.orders.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}