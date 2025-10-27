// app/admin/users/[id]/components/user-profile.jsx
'use client'

import Link from 'next/link'

export default function UserProfile({ user }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-scale-in">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-2xl animate-pulse">
          <span className="text-3xl font-bold text-white">
            {user.firstName?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {user.firstName || 'Без имени'} {user.lastName || ''}
        </h2>
        <p className="text-gray-600 mb-3">{user.email}</p>
        {user.chefProfile ? (
          <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg animate-pulse">
            👨‍🍳 Профессиональный повар
          </span>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
            👤 Клиент
          </span>
        )}
      </div>

      <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            ID пользователя:
          </span>
          <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{user.id}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
            Телефон:
          </span>
          <span className="text-sm text-gray-900">{user.phone || 'Не указан'}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Дата регистрации:
          </span>
          <span className="text-sm text-gray-900">{formatDate(user.createdAt)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Последнее обновление:
          </span>
          <span className="text-sm text-gray-900">{formatDate(user.updatedAt)}</span>
        </div>
      </div>

      {/* Адреса */}
      {user.addresses && user.addresses.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Адреса доставки
          </h3>
          <div className="space-y-3">
            {user.addresses.map((address, index) => (
              <div 
                key={address.id} 
                className="text-sm p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover-lift transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-medium text-gray-900">
                  {address.street}, {address.city}
                </div>
                {address.isDefault && (
                  <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full mt-1 inline-block">
                    📍 Основной адрес
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Профиль повара */}
      {user.chefProfile && (
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
            Профиль повара
          </h3>
          <div className="text-sm p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">ID профиля:</span>
              <span className="font-mono text-gray-900">{user.chefProfile.id}</span>
            </div>
            <Link 
              href={`/admin/chefs/${user.chefProfile.id}`}
              className="text-orange-600 hover:text-orange-800 font-medium transition-all duration-300 flex items-center justify-center group mt-3"
            >
              Перейти к профилю повара
              <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}