// components/admin/dashboard/charts-section.jsx
'use client'

import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

const ChartPlaceholder = ({ title, description, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-500">
        <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>График будет отображен здесь</p>
      </div>
    </div>
  </div>
)

export default function ChartsSection({ stats }) {
  const { ordersByStatus, financial } = stats

  // Статистика по статусам заказов для круговой диаграммы
  const statusData = Object.entries(ordersByStatus || {}).map(([status, count]) => ({
    status,
    count
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartPlaceholder
        title="Выручка по дням"
        description="Динамика выручки за последние 30 дней"
        icon={BarChart3}
      />
      
      <ChartPlaceholder
        title="Статусы заказов"
        description="Распределение заказов по статусам"
        icon={PieChart}
      />
      
      {/* Дополнительная статистика */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Средний чек</h4>
          <p className="text-2xl font-bold text-green-600">
            ₽{Math.round(financial.averageOrderValue || 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Активные товары</h4>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totals.activeProducts?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Верифицированные повара</h4>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totals.verifiedChefs?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  )
}