// src/app/admin/Components/layout/admin-header.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatedContainer } from '../animation-component'
import { NotificationBell } from '../notificationBell'
import { AdminModal, useAdminModal } from '../AdminModal'

export default function AdminHeader({ onToggleSidebar, sidebarOpen }) {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const profileModal = useAdminModal()

  // Обработчик для обновления счетчика уведомлений
  const handleNotificationsUpdate = (count) => {
    setNotificationsCount(count)
  }

  return (
    <AnimatedContainer
      animation="fadeInDown"
      duration="normal"
      className="bg-white shadow-lg border-b border-gray-200 admin-transition"
    >
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Левая часть с анимациями */}
        <div className="flex items-center space-x-4">
          {/* Кнопка меню */}
          <AnimatedContainer animation="fadeInLeft" delay={100}>
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover-lift"
              aria-label="Переключить меню"
            >
              <svg
                className={`w-6 h-6 text-gray-600 transition-transform duration-500 ease-in-out ${sidebarOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </AnimatedContainer>

          {/* Заголовок с счетчиком уведомлений */}
          <AnimatedContainer animation="scaleIn" delay={200}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover-glow transition-all duration-300">
                <span className="text-white font-bold text-lg">🍰</span>
              </div>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse-gentle">
                    Cake App Admin
                  </h1>
                  <p className="text-sm text-gray-500 animate-fade-in-up">
                    Панель управления
                  </p>
                </div>

                {/* Бейдж с общим количеством уведомлений */}
                {notificationsCount > 0 && (
                  <AnimatedContainer
                    animation="scaleIn"
                    className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    {notificationsCount} уведомлений
                  </AnimatedContainer>
                )}
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Правая часть с анимациями */}
        <div className="flex items-center space-x-4">
          {/* Компонент уведомлений */}
          <AnimatedContainer animation="fadeInRight" delay={300}>
            <NotificationBell onNotificationsUpdate={handleNotificationsUpdate} />
          </AnimatedContainer>

          {/* Профиль пользователя с информацией об уведомлениях */}
          <AnimatedContainer animation="fadeInRight" delay={400}>
            <div className="relative">
              <button
                ref={profileModal.triggerRef}
                onClick={profileModal.open}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover-lift group"
                aria-label="Меню профиля"
              >
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300 shadow-lg hover-glow">
                    A
                  </div>
                  {/* Индикатор онлайн статуса */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse-gentle"></div>

                  {/* Индикатор уведомлений в профиле */}
                  {notificationsCount > 0 && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{notificationsCount > 9 ? '9+' : notificationsCount}</span>
                    </div>
                  )}
                </div>

                <div className="hidden md:block text-left">
                  <span className="text-gray-700 font-medium block">
                    Администратор
                  </span>
                  <span className="text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Онлайн
                    {notificationsCount > 0 && (
                      <span className="ml-2 text-orange-600">
                        • {notificationsCount} новых
                      </span>
                    )}
                  </span>
                </div>
              </button>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Модальное окно профиля */}
      <AdminModal
        isOpen={profileModal.isOpen}
        onClose={profileModal.close}
        size="sm"
        position="topRight"
        className="mt-16 mr-2"
        showMaximizeButton={false}
        closeOnEscape={true}
        closeOnBackdropClick={true}
        triggerRef={profileModal.triggerRef}
      >
        {/* Содержимое модального окна */}
        <div className="space-y-4 min-w-[300] mt-8">
          {/* Информация о пользователе */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Администратор</h3>
              <p className="text-sm text-gray-600">admin@cakeapp.ru</p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Активный
                </span>
                {notificationsCount > 0 && (
                  <span className="text-xs text-orange-600">
                    {notificationsCount} увед.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-2">
            <Link
              href="/admin/profile"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift"
              onClick={profileModal.close}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <span className="block font-medium text-sm">Мой профиль</span>
                <span className="text-xs text-gray-500">Управление аккаунтом</span>
              </div>
            </Link>

          <Link
              href="/admin/notifications"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift relative"
              onClick={profileModal.close}
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2 2V15h15v-.75l-2-2V9.75a6 6 0 0 0-6-6z" />
                </svg>
              </div>
              <div>
                <span className="block font-medium text-sm">Уведомления</span>
                <span className="text-xs text-gray-500">
                  {notificationsCount > 0 ? `${notificationsCount} непрочитанных` : 'Все прочитаны'}
                </span>
              </div>
              {notificationsCount > 0 && (
                <div className="absolute right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{notificationsCount}</span>
                </div>
              )}
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift"
              onClick={profileModal.close}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="block font-medium text-sm">Настройки</span>
                <span className="text-xs text-gray-500">Персонализация системы</span>
              </div>
            </Link>

            <div className="border-t border-gray-200 pt-2">
              <button className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover-lift">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className='flex justify-center items-start flex-col'>
                  <span className="block font-medium text-sm">Выйти</span>
                  <span className="text-xs text-red-500">Завершить сеанс</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </AdminModal>
    </AnimatedContainer>
  )
}