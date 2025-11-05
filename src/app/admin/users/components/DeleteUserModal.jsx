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

  if (!showModal || !user) return null

  return (
    <div className={`
      fixed inset-0 z-[9999] transition-all duration-300
      ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Модальное окно на весь экран */}
      <div className={`
        absolute inset-4 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 flex flex-col
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        ${shake ? 'animate-shake' : ''}
      `}>
        {/* Заголовок с кнопкой закрытия */}
        <div className="flex-shrink-0 p-8 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mr-6 shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Удаление пользователя
              </h1>
              <p className="text-xl text-gray-600 mt-2">Подтвердите действие</p>
            </div>
          </div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 shadow-xl hover:border-red-300"
          >
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Основной контент с прокруткой */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-scale-in">
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-red-800 text-xl font-bold">Ошибка</p>
                    <p className="text-red-700 text-lg mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Информация о пользователе */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Информация о пользователе</h2>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                  {user.firstName?.charAt(0) || user.email.charAt(0)}
                </div>
                <div className="ml-6">
                  <p className="text-2xl font-semibold text-gray-900">
                    {user.firstName || 'Без имени'}
                  </p>
                  <p className="text-xl text-gray-600 mt-2">{user.email}</p>
                  <p className="text-lg text-gray-500 mt-1">ID: {user.id}</p>
                </div>
              </div>
            </div>

            {/* Основное сообщение */}
            <div className="text-center">
              <p className="text-2xl text-gray-800 leading-relaxed mb-4">
                Вы уверены, что хотите <span className="text-red-600 font-bold">безвозвратно удалить</span> этого пользователя?
              </p>
              <p className="text-xl text-gray-600">
                Это действие нельзя отменить, и все данные пользователя будут удалены из системы.
              </p>
            </div>

            {/* Предупреждение */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8">
              <div className="flex items-start">
                <svg className="w-10 h-10 text-yellow-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-800 mb-3">
                    ⚠️ Критическое предупреждение
                  </h3>
                  <p className="text-xl text-yellow-700 mb-4">
                    Это действие приведет к полному удалению всех данных пользователя из системы.
                  </p>
                  <ul className="text-lg text-yellow-700 space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                      Все личные данные будут удалены
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                      История заказов будет очищена
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                      Отзывы и рейтинги будут удалены
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                      Восстановление данных невозможно
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Связанные данные */}
            {(user._count || user.chefProfile) && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                  <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Связанные данные для удаления:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user._count?.orders > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-lg font-semibold text-blue-800">Заказы:</span>
                        <span className="ml-2 text-xl font-bold text-blue-600">{user._count.orders}</span>
                      </div>
                    </div>
                  )}
                  {user._count?.reviews > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-lg font-semibold text-blue-800">Отзывы:</span>
                        <span className="ml-2 text-xl font-bold text-blue-600">{user._count.reviews}</span>
                      </div>
                    </div>
                  )}
                  {user._count?.addresses > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-lg font-semibold text-blue-800">Адреса:</span>
                        <span className="ml-2 text-xl font-bold text-blue-600">{user._count.addresses}</span>
                      </div>
                    </div>
                  )}
                  {user.chefProfile && (
                    <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                        <span className="text-lg font-semibold text-blue-800">Профиль повара</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex-shrink-0 border-t-2 border-gray-200 bg-gray-50 p-8 rounded-b-3xl">
          <div className="max-w-6xl mx-auto flex justify-end space-x-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-10 py-4 text-xl text-gray-700 border-2 border-gray-400 rounded-2xl hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 flex items-center group shadow-lg hover:shadow-xl min-w-[180px] justify-center"
            >
              <svg 
                className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:-translate-x-1" 
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
              className="px-10 py-4 text-xl bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center group shadow-2xl hover:shadow-3xl min-w-[220px] justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Удаление...
                </>
              ) : (
                <>
                  <svg 
                    className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Удалить пользователя
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}