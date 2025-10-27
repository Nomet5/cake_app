// src/app/admin/Components/admin/dashboard/stats-cards.jsx
'use client'

import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, ChefHat, DollarSign } from 'lucide-react'

const StatCard = ({ title, value, change, icon: Icon, changeType = 'positive', delay = 0 }) => (
  <div 
    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300 animate-scale-in group"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform duration-300">
          {value}
        </p>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
            changeType === 'positive' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${
        changeType === 'positive' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'
      } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    
    {/* Прогресс-бар для визуализации */}
    {change !== undefined && (
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            changeType === 'positive' ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
        ></div>
      </div>
    )}
  </div>
)

export default function StatsCards({ stats }) {
  const { totals, periodStats, financial } = stats

  const statCards = [
    {
      title: 'Всего пользователей',
      value: totals.users?.toLocaleString() || '0',
      icon: Users,
      change: periodStats.userGrowth || 12.5,
      changeType: (periodStats.userGrowth || 12.5) >= 0 ? 'positive' : 'negative',
      delay: 0
    },
    {
      title: 'Всего товаров',
      value: totals.products?.toLocaleString() || '0',
      icon: Package,
      change: 8.2,
      changeType: 'positive',
      delay: 0.1
    },
    {
      title: 'Всего заказов',
      value: totals.orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: periodStats.ordersGrowth || 15.7,
      changeType: (periodStats.ordersGrowth || 15.7) >= 0 ? 'positive' : 'negative',
      delay: 0.2
    },
    {
      title: 'Заказов сегодня',
      value: periodStats.today?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: periodStats.todayGrowth || 5.3,
      changeType: (periodStats.todayGrowth || 5.3) >= 0 ? 'positive' : 'negative',
      delay: 0.3
    },
    {
      title: 'Поваров',
      value: totals.chefs?.toLocaleString() || '0',
      icon: ChefHat,
      change: 3.1,
      changeType: 'positive',
      delay: 0.4
    },
    {
      title: 'Общая выручка',
      value: `₽${financial.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      change: periodStats.revenueGrowth || 18.9,
      changeType: (periodStats.revenueGrowth || 18.9) >= 0 ? 'positive' : 'negative',
      delay: 0.5
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          changeType={stat.changeType}
          delay={stat.delay}
        />
      ))}
    </div>
  )
}