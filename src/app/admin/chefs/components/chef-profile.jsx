// app/admin/chefs/[id]/components/chef-profile.jsx
'use client'

import Link from 'next/link'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'

export default function ChefProfile({ chef }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (chef) => {
    return chef.businessName?.[0]?.toUpperCase() || chef.user?.firstName?.[0]?.toUpperCase() || 'П'
  }

  const getAvatarColor = (chef) => {
    const colors = [
      'from-orange-500 to-red-600',
      'from-amber-500 to-orange-600', 
      'from-yellow-500 to-amber-600',
      'from-red-500 to-pink-600',
      'from-orange-400 to-red-500'
    ]
    const index = chef.id % colors.length
    return colors[index]
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
    )
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
          className="h-24 w-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-2xl relative"
        >
          <span className="text-3xl font-bold text-white">
            {getInitials(chef)}
          </span>
          {/* Индикатор статуса */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-lg ${
            chef.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </AnimatedContainer>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {chef.businessName || 'Не указано'}
        </h2>
        <p className="text-gray-600 mb-3">{chef.user?.email}</p>
        
        <div className="flex items-center justify-center space-x-4 mb-3">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900 mr-1">
              {chef.rating || '4.8'}
            </span>
            {renderStars(chef.rating || 4.8)}
          </div>
          {chef.specialization && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {chef.specialization}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {chef.isVerified && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Верифицирован
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
            chef.isActive 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow' 
              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow'
          }`}>
            {chef.isActive ? '✅ Активен' : '⏸️ Неактивен'}
          </span>
        </div>
      </div>

      {/* Основная информация */}
      <div className="space-y-4">
        <AnimatedContainer animation="fadeInUp" delay={200}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              ID повара:
            </span>
            <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
              {chef.id}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={250}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              Контактное лицо:
            </span>
            <span className="text-sm text-gray-900">
              {chef.user?.firstName || (
                <span className="text-gray-400 italic">Не указано</span>
              )}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={300}>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-500 flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              Телефон:
            </span>
            <span className="text-sm text-gray-900">
              {chef.user?.phone || (
                <span className="text-gray-400 italic">Не указан</span>
              )}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={350}>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Опыт работы:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {chef.yearsOfExperience ? `${chef.yearsOfExperience} лет` : 'Не указан'}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={400}>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Дата регистрации:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(chef.createdAt)}
            </span>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeInUp" delay={450}>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Последнее обновление:
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDate(chef.updatedAt)}
            </span>
          </div>
        </AnimatedContainer>
      </div>

      {/* Описание повара */}
      {chef.description && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={500}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            О поваре
          </h3>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              {chef.description}
            </p>
          </div>
        </AnimatedContainer>
      )}

      {/* Статистика */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={550}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Статистика
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-600">{chef._count?.products || 0}</div>
            <div className="text-xs text-gray-600">Товаров</div>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{chef._count?.orders || 0}</div>
            <div className="text-xs text-gray-600">Заказов</div>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-600">{chef._count?.reviews || 0}</div>
            <div className="text-xs text-gray-600">Отзывов</div>
          </div>
          <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {chef.rating || '4.8'}
            </div>
            <div className="text-xs text-gray-600">Рейтинг</div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Действия */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={600}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <div className="flex space-x-3">
          <AnimatedButton
            as={Link}
            href={`/admin/chefs/${chef.id}/edit`}
            variant="primary"
            size="sm"
            className="flex-1 justify-center bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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

        {/* Дополнительные действия */}
        <div className="flex space-x-2 mt-3">
          <AnimatedButton
            variant={chef.isActive ? "secondary" : "success"}
            size="sm"
            className="flex-1 justify-center text-xs"
          >
            {chef.isActive ? '⏸️ Деактивировать' : '✅ Активировать'}
          </AnimatedButton>
          
          {!chef.isVerified && (
            <AnimatedButton
              variant="success"
              size="sm"
              className="flex-1 justify-center text-xs"
            >
              ⭐ Верифицировать
            </AnimatedButton>
          )}
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}