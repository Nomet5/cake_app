// src/app/admin/users/components/EditUserForm.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateUser } from '../..//lib/actions/user.actions'
import Link from 'next/link' // Добавлен импорт Link

export default function EditUserForm({ user }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    email: user.email || '',
    phone: user.phone || ''
  })

  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await updateUser(user.id, formData)
      
      if (result.success) {
        // Перенаправляем на страницу пользователя
        router.push(`/admin/users/${user.id}`)
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Произошла ошибка при обновлении пользователя')
      console.error('Update user error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.firstName}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="user@example.com"
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
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+7 (XXX) XXX-XX-XX"
            disabled={isLoading}
          />
        </div>

        {/* Информация только для чтения */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-500">ID пользователя</label>
            <p className="mt-1 text-gray-900">{user.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Дата регистрации</label>
            <p className="mt-1 text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 pt-6">
          <Link
            href={`/admin/users/${user.id}`}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </Link>
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
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}