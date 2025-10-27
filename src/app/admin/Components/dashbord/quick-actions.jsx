// src/app/admin/Components/admin/dashboard/quick-actions.jsx
'use client'

import { useState } from 'react'
import { Plus, Search, Settings, Download, Bell } from 'lucide-react'

const ActionButton = ({ icon: Icon, label, onClick, variant = 'default', delay = 0 }) => {
  const variants = {
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg',
    secondary: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center p-4 rounded-xl transition-all duration-300 hover-lift w-full animate-scale-in ${variants[variant]}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default function QuickActions() {
  const [loading, setLoading] = useState(false)

  const handleUpdateOrderStatus = async () => {
    setLoading(true)
    setTimeout(() => {
      alert('Функция обновления статуса заказа будет реализована позже')
      setLoading(false)
    }, 1000)
  }

  const actions = [
    {
      icon: Plus,
      label: 'Добавить товар',
      onClick: () => alert('Переход на страницу создания товара'),
      variant: 'primary',
      delay: 0
    },
    {
      icon: Search,
      label: 'Поиск заказов',
      onClick: () => alert('Поиск заказов'),
      variant: 'default',
      delay: 0.1
    },
    {
      icon: Settings,
      label: 'Настройки',
      onClick: () => alert('Настройки'),
      variant: 'default',
      delay: 0.2
    },
    {
      icon: Download,
      label: 'Экспорт данных',
      onClick: () => alert('Функция экспорта данных будет реализована позже'),
      variant: 'secondary',
      delay: 0.3
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
        Быстрые действия
      </h3>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={action.onClick}
            variant={action.variant}
            delay={action.delay}
          />
        ))}
      </div>
      
      {/* Статус загрузки */}
      {loading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 animate-fade-in">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-700 text-sm font-medium">Выполняется действие...</p>
          </div>
        </div>
      )}
    </div>
  )
}