// src/app/admin/Components/layout/admin-header.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatedContainer } from '../animation-component'
import { NotificationBell } from '../notification'

export default function AdminHeader({ onToggleSidebar, sidebarOpen }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [notificationsCount, setNotificationsCount] = useState(0)

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
                className={`w-6 h-6 text-gray-600 transition-transform duration-500 ease-in-out ${
                  sidebarOpen ? 'rotate-90' : 'rotate-0'
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
                onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    isProfileOpen ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающее меню профиля */}
              {isProfileOpen && (
                <AnimatedContainer 
                  animation="scaleIn" 
                  duration="fast"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 modal-content"
                >
                  {/* Заголовок профиля */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          A
                        </div>
                        {notificationsCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{notificationsCount}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Администратор</p>
                        <p className="text-xs text-gray-500">admin@cakeapp.ru</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-green-600 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            Активный
                          </p>
                          {notificationsCount > 0 && (
                            <p className="text-xs text-orange-600">
                              {notificationsCount} увед.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Меню действий */}
                  <div className="p-2 space-y-1">
                    <button className="w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift nav-item">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Мой профиль</span>
                          <span className="text-xs text-gray-500">Управление аккаунтом</span>
                        </div>
                      </div>
                    </button>
                    
                    {/* Пункт меню для уведомлений с использованием Link */}
                    <Link 
                      href="/admin/notifications"
                      className="block w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift nav-item relative"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 0-6 6v2.25l-2 2V15h15v-.75l-2-2V9.75a6 6 0 0 0-6-6z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Уведомления</span>
                          <span className="text-xs text-gray-500">
                            {notificationsCount > 0 
                              ? `${notificationsCount} непрочитанных` 
                              : 'Все уведомления прочитаны'
                            }
                          </span>
                        </div>
                      </div>
                      {notificationsCount > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{notificationsCount}</span>
                        </div>
                      )}
                    </Link>
                    
                    <button className="w-full text-left px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 hover-lift nav-item">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <span className="block font-medium">Настройки</span>
                          <span className="text-xs text-gray-500">Персонализация</span>
                        </div>
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    <button className="w-full text-left px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover-lift nav-item">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <div>
                          <span className="block font-medium">Выйти</span>
                          <span className="text-xs text-red-500">Завершить сеанс</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </AnimatedContainer>
              )}
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedContainer>
  )
}