'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteAllReadNotifications,
  deleteNotification,
  getUnreadNotificationsCount
} from '../../actions/admin/notification.actions'
import { AnimatedContainer } from '../Components/animation-component'
import NotificationsHeader from '../Components/NotificationsHeader'
import NotificationsStats from '../Components/NotificationsStats'
import NotificationsFilters from '../Components/NotificationsFilters'
import NotificationsList from '../Components/NotificationsList'
import NotificationsSkeleton from '../Components/NotificationsSkeleton'

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

  if (isLoading) {
    return <NotificationsSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/20 p-6">
      <AnimatedContainer animation="fadeInUp" className="max-w-4xl mx-auto">
        <NotificationsHeader />
        
        <NotificationsStats 
          notificationsCount={notifications.length}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteAllRead={handleDeleteAllRead}
        />

        <NotificationsFilters 
          filter={filter}
          priorityFilter={priorityFilter}
          onFilterChange={setFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        <NotificationsList
          notifications={filteredNotifications}
          filter={filter}
          onMarkAsRead={handleMarkAsRead}
          onDeleteNotification={handleDeleteNotification}
        />
      </AnimatedContainer>
    </div>
  )
}