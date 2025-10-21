// src/app/admin/users/components/CreateUserModal.jsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createUser } from '../../lib/actions/user.actions'

export default function CreateUserModal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Функция закрытия модального окна
  const handleClose = () => {
    router.push('/admin/users') // Возвращаемся к списку без параметров
  }

  // Обработка отправки формы
  async function handleSubmit(formData) {
    setIsLoading(true)
    setError('')

    try {
      const result = await createUser(formData)

      if (result.success) {
        // Закрываем модальное окно и обновляем страницу
        router.push('/admin/users')
        router.refresh() // Обновляем данные на сервере
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Произошла ошибка при создании пользователя')
      console.error('Create user error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Закрытие по клику на overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Заголовок модального окна */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Добавить пользователя</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Форма */}
        <form action={handleSubmit} className="p-6 space-y-4">
          {/* Сообщение об ошибке */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Поле: Имя */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
          </div>

          {/* Поле: Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Поле: Пароль */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Минимум 6 символов"
              disabled={isLoading}
            />
          </div>

          {/* Поле: Телефон */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+7 (XXX) XXX-XX-XX"
              disabled={isLoading}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </>
              ) : (
                'Создать пользователя'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}