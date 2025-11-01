// app/admin/chefs/[id]/components/chef-orders.jsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement, AnimatedCounter } from '../../Components/animation-component'

export default function ChefOrders({ chefId }) {
  const [showAll, setShowAll] = useState(false)
  
  // Временные данные заказов
  const orders = [
    { 
      id: 'ORD-001', 
      customer: 'Иван Иванов', 
      amount: 1560, 
      status: 'DELIVERED', 
      date: '2024-01-15',
      items: [
        { product: { name: 'Паста Карбонара' }, quantity: 2, price: 780 },
        { product: { name: 'Салат Цезарь' }, quantity: 1, price: 450 }
      ],
      createdAt: '2024-01-15T14:30:00Z'
    },
    { 
      id: 'ORD-002', 
      customer: 'Мария Петрова', 
      amount: 890, 
      status: 'PREPARING', 
      date: '2024-01-15',
      items: [
        { product: { name: 'Пицца Маргарита' }, quantity: 1, price: 750 },
        { product: { name: 'Газировка' }, quantity: 1, price: 140 }
      ],
      createdAt: '2024-01-15T12:15:00Z'
    },
    { 
      id: 'ORD-003', 
      customer: 'Алексей Сидоров', 
      amount: 2340, 
      status: 'DELIVERED', 
      date: '2024-01-14',
      items: [
        { product: { name: 'Стейк Рибай' }, quantity: 1, price: 1200 },
        { product: { name: 'Картофель по-деревенски' }, quantity: 2, price: 570 },
        { product: { name: 'Соус грибной' }, quantity: 1, price: 150 }
      ],
      createdAt: '2024-01-14T19:45:00Z'
    },
  ]

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
      PENDING: { bg: 'from-yellow-100 to-orange-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: '⏳' },
      CONFIRMED: { bg: 'from-blue-100 to-cyan-100', text: 'text-blue-800', border: 'border-blue-200', icon: '✅' },
      PREPARING: { bg: 'from-purple-100 to-pink-100', text: 'text-purple-800', border: 'border-purple-200', icon: '👨‍🍳' },
      READY: { bg: 'from-indigo-100 to-purple-100', text: 'text-indigo-800', border: 'border-indigo-200', icon: '🎯' },
      DELIVERED: { bg: 'from-green-100 to-emerald-100', text: 'text-green-800', border: 'border-green-200', icon: '🚚' },
      CANCELLED: { bg: 'from-red-100 to-pink-100', text: 'text-red-800', border: 'border-red-200', icon: '❌' }
    }
    return statusColors[status] || { bg: 'from-gray-100 to-gray-100', text: 'text-gray-800', border: 'border-gray-200', icon: '📦' }
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

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    completedOrders: orders.filter(order => order.status === 'DELIVERED').length,
    averageOrder: orders.reduce((sum, order) => sum + order.amount, 0) / orders.length
  }

  const displayedOrders = showAll ? orders : orders.slice(0, 3)

  if (orders.length === 0) {
    return (
      <AnimatedContainer
        animation="fadeInUp"
        duration="normal"
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          Заказы повара
        </h3>
        <div className="text-center py-12">
          <FloatingElement speed="slow">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </FloatingElement>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Заказов нет</h4>
          <p className="text-gray-500 mb-6">У этого повара еще нет заказов</p>
          <AnimatedButton
            as={Link}
            href="/admin/orders"
            variant="primary"
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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
      {/* Заголовок и статистика */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            Заказы повара ({orders.length})
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Обзор заказов и выручки
          </p>
        </div>
        <AnimatedButton
          as={Link}
          href={`/admin/orders?chef=${chefId}`}
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

      {/* Статистика заказов */}
      <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <AnimatedCounter 
                value={stats.totalOrders}
                duration={1500}
                className="text-2xl font-bold text-orange-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Всего заказов</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={stats.totalRevenue}
                duration={2000}
                className="text-2xl font-bold text-green-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Общая выручка</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={stats.completedOrders}
                duration={1500}
                className="text-2xl font-bold text-blue-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Завершено</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={Math.round(stats.averageOrder)}
                duration={1800}
                className="text-2xl font-bold text-purple-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Средний чек</div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

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
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 group hover:border-orange-200"
            >
              {/* Заголовок заказа */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-gray-900 text-lg">#{order.id}</span>
                    <div className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                      {statusColor.icon} {getStatusText(order.status)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {formatDateTime(order.createdAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {order.customer}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{formatPrice(order.amount)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.items?.length || 0} товара
                  </p>
                </div>
              </div>

              {/* Товары в заказе */}
              {order.items && order.items.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
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
                  className="group text-orange-600 hover:text-orange-800"
                >
                  Подробнее
                  <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </AnimatedButton>
                <span className="text-xs text-gray-400 font-mono">
                  {formatDate(order.date)}
                </span>
              </div>
            </AnimatedContainer>
          )
        })}
      </div>

      {/* Кнопка показать все/скрыть */}
      {orders.length > 3 && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={400}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <AnimatedButton
            onClick={() => setShowAll(!showAll)}
            variant="secondary"
            size="md"
            className="w-full justify-center group bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:from-orange-100 hover:to-red-100"
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
                Показать все заказы ({orders.length})
              </>
            )}
          </AnimatedButton>
        </AnimatedContainer>
      )}

      {/* Дополнительная статистика */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={500}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((stats.completedOrders / stats.totalOrders) * 100)}%
            </div>
            <div className="text-blue-700 font-medium">Выполнено</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">
              {orders.filter(o => o.status === 'PREPARING').length}
            </div>
            <div className="text-green-700 font-medium">В работе</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-600">
              {orders.filter(o => o.status === 'PENDING').length}
            </div>
            <div className="text-purple-700 font-medium">Ожидание</div>
          </div>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}