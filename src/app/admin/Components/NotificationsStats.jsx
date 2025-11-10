import { Bell, Check, Trash2 } from 'lucide-react'
import { AnimatedCard, AnimatedButton } from './animation-component'

export default function NotificationsStats({ 
  notificationsCount, 
  unreadCount, 
  onMarkAllAsRead, 
  onDeleteAllRead 
}) {
  return (
    <AnimatedCard 
      hoverable={true} 
      className="p-6 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200/50">
            <div className="p-2 bg-white rounded-lg shadow-xs border border-blue-200">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Всего уведомлений</p>
              <p className="text-2xl font-bold text-blue-700">{notificationsCount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200/50">
            <div className="p-2 bg-white rounded-lg shadow-xs border border-emerald-200">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900">Непрочитанных</p>
              <p className="text-2xl font-bold text-emerald-700">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {unreadCount > 0 && (
            <AnimatedButton
              onClick={onMarkAllAsRead}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Check className="w-4 h-4" />
              Прочитать все
            </AnimatedButton>
          )}
          <AnimatedButton
            variant="danger"
            onClick={onDeleteAllRead}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Trash2 className="w-4 h-4" />
            Очистить прочитанные
          </AnimatedButton>
        </div>
      </div>
    </AnimatedCard>
  )
}