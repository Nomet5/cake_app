import { Filter } from 'lucide-react'
import { AnimatedCard } from './animation-component'

export default function NotificationsFilters({ 
  filter, 
  priorityFilter, 
  onFilterChange, 
  onPriorityFilterChange 
}) {
  return (
    <AnimatedCard className="p-5 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-gray-700">Фильтры:</span>
        </div>

        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="ALL">Все уведомления</option>
          <option value="UNREAD">Непрочитанные</option>
          <option value="READ">Прочитанные</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="ALL">Все приоритеты</option>
          <option value="HIGH">Высокий</option>
          <option value="MEDIUM">Средний</option>
          <option value="LOW">Низкий</option>
        </select>
      </div>
    </AnimatedCard>
  )
}