// components/NotificationBell.tsx
'use client'

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react'
import { AnimatedContainer, AnimatedList, AnimatedButton } from './animation-component'
import { getUnreadNotificationsCount, getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllReadNotifications } from '../../actions/admin/notification.actions'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Загрузка уведомлений
  const loadNotifications = async () => {
    setIsLoading(true)
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
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  // Обновление уведомлений каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  // Получить цвет приоритета
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Форматирование времени
  const formatTime = (date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'только что'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffHours < 24) return `${diffHours} ч назад`
    if (diffDays < 7) return `${diffDays} дн назад`
    return new Date(date).toLocaleDateString('ru-RU')
  }

  return (
    <AnimatedContainer animation="fadeInUp" delay={200} className="relative">
      <div ref={dropdownRef}>
        {/* Кнопка колокольчика */}
        <AnimatedButton
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-lg hover-lift"
          aria-label="Уведомления"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <AnimatedContainer
              animation="scaleIn"
              key={unreadCount}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </AnimatedContainer>
          )}
        </AnimatedButton>

        {/* Dropdown с уведомлениями */}
        {isOpen && (
          <AnimatedContainer
            animation="fadeInDown"
            duration="fast"
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 transform-3d"
          >
            {/* Заголовок */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Уведомления</h3>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover-lift transition-all"
                      title="Отметить все как прочитанные"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleDeleteAllRead}
                    className="p-1 text-gray-500 hover:text-red-600 rounded-lg hover-lift transition-all"
                    title="Удалить все прочитанные"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex space-x-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <AnimatedContainer animation="fadeInUp" className="p-4 text-center text-gray-500">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>Нет уведомлений</p>
                </AnimatedContainer>
              ) : (
                <AnimatedList
                  items={notifications}
                  renderItem={(notification, index) => (
                    <div
                      className={`p-4 hover:bg-gray-50 transition-all duration-300 ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      } hover-lift`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border transition-all ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority === 'HIGH' && 'Важно'}
                            {notification.priority === 'MEDIUM' && 'Средне'}
                            {notification.priority === 'LOW' && 'Инфо'}
                          </span>
                          {!notification.isRead && (
                            <AnimatedContainer
                              animation="pulse"
                              className="w-2 h-2 bg-blue-500 rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h4>

                      <p className="text-sm text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {notification.actionUrl && (
                            <Link
                                href={notification.actionUrl || '/admin/notifications'}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-all hover-lift"
                                onClick={() => setIsOpen(false)}
                            >
                                <ExternalLink className="w-3 h-3" />
                                Перейти
                            </Link>
                            )}
                        </div>

                        {!notification.isRead && (
                          <AnimatedButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs"
                          >
                            Прочитано
                          </AnimatedButton>
                        )}
                      </div>
                    </div>
                  )}
                  staggerDelay={50}
                />
              )}
            </div>

            {/* Футер */}
            <div className="p-3 border-t border-gray-200">
              <a
                href="/admin/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-all hover-lift"
                onClick={() => setIsOpen(false)}
              >
                Все уведомления
              </a>
            </div>
          </AnimatedContainer>
        )}
      </div>
    </AnimatedContainer>
  )
}