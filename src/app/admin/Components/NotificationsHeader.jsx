import { Bell } from 'lucide-react'

export default function NotificationsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200/50">
          <Bell className="w-6 h-6 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
          Уведомления
        </h1>
      </div>
      <p className="text-gray-600 text-lg">
        Управление системными уведомлениями и оповещениями
      </p>
    </div>
  )
}