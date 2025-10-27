// components/admin/dashboard/stats-cards.jsx
'use client'

import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, ChefHat, Star, DollarSign } from 'lucide-react'

const StatCard = ({ title, value, change, icon: Icon, changeType = 'positive' }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
)

export default function StatsCards({ stats }) {
  const { totals, periodStats, financial } = stats

  const statCards = [
    {
      title: 'Всего пользователей',
      value: totals.users?.toLocaleString() || '0',
      icon: Users,
      change: periodStats.ordersGrowth,
      changeType: periodStats.ordersGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Всего товаров',
      value: totals.products?.toLocaleString() || '0',
      icon: Package,
      change: 5.2,
      changeType: 'positive'
    },
    {
      title: 'Всего заказов',
      value: totals.orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: periodStats.ordersGrowth,
      changeType: periodStats.ordersGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Заказов сегодня',
      value: periodStats.today?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: periodStats.ordersGrowth,
      changeType: periodStats.ordersGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Поваров',
      value: totals.chefs?.toLocaleString() || '0',
      icon: ChefHat,
      change: 2.1,
      changeType: 'positive'
    },
    {
      title: 'Общая выручка',
      value: `₽${financial.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      change: periodStats.revenueGrowth,
      changeType: periodStats.revenueGrowth >= 0 ? 'positive' : 'negative'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          changeType={stat.changeType}
        />
      ))}
    </div>
  )
}