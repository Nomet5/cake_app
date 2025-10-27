// src/app/admin/Components/admin/dashboard/charts-section.jsx
'use client'

import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

const ChartPlaceholder = ({ title, description, icon: Icon, delay = 0 }) => (
  <div 
    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300 animate-scale-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-200">
      <div className="text-center text-gray-500 animate-pulse">
        <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">График загружается...</p>
      </div>
    </div>
  </div>
)

export default function ChartsSection({ stats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <ChartPlaceholder
        title="Выручка по дням"
        description="Динамика выручки за последние 30 дней"
        icon={BarChart3}
        delay={0}
      />
      
      <ChartPlaceholder
        title="Статусы заказов"
        description="Распределение заказов по статусам"
        icon={PieChart}
        delay={0.1}
      />
      
      {/* Дополнительная статистика */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Средний чек
          </h4>
          <p className="text-2xl font-bold text-green-600 animate-pulse">
            ₽{Math.round(stats.financial?.averageOrderValue || 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Активные товары
          </h4>
          <p className="text-2xl font-bold text-blue-600 animate-pulse">
            {stats.totals?.activeProducts?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Верифицированные повара
          </h4>
          <p className="text-2xl font-bold text-purple-600 animate-pulse">
            {stats.totals?.verifiedChefs?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  )
}