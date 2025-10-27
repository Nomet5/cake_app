// components/admin/dashboard/quick-actions.jsx
'use client'

import { useState } from 'react'
import { Plus, Search, Settings, Download, Bell } from 'lucide-react'
import { updateOrderStatus, toggleProductAvailability } from '../../../actions/admin/dashborad.actions'

const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-green-600 text-white hover:bg-green-700'
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-3 rounded-lg transition-colors ${variants[variant]}`}
    >
      <Icon className="h-5 w-5 mr-2" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default function QuickActions() {
  const [loading, setLoading] = useState(false)

  const handleUpdateOrderStatus = async () => {
    setLoading(true)
    // В реальном приложении здесь будет модальное окно для выбора заказа и статуса
    try {
      // Пример вызова action
      // const result = await updateOrderStatus('1', 'COMPLETED')
      // if (result.success) {
      //   alert(result.message)
      // }
      alert('Функция обновления статуса заказа будет реализована позже')
    } catch (error) {
      alert('Ошибка при обновлении статуса')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = () => {
    alert('Функция экспорта данных будет реализована позже')
  }

  const handleCreateProduct = () => {
    // В реальном приложении - навигация на страницу создания товара
    alert('Переход на страницу создания товара')
  }

  const actions = [
    {
      icon: Plus,
      label: 'Добавить товар',
      onClick: handleCreateProduct,
      variant: 'primary'
    },
    {
      icon: Search,
      label: 'Поиск заказов',
      onClick: () => alert('Поиск заказов'),
      variant: 'default'
    },
    {
      icon: Settings,
      label: 'Настройки',
      onClick: () => alert('Настройки'),
      variant: 'default'
    },
    {
      icon: Download,
      label: 'Экспорт данных',
      onClick: handleExportData,
      variant: 'secondary'
    },
    {
      icon: Bell,
      label: 'Уведомления',
      onClick: () => alert('Уведомления'),
      variant: 'default'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
            variant={action.variant}
          />
        ))}
      </div>
      
      {/* Статус загрузки */}
      {loading && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-sm">Выполняется действие...</p>
        </div>
      )}
    </div>
  )
}