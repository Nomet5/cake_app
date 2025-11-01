// components/product-actions-compact.jsx
'use client'

import React from 'react'

const ProductActionsCompact = ({ 
  productId, 
  onSave, 
  onDelete, 
  onCancel, 
  isEditing, 
  isLoading = false 
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Основные кнопки */}
      <div className="flex flex-wrap gap-3 justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading}
            className="group relative flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="relative z-10 font-medium">Удалить</span>
          </button>
        )}
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium">Отмена</span>
        </button>
        
        <button
          type="button"
          onClick={onSave}
          disabled={isLoading}
          className="group relative flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
          ) : (
            <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <span className="relative z-10 font-medium">
            {isLoading ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Создать')}
          </span>
        </button>
      </div>

      {/* Статус бар */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span>{isLoading ? 'Сохранение изменений...' : 'Готов к работе'}</span>
        </div>
        {productId && (
          <span className="bg-gray-100 px-2 py-1 rounded">ID: {productId}</span>
        )}
      </div>
    </div>
  )
}

export default ProductActionsCompact