// src/app/admin/Components/admin/dashboard/stats-cards.jsx
'use client'

import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, ChefHat, DollarSign, Minus } from 'lucide-react'

const StatCard = ({ title, value, change, icon: Icon, changeType = 'neutral', delay = 0 }) => (
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
        <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
          changeType === 'positive' 
            ? 'bg-green-100 text-green-700' 
            : changeType === 'negative'
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : changeType === 'negative' ? (
            <TrendingDown className="h-4 w-4 mr-1" />
          ) : (
            <Minus className="h-4 w-4 mr-1" />
          )}
          <span>{change > 0 ? '+' : ''}{change}%</span>
        </div>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-r shadow-lg group-hover:scale-110 transition-transform duration-300 ${
        changeType === 'positive' 
          ? 'from-green-500 to-emerald-500' 
          : changeType === 'negative'
          ? 'from-red-500 to-pink-500'
          : 'from-blue-500 to-purple-500'
      }`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    
    {/* Прогресс-бар для визуализации - ВСЕГДА показываем */}
    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-1000 ${
          changeType === 'positive' 
            ? 'bg-green-500' 
            : changeType === 'negative'
            ? 'bg-red-500'
            : 'bg-blue-500'
        }`}
        style={{ 
          width: change !== undefined && change !== null 
            ? `${Math.min(Math.abs(change), 100)}%`
            : '50%' // Заполнение по умолчанию
        }}
      ></div>
    </div>
  </div>
)

export default function StatsCards({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="p-4 rounded-2xl bg-gray-200">
                <div className="h-6 w-6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const { totals, periodStats, financial } = stats

  // Функция для определения типа изменения
  const getChangeType = (change) => {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
  }

  // Функция для безопасного получения значения роста
  const getSafeChange = (changeValue, defaultValue = 0) => {
    return changeValue !== undefined && changeValue !== null ? changeValue : defaultValue
  }

  const statCards = [
    {
      title: 'Всего пользователей',
      value: totals?.users?.toLocaleString() || '1',
      icon: Users,
      change: getSafeChange(periodStats?.userGrowth, 0),
      changeType: getChangeType(getSafeChange(periodStats?.userGrowth, 0)),
      delay: 0
    },
    {
      title: 'Всего товаров',
      value: totals?.products?.toLocaleString() || '0',
      icon: Package,
      change: getSafeChange(periodStats?.productsGrowth, 0),
      changeType: getChangeType(getSafeChange(periodStats?.productsGrowth, 0)),
      delay: 0.1
    },
    {
      title: 'Всего заказов',
      value: totals?.orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: getSafeChange(periodStats?.ordersGrowth, 0),
      changeType: getChangeType(getSafeChange(periodStats?.ordersGrowth, 0)),
      delay: 0.2
    },
    {
      title: 'Заказов сегодня',
      value: periodStats?.today?.toLocaleString() || '0',
      icon: ShoppingCart,
      change: getSafeChange(periodStats?.todayVsYesterday, 0),
      changeType: getChangeType(getSafeChange(periodStats?.todayVsYesterday, 0)),
      delay: 0.3
    },
    {
      title: 'Активных поваров',
      value: totals?.activeChefs?.toLocaleString() || '0',
      icon: ChefHat,
      change: getSafeChange(periodStats?.chefsGrowth, 0),
      changeType: getChangeType(getSafeChange(periodStats?.chefsGrowth, 0)),
      delay: 0.4
    },
    {
      title: 'Общая выручка',
      value: `₽${(financial?.totalRevenue || 0)?.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      change: getSafeChange(periodStats?.revenueGrowth, 0),
      changeType: getChangeType(getSafeChange(periodStats?.revenueGrowth, 0)),
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