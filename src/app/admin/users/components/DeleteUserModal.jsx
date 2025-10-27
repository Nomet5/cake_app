// app/admin/users/components/DeleteUserModal.jsx
'use client'

import { useState, useEffect } from 'react'
import { deleteUser } from '../../../actions/admin/user.actions'

export default function DeleteUserModal({ user, isOpen, onClose, onSuccess }) {
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
    if (!user) return
    
    setIsLoading(true)
    setError('')

    try {
      const result = await deleteUser(user.id)

      if (result.success) {
        onSuccess()
        onClose()
      } else {
        setError(result.error)
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } catch (err) {
      setError('Произошла ошибка при удалении пользователя')
      console.error('Delete user error:', err)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setIsLoading(false)
    }
  }

  if (!showModal || !user) return null

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        ${shake ? 'animate-shake' : ''}
      `}>
        {/* Заголовок с анимацией */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center animate-fade-in">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Удаление пользователя
              </h3>
              <p className="text-sm text-gray-600 mt-1">Подтвердите действие</p>
            </div>
          </div>
        </div>

        {/* Контент с анимацией */}
        <div className="p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 animate-scale-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Информация о пользователе */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.firstName?.charAt(0) || user.email.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">
                  {user.firstName || 'Без имени'}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Вы уверены, что хотите удалить этого пользователя?
          </p>

          {/* Предупреждение с анимацией */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-yellow-800 text-sm font-medium">
                  Внимание: Это действие нельзя отменить
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  Все данные пользователя будут безвозвратно удалены
                </p>
              </div>
            </div>
          </div>

          {/* Проверка связанных данных с анимацией */}
          {(user._count || user.chefProfile) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-blue-800 text-sm font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Связанные данные:
              </p>
              <ul className="text-blue-700 text-sm space-y-2">
                {user._count?.orders > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Заказы: <span className="font-semibold ml-1">{user._count.orders}</span>
                  </li>
                )}
                {user._count?.reviews > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Отзывы: <span className="font-semibold ml-1">{user._count.reviews}</span>
                  </li>
                )}
                {user._count?.addresses > 0 && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Адреса: <span className="font-semibold ml-1">{user._count.addresses}</span>
                  </li>
                )}
                {user.chefProfile && (
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Профиль повара
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Кнопки действий с анимацией */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover-lift flex items-center group"
          >
            <svg 
              className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
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
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift shadow-lg flex items-center group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Удаление...
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" 
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