// src/app/admin/Components/admin/dashboard/charts-section.jsx
'use client'

import { BarChart3, PieChart } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ChartContainer = ({ title, description, icon: Icon, children, delay = 0 }) => (
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
    <div className="h-64">
      {children}
    </div>
  </div>
)

const EmptyState = ({ message }) => (
  <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-200">
    <div className="text-center text-gray-500">
      <p className="text-sm">{message}</p>
    </div>
  </div>
)

export default function ChartsSection({ stats }) {
  // Используем только реальные данные из базы
  if (!stats) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Подготовка данных для графика выручки по дням
  const revenueChartData = {
    labels: stats.charts?.revenueByDay?.map(item => {
      const date = new Date(item.date)
      return `${date.getDate()}.${date.getMonth() + 1}`
    }) || [],
    datasets: [
      {
        label: 'Выручка (₽)',
        data: stats.charts?.revenueByDay?.map(item => item.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '₽' + value.toLocaleString()
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Данные для круговой диаграммы статусов заказов
  const orderStatusData = {
    labels: ['Доставлено', 'Подтверждено', 'В приготовлении', 'Готово', 'Ожидание', 'Отменено'],
    datasets: [
      {
        data: [
          stats.ordersByStatus?.DELIVERED || 0,
          stats.ordersByStatus?.CONFIRMED || 0,
          stats.ordersByStatus?.PREPARING || 0,
          stats.ordersByStatus?.READY || 0,
          stats.ordersByStatus?.PENDING || 0,
          stats.ordersByStatus?.CANCELLED || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Доставлено - зеленый
          'rgba(59, 130, 246, 0.8)',   // Подтверждено - синий
          'rgba(245, 158, 11, 0.8)',   // В приготовлении - оранжевый
          'rgba(168, 85, 247, 0.8)',   // Готово - фиолетовый
          'rgba(156, 163, 175, 0.8)',  // Ожидание - серый
          'rgba(239, 68, 68, 0.8)',    // Отменено - красный
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(156, 163, 175, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const orderStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  // Данные для графика популярных категорий
  const categoriesData = {
    labels: stats.analytics?.popularCategories?.map(cat => cat.name) || [],
    datasets: [
      {
        label: 'Количество товаров',
        data: stats.analytics?.popularCategories?.map(cat => cat._count?.products) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const categoriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Данные для графика заказов по дням
  const ordersChartData = {
    labels: stats.charts?.ordersByDay?.map(item => {
      const date = new Date(item.date)
      return `${date.getDate()}.${date.getMonth() + 1}`
    }) || [],
    datasets: [
      {
        label: 'Количество заказов',
        data: stats.charts?.ordersByDay?.map(item => item.orders) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const ordersOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const hasRevenueData = stats.charts?.revenueByDay?.length > 0
  const hasOrdersData = stats.charts?.ordersByDay?.length > 0
  const hasOrderStatusData = Object.values(stats.ordersByStatus || {}).some(value => value > 0)
  const hasCategoriesData = stats.analytics?.popularCategories?.length > 0
  const hasTopChefsData = stats.analytics?.topChefs?.length > 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Первая строка - основные графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Выручка по дням"
          description="Динамика выручки за последние 30 дней"
          icon={BarChart3}
          delay={0}
        >
          {hasRevenueData ? (
            <Bar data={revenueChartData} options={revenueOptions} />
          ) : (
            <EmptyState message="Нет данных о выручке за последние 30 дней" />
          )}
        </ChartContainer>
        
        <ChartContainer
          title="Статусы заказов"
          description="Распределение заказов по статусам"
          icon={PieChart}
          delay={0.1}
        >
          {hasOrderStatusData ? (
            <Pie data={orderStatusData} options={orderStatusOptions} />
          ) : (
            <EmptyState message="Нет данных о статусах заказов" />
          )}
        </ChartContainer>
      </div>

      {/* Вторая строка - дополнительные графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Популярные категории"
          description="Распределение товаров по категориям"
          icon={BarChart3}
          delay={0.2}
        >
          {hasCategoriesData ? (
            <Bar data={categoriesData} options={categoriesOptions} />
          ) : (
            <EmptyState message="Нет данных о категориях" />
          )}
        </ChartContainer>
        
        <ChartContainer
          title="Заказы по дням"
          description="Динамика заказов за последние 30 дней"
          icon={BarChart3}
          delay={0.3}
        >
          {hasOrdersData ? (
            <Bar data={ordersChartData} options={ordersOptions} />
          ) : (
            <EmptyState message="Нет данных о заказах за последние 30 дней" />
          )}
        </ChartContainer>
      </div>
      
      {/* Третья строка - топ повара */}
      <div className="grid grid-cols-1 gap-6">
        <ChartContainer
          title="Топ повара"
          description="Повара по количеству заказов"
          icon={PieChart}
          delay={0.4}
        >
          {hasTopChefsData ? (
            <div className="h-64 flex flex-col justify-center">
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {stats.analytics.topChefs.map((chef, index) => (
                  <div key={chef.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate" title={chef.businessName}>
                          {chef.businessName}
                        </p>
                        <p className="text-sm text-gray-500 truncate" title={chef.user?.firstName}>
                          {chef.user?.firstName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-bold text-gray-900 whitespace-nowrap">
                        {chef._count?.orders || 0} зак.
                      </p>
                      <p className="text-sm text-gray-500 whitespace-nowrap">
                        {chef._count?.products || 0} товар.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="Нет данных о поварах" />
          )}
        </ChartContainer>
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Средний чек
          </h4>
          <p className="text-2xl font-bold text-green-600">
            ₽{Math.round(stats.financial?.averageOrderValue || 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Активные товары
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totals?.activeProducts?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover-lift transition-all duration-300">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Верифицированные повара
          </h4>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totals?.verifiedChefs?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  )
}