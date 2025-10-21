// components/UserForm.tsx
'use client'

import { useState } from 'react'
import { createUser, updateUser } from '../../lib/actions/user.actions'

export function UserForm({ user }: { user?: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError('')

    const result = user 
      ? await updateUser(user.id, formData)
      : await createUser(formData)

    if (result.success) {
      window.location.href = '/admin/users'
    } else {
      setError(result.error || 'Произошла ошибка')
    }
    
    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={user?.email}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
          Имя *
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          defaultValue={user?.firstName}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Телефон
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={user?.phone || ''}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex-1"
        >
          {isLoading ? 'Сохранение...' : (user ? 'Обновить' : 'Создать')}
        </button>
        <a
          href={user ? `/admin/users/${user.id}` : '/admin/users'}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
        >
          Отмена
        </a>
      </div>
    </form>
  )
}