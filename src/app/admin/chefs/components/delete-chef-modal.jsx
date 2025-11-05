// app/admin/chefs/components/delete-chef-modal.jsx
'use client'

import { useState, useEffect } from 'react'
import { deleteChef } from '../../../actions/admin/chef.actions'

export default function DeleteChefModal({ chef, isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowModal(true)
      document.body.style.overflow = 'hidden'
    } else {
      setTimeout(() => setShowModal(false), 300)
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (!chef) return
    
    setIsLoading(true)
    setError('')

    try {
      const result = await deleteChef(chef.id)

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error)
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } catch (err) {
      setError('Произошла ошибка при удалении повара')
      console.error('Delete chef error:', err)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setIsLoading(false)
    }
  }

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!showModal || !chef) return null

  // Проверяем, можно ли удалить повара
  const canDelete = !(
    chef._count?.products > 0 || 
    chef._count?.orders > 0 || 
    chef._count?.reviews > 0 ||
    chef.products?.length > 0 ||
    chef.orders?.length > 0 ||
    chef.reviews?.length > 0
  )

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Миниатюрное модальное окно */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        ${shake ? 'animate-shake' : ''}
      `}>
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Удаление повара
              </h3>
              <p className="text-sm text-gray-600">Подтвердите действие</p>
            </div>
          </div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-scale-in">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Информация о поваре */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {chef.businessName?.charAt(0) || 'П'}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900 text-sm">
                  {chef.businessName}
                </p>
                <p className="text-xs text-gray-600">
                  {chef.user?.firstName || 'Не указано'} • ID: {chef.id}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    chef.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {chef.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Сообщение */}
          <p className="text-gray-700 text-center text-sm">
            Вы уверены, что хотите удалить повара <span className="font-semibold">{chef.businessName}</span>?
          </p>

          {/* Предупреждение */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-yellow-800 text-xs font-medium">
                  Это действие нельзя отменить
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  Все данные повара будут безвозвратно удалены
                </p>
              </div>
            </div>
          </div>

          {/* Проверка связанных данных */}
          {!canDelete && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-xs font-medium mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Связанные данные:
              </p>
              <ul className="text-blue-700 text-xs space-y-1">
                {chef._count?.products > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Товары: <span className="font-semibold ml-1">{chef._count.products}</span>
                  </li>
                )}
                {chef._count?.orders > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Заказы: <span className="font-semibold ml-1">{chef._count.orders}</span>
                  </li>
                )}
                {chef._count?.reviews > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Отзывы: <span className="font-semibold ml-1">{chef._count.reviews}</span>
                  </li>
                )}
              </ul>
              <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700 text-xs font-medium">
                    Удаление невозможно
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all duration-200 flex items-center group"
          >
            <svg 
              className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Отмена
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading || !canDelete}
            className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center group shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Удаление...
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Удалить
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}