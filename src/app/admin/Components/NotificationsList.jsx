import { Bell, BellOff, Eye, Trash2, AlertCircle, Info, Star } from 'lucide-react'
import { AnimatedCard, AnimatedList, AnimatedButton, AnimatedContainer } from './animation-component'

export default function NotificationsList({ 
  notifications, 
  filter, 
  onMarkAsRead, 
  onDeleteNotification 
}) {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'MEDIUM':
        return <Info className="w-5 h-5 text-amber-500" />
      case 'LOW':
        return <Star className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      HIGH: 'bg-red-100 text-red-800 border-red-200',
      MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
      LOW: 'bg-blue-100 text-blue-800 border-blue-200',
      DEFAULT: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    
    const labels = {
      HIGH: 'Высокий',
      MEDIUM: 'Средний',
      LOW: 'Низкий'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${styles[priority] || styles.DEFAULT}`}>
        {labels[priority] || 'Обычный'}
      </span>
    )
  }

  const formatDate = (date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Только что'
    } else if (diffInHours < 24) {
      return `${diffInHours} ч. назад`
    } else {
      return notificationDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="space-y-6">
      {notifications.length === 0 ? (
        <AnimatedCard className="p-12 text-center bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
            <BellOff className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Уведомлений нет</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {filter === 'ALL' 
              ? 'Здесь будут появляться системные уведомления и оповещения' 
              : 'Нет уведомлений по выбранным фильтрам'
            }
          </p>
        </AnimatedCard>
      ) : (
        <AnimatedList
          items={notifications}
          renderItem={(notification, index) => (
            <AnimatedCard
              key={notification.id}
              hoverable={true}
              className={`transition-all duration-300 border-2 ${
                !notification.isRead 
                  ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/30 shadow-blue-100/50 hover:shadow-lg' 
                  : 'border-gray-200/70 bg-white/60 hover:bg-white/80'
              } rounded-2xl shadow-sm hover:shadow-md backdrop-blur-sm`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-xl ${
                      !notification.isRead 
                        ? 'bg-blue-100 border border-blue-200' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}>
                      {getPriorityIcon(notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-semibold truncate ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                      
                  <div className="flex items-center gap-3 ml-4">
                    {!notification.isRead && (
                      <AnimatedContainer
                        animation="pulse"
                        className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full shadow-sm"
                      >
                        Новое
                      </AnimatedContainer>
                    )}
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
                  
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  <div className="flex items-center gap-4">
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-200 hover:gap-3 group"
                      >
                        Перейти к действию
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <AnimatedButton
                        onClick={() => onMarkAsRead(notification.id)}
                        size="sm"
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        Прочитано
                      </AnimatedButton>
                    )}
                    <AnimatedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          )}
          staggerDelay={100}
          className="space-y-5"
        />
      )}
    </div>
  )
}