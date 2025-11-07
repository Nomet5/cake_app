// app/admin/chefs/page.jsx
import { getChefs, getChefStats } from "../../actions/admin/chef.actions"
import ChefsTable from "./components/chefs-table"
import SearchFilters from "./components/search-filters"
import StatsOverview from "./components/stats-overview"
import CreateChefButton from "./components/create-chef-button"

export default async function AdminChefsPage({ searchParams }) {
  const { 
    page = 1, 
    search = '', 
    status = '',
    specialization = '',
    sort = 'name'
  } = searchParams || {}

  console.log('Search params:', { search, status, specialization, sort, page })

  // Получаем данные поваров с фильтрами
  const [chefsResult, stats] = await Promise.all([
    getChefs({
      search,
      status,
      specialization,
      sort,
      page: parseInt(page),
      limit: 10
    }),
    getChefStats()
  ])

  console.log('Chefs result:', chefsResult)

  // Обрабатываем результат
  const chefs = chefsResult.success ? chefsResult.chefs : []
  const pagination = chefsResult.success ? chefsResult.pagination : null
  const error = chefsResult.error

  // Статистика для админ-панели
  const adminStats = {
    total: pagination?.totalItems || 0,
    active: stats?.active || 0,
    verified: stats?.verified || 0,
    newChefsThisMonth: 0,
    chefsWithOrders: chefs.filter(chef => chef._count?.orders > 0).length,
    activeChefsWithProducts: chefs.filter(chef => chef.isActive && chef._count?.products > 0).length,
    orderCompletionRate: chefs.length > 0 ? 
      Math.round((chefs.filter(chef => chef._count?.orders > 0).length / chefs.length) * 100) : 0
  }

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок и действия */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление поварами</h1>
          <p className="text-gray-600">
            Всего поваров: {adminStats.total} • Активных: {adminStats.active} • Верифицировано: {adminStats.verified}
          </p>
        </div>
        <CreateChefButton />
      </div>

      {/* Общая статистика */}
      <StatsOverview stats={adminStats} />

      {/* Фильтры */}
      <SearchFilters
        searchParams={searchParams}
        totalResults={pagination?.totalItems || 0}
      />

      {/* Сообщение об ошибке */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Таблица поваров */}
      <ChefsTable 
        chefs={chefs}
        currentSort={sort} 
        pagination={pagination}
        searchParams={searchParams}
      />

      {/* Информация о результате */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Показано {chefs.length} из {pagination?.totalItems || 0} поваров
        </div>
        {pagination && (
          <div className="text-xs">
            Страница {pagination.currentPage} из {pagination.totalPages}
          </div>
        )}
      </div>
    </div>
  )
}