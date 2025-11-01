// app/admin/products/components/bulk-actions.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bulkUpdateProducts } from "../../../actions/admin/product.actions"

export default function BulkActions() {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState('')

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0 || !action) return

    setIsLoading(true)
    
    try {
      const isAvailable = action === 'activate'
      const result = await bulkUpdateProducts(selectedProducts, isAvailable)
      
      if (result.success) {
        // Сброс выбора после успешного действия
        setSelectedProducts([])
        setAction('')
        router.refresh()
        
        // Показать уведомление об успехе
        alert(`Успешно обновлено ${result.updatedCount} продуктов`)
      } else {
        alert(result.error || 'Произошла ошибка')
      }
    } catch (error) {
      alert('Ошибка при выполнении массового действия')
    } finally {
      setIsLoading(false)
    }
  }

  const actions = [
    {
      value: 'activate',
      label: 'Активировать',
      icon: '✅',
      description: 'Сделать выбранные продукты доступными'
    },
    {
      value: 'deactivate',
      label: 'Деактивировать',
      icon: '⏸️',
      description: 'Сделать выбранные продукты недоступными'
    }
  ]

  // В реальном приложении selectedProducts будет передаваться из родительского компонента
  const hasSelection = selectedProducts.length > 0

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 transition-all duration-300 ${hasSelection ? 'animate-fade-in-up' : 'opacity-50'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Информация о выборе */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
              {selectedProducts.length}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {selectedProducts.length === 1 ? '1 продукт выбран' : `${selectedProducts.length} продуктов выбрано`}
            </span>
          </div>
          
          {hasSelection && (
            <button
              onClick={() => setSelectedProducts([])}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1"
            >
              <span>✕</span>
              <span>Сбросить</span>
            </button>
          )}
        </div>

        {/* Действия */}
        {hasSelection && (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Выбор действия */}
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
            >
              <option value="">Выберите действие</option>
              {actions.map((act) => (
                <option key={act.value} value={act.value}>
                  {act.label}
                </option>
              ))}
            </select>

            {/* Кнопка применения */}
            <button
              onClick={handleBulkAction}
              disabled={!action || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Выполнение...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Применить</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Подсказка когда нет выбора */}
        {!hasSelection && (
          <div className="text-sm text-gray-500 flex items-center space-x-2 animate-pulse">
            <span>💡</span>
            <span>Выберите продукты для массовых действий</span>
          </div>
        )}
      </div>

      {/* Описание выбранного действия */}
      {action && hasSelection && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg animate-fade-in">
          <p className="text-sm text-blue-800">
            {actions.find(a => a.value === action)?.description}
          </p>
        </div>
      )}
    </div>
  )
}