// src/app/admin/page.js
import { getAdminDashboardStats } from '../lib/actions/admin_Statistick.actions'
import StatCard from './Components/StatisticCard'

export default async function AdminPage() {
  const statsResult = await getAdminDashboardStats()

  if (!statsResult.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Ошибка</h2>
          <p className="text-red-600">{statsResult.error}</p>
        </div>
      </div>
    )
  }

  const { stats } = statsResult

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Админ панель - Обзор</h1>
      
      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Пользователи" 
          value={stats.totals.users} 
          icon="👥"
          color="blue"
        />
        <StatCard 
          title="Товары" 
          value={stats.totals.products} 
          icon="🍰"
          color="green"
        />
        <StatCard 
          title="Заказы" 
          value={stats.totals.orders} 
          icon="📦"
          color="purple"
        />
        <StatCard 
          title="Повара" 
          value={stats.totals.chefs} 
          icon="👨‍🍳"
          color="orange"
        />
        <StatCard 
          title="Категории" 
          value={stats.totals.categories} 
          icon="📑"
          color="yellow"
        />
        <StatCard 
          title="Отзывы" 
          value={stats.totals.reviews} 
          icon="⭐"
          color="pink"
        />
        <StatCard 
          title="Адреса" 
          value={stats.totals.addresses} 
          icon="📍"
          color="red"
        />
      </div>

      {/* Финансовая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Финансы</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Общая выручка:</span>
              <span className="text-xl font-bold text-green-600">
                {stats.financial.totalRevenue.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Субтотал:</span>
              <span className="text-lg font-semibold text-blue-600">
                {stats.financial.totalSubtotal.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Доставка:</span>
              <span className="text-lg font-semibold text-orange-600">
                {stats.financial.totalDeliveryFee.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Средний чек:</span>
              <span className="text-lg font-semibold text-purple-600">
                {Math.round(stats.financial.averageOrderValue).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Статусы заказов */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Статусы заказов</h3>
          <div className="space-y-2">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{status}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Статусы платежей */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Статусы платежей</h3>
          <div className="space-y-2">
            {Object.entries(stats.paymentsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{status}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Дополнительные секции */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Последние пользователи */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Последние пользователи</h3>
          </div>
          <div className="p-4">
            {stats.recent.users.length > 0 ? (
              <div className="space-y-3">
                {stats.recent.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.firstName || 'Без имени'}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">Пользователей пока нет</p>
            )}
          </div>
        </div>

        {/* Последние заказы */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Последние заказы</h3>
          </div>
          <div className="p-4">
            {stats.recent.orders.length > 0 ? (
              <div className="space-y-3">
                {stats.recent.orders.map((order) => (
                  <div key={order.id} className="p-2 border rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">#{order.orderNumber}</span>
                      <span className="text-sm font-semibold">{order.totalAmount} ₽</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p className="truncate">Клиент: {order.user?.firstName || order.user?.email}</p>
                      <p>Дата: {new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">Заказов пока нет</p>
            )}
          </div>
        </div>

        {/* Популярные категории */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Популярные категории</h3>
          </div>
          <div className="p-4">
            {stats.analytics.popularCategories.length > 0 ? (
              <div className="space-y-2">
                {stats.analytics.popularCategories.map((category) => (
                  <div key={category.id} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium text-sm">{category.name}</span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                      {category._count.products}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">Категорий пока нет</p>
            )}
          </div>
        </div>

        {/* Лучшие повара */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Лучшие повара</h3>
          </div>
          <div className="p-4">
            {stats.analytics.topChefs.length > 0 ? (
              <div className="space-y-2">
                {stats.analytics.topChefs.map((chef) => (
                  <div key={chef.id} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium text-sm">{chef.user?.firstName || 'Повар'}</span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                      {chef._count.orders} зак.
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">Поваров пока нет</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}