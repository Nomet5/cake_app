// src/app/admin/orders/components/OrdersTable.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
// ПРАВИЛЬНЫЙ ИМПОРТ - default import
import DeleteOrderModal from './DeleteOrderModal'
import { 
  AnimatedTableContainer,
  AnimatedTableRow,
  TableActionButton,
  SubtleHover,
  FloatingElement
} from '../../Components/animation-component'

export default function OrdersTable({ orders }) {
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    order: null
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === 'user') {
      aValue = a.user?.firstName
      bValue = b.user?.firstName
    } else if (sortField === 'chef') {
      aValue = a.chef?.businessName
      bValue = b.chef?.businessName
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="text-gray-400 ml-1">↕</span>
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const openDeleteModal = (order) => {
    setDeleteModal({
      isOpen: true,
      order
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      order: null
    })
  }

  const handleDeleteSuccess = () => {
    window.location.reload()
  }

  const getOrderTypeColor = (order) => {
    if (order.deliveryFee > 0) {
      return 'bg-purple-500' // Доставка
    }
    return 'bg-orange-500' // Самовывоз
  }

  const getOrderTypeIcon = (order) => {
    if (order.deliveryFee > 0) {
      return '🚚' // Доставка
    }
    return '🏪' // Самовывоз
  }

  return (
    <>
      <AnimatedTableContainer
        delay={100}
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
      >
        {/* Заголовок таблицы */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SubtleHover className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg">📦</span>
              </SubtleHover>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Список заказов
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Управление всеми заказами системы
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Всего заказов</div>
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center">
                    <span>Заказ</span>
                    <SortIcon field="orderNumber" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('user')}
                >
                  <div className="flex items-center">
                    <span>Клиент</span>
                    <SortIcon field="user" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('chef')}
                >
                  <div className="flex items-center">
                    <span>Повар</span>
                    <SortIcon field="chef" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    <span>Сумма</span>
                    <SortIcon field="totalAmount" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Оплата
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    <span>Дата</span>
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order, index) => (
                <AnimatedTableRow
                  key={order.id}
                  index={index}
                  delay={100}
                  className="group hover:bg-blue-50 transition-colors duration-300"
                >
                  {/* Заказ */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SubtleHover>
                        <div className={`w-10 h-10 ${getOrderTypeColor(order)} rounded-xl flex items-center justify-center text-white font-medium shadow-sm`}>
                          {getOrderTypeIcon(order)}
                        </div>
                      </SubtleHover>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500">ID: {order.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Клиент */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {order.user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.firstName || 'Не указано'}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px]">
                          {order.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Повар */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {order.chef?.businessName?.charAt(0) || order.chef?.user?.firstName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {order.chef?.businessName || order.chef?.user?.firstName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.chef?.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Сумма */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <FloatingElement speed="slow">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {order.totalAmount.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items?.length || 0} товаров
                        </div>
                      </div>
                    </FloatingElement>
                  </td>

                  {/* Статус заказа */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* Статус оплаты */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>

                  {/* Дата */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>

                  {/* Действия */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span className="mr-1">👁️</span>
                        Просмотр
                      </Link>
                      <Link
                        href={`/admin/orders/${order.id}/edit`}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <span className="mr-1">✏️</span>
                        Редакт.
                      </Link>
                      <TableActionButton
                        variant="danger"
                        onClick={() => openDeleteModal(order)}
                        className="text-xs"
                      >
                        <span className="mr-1">🗑️</span>
                        Удалить
                      </TableActionButton>
                    </div>
                  </td>
                </AnimatedTableRow>
              ))}
            </tbody>
          </table>
        </div>

        {/* Сообщение о пустой таблице */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <FloatingElement speed="slow">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-gray-400">📦</span>
              </div>
            </FloatingElement>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказы не найдены</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              В системе пока нет заказов. Новые заказы появятся здесь автоматически.
            </p>
          </div>
        )}
      </AnimatedTableContainer>

      {/* Модальное окно удаления */}
      <DeleteOrderModal
        order={deleteModal.order}
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Ожидание', 
      icon: '⏳' 
    },
    CONFIRMED: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Подтвержден', 
      icon: '✅' 
    },
    PREPARING: { 
      color: 'bg-purple-100 text-purple-800 border-purple-200', 
      label: 'Готовится', 
      icon: '👨‍🍳' 
    },
    READY: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Готов', 
      icon: '🎯' 
    },
    DELIVERED: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Доставлен', 
      icon: '🚚' 
    },
    CANCELLED: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Отменен', 
      icon: '❌' 
    },
  }

  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

function PaymentStatusBadge({ status }) {
  const statusConfig = {
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Ожидание', 
      icon: '⏳' 
    },
    PAID: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Оплачен', 
      icon: '💰' 
    },
    FAILED: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Ошибка', 
      icon: '❌' 
    },
    REFUNDED: { 
      color: 'bg-gray-100 text-gray-800 border-gray-200', 
      label: 'Возврат', 
      icon: '↩️' 
    },
  }

  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}