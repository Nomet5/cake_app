// src/app/admin/page.js
import { getAdminDashboardStats } from "../actions/admin/dashborad.actions";
import StatsCards from './Components/dashbord/StatisticCard'
import RecentActivities from './Components/dashbord/recent-activities'
import ChartsSection from './Components/dashbord/charts-section'
import QuickActions from './Components/dashbord/quick-actions'

export default async function AdminDashboard() {
  const result = await getAdminDashboardStats()

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Ошибка</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    )
  }

  const { stats } = result

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-600">Обзор статистики и активности</p>
        </div>
        <div className="text-sm text-gray-500">
          Обновлено: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Статистические карточки */}
      <StatsCards stats={stats} />

      {/* Графики и аналитика */}
      <ChartsSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Быстрые действия */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Последние активности */}
        <div className="lg:col-span-2">
          <RecentActivities stats={stats} />
        </div>
      </div>
    </div>
  )
}