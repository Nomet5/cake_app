// app/admin/users/[id]/components/user-profile.jsx
'use client'

import Link from 'next/link'
import { AnimatedContainer, AnimatedButton } from '../../../Components/animation-component'

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

  const getInitials = (user) => {
    return user.firstName?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || 'U'
  }

  const getAvatarColor = (user) => {
    const colors = [
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-pink-600', 
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-purple-600'
    ]
    const index = user.id % colors.length
    return colors[index]
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      {/* Аватар и основная информация */}
      <div className="flex flex-col items-center text-center mb-8">
        <AnimatedContainer
          animation="scaleIn"
          delay={100}
          className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-2xl relative"
        >
          <span className="text-3xl font-bold text-white">
            {getInitials(user)}
          </span>
          {/* Индикатор онлайн статуса */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        </AnimatedContainer>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {user.firstName || 'Без имени'} {user.lastName || ''}
        </h2>
        <p className="text-gray-600 mb-3">{user.email}</p>
        
        {user.chefProfile ? (
          <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg">
            👨‍🍳 Профессиональный повар
          </span>
        ) : (
          <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full">
            👤 Клиент
          </span>
        )}
      </div>

      {/* Основная информация */}
      <div className="space-y-4">
        <AnimatedContainer animation="fadeInUp" delay={200}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              ID пользователя:
            </span>
            <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
              {user.id}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={250}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              Телефон:
            </span>
            <span className="text-sm text-gray-900">
              {user.phone || (
                <span className="text-gray-400 italic">Не указан</span>
              )}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={300}>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Дата регистрации:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(user.createdAt)}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={350}>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Последнее обновление:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(user.updatedAt)}
            </span>
          </div>
        </AnimatedContainer>
      </div>

      {/* Адреса доставки */}
      {user.addresses && user.addresses.length > 0 && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={400}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Адреса доставки ({user.addresses.length})
          </h3>
          <div className="space-y-3">
            {user.addresses.map((address, index) => (
              <AnimatedContainer
                key={address.id}
                animation="fadeInUp"
                delay={400 + (index * 50)}
                className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {address.street}, {address.city}
                    </div>
                    {address.apartment && (
                      <div className="text-xs text-gray-600 mt-1">
                        Кв./офис: {address.apartment}
                      </div>
                    )}
                    {address.isDefault && (
                      <span className="inline-flex items-center text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full mt-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></div>
                        Основной адрес
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {address.postalCode}
                  </div>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>
      )}

      {/* Профиль повара */}
      {user.chefProfile && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={500}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            Профиль повара
          </h3>
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">ID профиля:</span>
                <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {user.chefProfile.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Статус:</span>
                <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                  Активный
                </span>
              </div>
            </div>
            
            <AnimatedButton
              as={Link}
              href={`/admin/chefs/${user.chefProfile.id}`}
              variant="primary"
              size="sm"
              className="w-full justify-center group"
            >
              Перейти к профилю повара
              <svg 
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      )}

      {/* Действия */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={600}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <div className="flex space-x-3">
          <AnimatedButton
            as={Link}
            href={`/admin/users/${user.id}/edit`}
            variant="primary"
            size="sm"
            className="flex-1 justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать
          </AnimatedButton>
          
          <AnimatedButton
            variant="secondary"
            size="sm"
            className="flex-1 justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Сообщение
          </AnimatedButton>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}