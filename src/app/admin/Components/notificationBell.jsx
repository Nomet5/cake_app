// components/NotificationBell.tsx
'use client'

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Check, Trash2, ExternalLink, Settings, RotateCw } from 'lucide-react'
import { AnimatedContainer, AnimatedList, AnimatedButton } from './animation-component'
import { getUnreadNotificationsCount, getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllReadNotifications } from '../../actions/admin/notification.actions'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const isOpenRef = useRef(isOpen)
  const closeTimeoutRef = useRef(null)

  // Обновляем ref при изменении isOpen
  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Функция закрытия с анимацией
  const handleClose = useCallback(() => {
    setIsClosing(true)
    
    // Очищаем предыдущий таймер
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    
    // Устанавливаем новый таймер для полного закрытия
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 300)
  }, [])

  // Функция открытия
  const handleOpen = () => {
    setIsOpen(true)
    setIsClosing(false)
    
    // Очищаем таймер закрытия если он активен
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
  }

  // Переключение состояния
  const handleToggle = () => {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }

  // Загрузка уведомлений
  const loadNotifications = useCallback(async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }
    
    try {
      const [countResult, notificationsResult] = await Promise.all([
        getUnreadNotificationsCount(),
        getUserNotifications()
      ])

      if (countResult.success) {
        setUnreadCount(countResult.count)
      }

      if (notificationsResult.success) {
        setNotifications(notificationsResult.notifications)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Первоначальная загрузка
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Обновление уведомлений каждые 30 секунд только если окно открыто
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpenRef.current) {
        loadNotifications(true)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [loadNotifications])

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что клик был не по кнопке и не по dropdown
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        handleClose()
      }
    }

    // Используем setTimeout чтобы событие сработало после обработчика кнопки
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClose])

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleClose])

  // Отметить уведомление как прочитанное
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Отметить все как прочитанные
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Удалить все прочитанные
  const handleDeleteAllRead = async () => {
    try {
      await deleteAllReadNotifications()
      setNotifications(prev => prev.filter(notif => !notif.isRead))
    } catch (error) {
      console.error('Error deleting read notifications:', error)
    }
  }

  // Ручное обновление
  const handleRefresh = () => {
    loadNotifications(true)
  }

  // Получить цвет приоритета
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200'
      case 'MEDIUM':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-200'
      case 'LOW':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-200'
    }
  }

  // Получить иконку приоритета
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '🔴'
      case 'MEDIUM':
        return '🟡'
      case 'LOW':
        return '🔵'
      default:
        return '⚪'
    }
  }

  // Форматирование времени
  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Только что'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffHours < 24) return `${diffHours} ч назад`
    if (diffDays < 7) return `${diffDays} дн назад`
    return new Date(date).toLocaleDateString('ru-RU')
  }

  return (
    <div className="relative">
      {/* Кнопка колокольчика */}
      <div ref={buttonRef}>
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="relative p-3 rounded-2xl hover-lift bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300"
          aria-label="Уведомления"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <AnimatedContainer
              animation="scaleIn"
              key={unreadCount}
              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-lg"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </AnimatedContainer>
          )}
        </AnimatedButton>
      </div>

      {/* Модальное окно уведомлений */}
      {(isOpen || isClosing) && (
        <div 
          ref={dropdownRef}
          className={`
            absolute right-0 top-full mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 z-[9999] transform-3d max-h-[75vh] flex flex-col overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen && !isClosing 
              ? 'animate-fade-in-down opacity-100 translate-y-0 scale-100' 
              : 'animate-fade-out-up opacity-0 -translate-y-2 scale-95'
            }
          `}
        >
          {/* Заголовок с градиентом */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Уведомления</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все уведомления прочитаны'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {/* Кнопка обновления */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                  title="Обновить уведомления"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                    title="Отметить все как прочитанные"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDeleteAllRead}
                  className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                  title="Удалить все прочитанные"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Индикатор обновления */}
          {isRefreshing && (
            <div className="bg-blue-500/10 py-1 px-4 text-xs text-blue-600 font-medium text-center">
              Обновление уведомлений...
            </div>
          )}

          {/* Список уведомлений */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-500" />
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">Нет уведомлений</h4>
                <p className="text-gray-500 text-sm">Здесь появятся новые уведомления</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`group relative p-4 transition-all duration-300 rounded-xl border border-transparent hover:border-gray-200 hover:shadow-lg hover:scale-[1.02] transform-gpu ${
                      !notification.isRead 
                        ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border-l-4 border-l-blue-500 shadow-sm' 
                        : 'bg-white/80 hover:bg-white'
                    }`}
                  >
                    {/* Эффект при наведении */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative flex gap-3">
                      {/* Аватар приоритета */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform duration-300 group-hover:scale-110 ${getPriorityColor(notification.priority)}`}>
                          {getPriorityIcon(notification.priority)}
                        </div>
                      </div>

                      {/* Контент */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 group-hover:scale-105 ${getPriorityColor(notification.priority)} shadow-sm`}>
                              {notification.priority === 'HIGH' && 'Важно'}
                              {notification.priority === 'MEDIUM' && 'Средний'}
                              {notification.priority === 'LOW' && 'Информация'}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full transition-transform duration-300 group-hover:scale-125" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1 transition-colors duration-300 group-hover:text-gray-700">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight transition-colors duration-300 group-hover:text-gray-800">
                          {notification.title}
                        </h4>

                        <p className="text-gray-600 mb-3 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-3">
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl || '/admin/notifications'}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-all duration-300 group-hover:gap-2 group-hover:translate-x-0.5"
                                onClick={() => handleClose()}
                              >
                                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                                Перейти к действию
                              </Link>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                              >
                                Прочитано
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <Link
              href="/admin/notifications"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all py-2.5 rounded-xl hover:bg-gray-50/80 group"
              onClick={() => handleClose()}
            >
              <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
              Все уведомления
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-300" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}