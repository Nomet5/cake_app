'use client'

import { useState, useEffect } from 'react'
import { Check, Trash2, Filter, Bell, BellOff, AlertCircle, Info, Star } from 'lucide-react'
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteAllReadNotifications,
  deleteNotification,
  getUnreadNotificationsCount
} from '../../actions/admin/notification.actions'
import { AnimatedContainer, AnimatedList, AnimatedButton, AnimatedCard, SkeletonLoader } from '../Components/animation-component'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const [countResult, notificationsResult] = await Promise.all([
        getUnreadNotificationsCount(),
        getUserNotifications(undefined, 100)
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'ALL' || 
      (filter === 'UNREAD' && !notification.isRead) ||
      (filter === 'READ' && notification.isRead)
    
    const matchesPriority = 
      priorityFilter === 'ALL' || 
      notification.priority === priorityFilter

    return matchesFilter && matchesPriority
  })

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDeleteAllRead = async () => {
    try {
      await deleteAllReadNotifications()
      setNotifications(prev => prev.filter(notif => !notif.isRead))
    } catch (error) {
      console.error('Error deleting read:', error)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      if (!notifications.find(n => n.id === id)?.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'MEDIUM':
        return <Info className="w-4 h-4 text-yellow-500" />
      case 'LOW':
        return <Star className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <AnimatedContainer animation="fadeInUp" className="max-w-4xl mx-auto">
          {/* Скелетон заголовка */}
          <div className="mb-6 space-y-4">
            <SkeletonLoader type="title" className="w-1/4" />
            <SkeletonLoader type="text" className="w-1/2" />
          </div>

          {/* Скелетон статистики */}
          <AnimatedCard className="p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <SkeletonLoader type="avatar" />
                    <div className="space-y-1">
                      <SkeletonLoader type="text" className="w-20" />
                      <SkeletonLoader type="text" className="w-16" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {[...Array(2)].map((_, i) => (
                  <SkeletonLoader key={i} type="button" className="w-32" />
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Скелетон фильтров */}
          <AnimatedCard className="p-4 mb-6">
            <div className="flex items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} type="button" className="w-24" />
              ))}
            </div>
          </AnimatedCard>

          {/* Скелетон уведомлений */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <AnimatedCard key={i} className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SkeletonLoader type="avatar" />
                      <SkeletonLoader type="title" className="w-48" />
                    </div>
                    <SkeletonLoader type="text" className="w-32" />
                  </div>
                  <SkeletonLoader type="text" className="w-full" />
                  <SkeletonLoader type="text" className="w-3/4" />
                  <div className="flex justify-between">
                    <SkeletonLoader type="text" className="w-20" />
                    <SkeletonLoader type="button" className="w-24" />
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <AnimatedContainer animation="fadeInUp" className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Уведомления</h1>
          <p className="text-gray-600">
            Управление системными уведомлениями и оповещениями
          </p>
        </div>

        {/* Статистика и действия */}
        <AnimatedCard hoverable={true} className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Всего: <strong>{notifications.length}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  Непрочитанных: <strong>{unreadCount}</strong>
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <AnimatedButton
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Прочитать все
                </AnimatedButton>
              )}
              <AnimatedButton
                variant="danger"
                onClick={handleDeleteAllRead}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Удалить прочитанные
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>

        {/* Фильтры */}
        <AnimatedCard className="p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Фильтры:</span>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="ALL">Все уведомления</option>
              <option value="UNREAD">Непрочитанные</option>
              <option value="READ">Прочитанные</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="ALL">Все приоритеты</option>
              <option value="HIGH">Высокий</option>
              <option value="MEDIUM">Средний</option>
              <option value="LOW">Низкий</option>
            </select>
          </div>
        </AnimatedCard>

        {/* Список уведомлений */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <AnimatedCard className="p-8 text-center">
              <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомлений нет</h3>
              <p className="text-gray-600">
                {filter === 'ALL' 
                  ? 'Здесь будут появляться системные уведомления' 
                  : 'Нет уведомлений по выбранным фильтрам'
                }
              </p>
            </AnimatedCard>
          ) : (
            <AnimatedList
              items={filteredNotifications}
              renderItem={(notification, index) => (
                <AnimatedCard
                  key={notification.id}
                  hoverable={true}
                  className={`transition-all duration-300 ${
                    !notification.isRead 
                      ? 'border-blue-200 bg-blue-50 shadow-blue-100' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getPriorityIcon(notification.priority)}
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <AnimatedContainer
                            animation="pulse"
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            Новое
                          </AnimatedContainer>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-all hover-lift"
                          >
                            Перейти к действию →
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <AnimatedButton
                            onClick={() => handleMarkAsRead(notification.id)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Check className="w-3 h-3" />
                            Прочитано
                          </AnimatedButton>
                        )}
                        <AnimatedButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              )}
              staggerDelay={100}
            />
          )}
        </div>
      </AnimatedContainer>
    </div>
  )
}