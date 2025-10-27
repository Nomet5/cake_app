import { getChefs, getChefStats } from "../../actions/admin/chef.actions"
import ChefsTable from "./components/chefs-table"
import ChefActions from "./create/components/chef-actions"
import SearchFilters from "./components/search-filters"
import StatsOverview from "./components/stats-overview"

export default async function AdminChefsPage({ searchParams }) {
  const { 
    page = 1, 
    search = '', 
    status = '',
    specialization = '',
    sort = 'name'
  } = searchParams

  // Получаем данные поваров и статистику
  const [chefs, stats] = await Promise.all([
    getChefs(),
    getChefStats()
  ])

  // Проверяем, что chefs - массив
  const chefsArray = Array.isArray(chefs) ? chefs : []

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок и действия */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление поварами</h1>
          <p className="text-gray-600">
            Всего поваров: {stats.total}
          </p>
        </div>
        <ChefActions />
      </div>

      {/* Общая статистика */}
      <StatsOverview stats={stats} />

      {/* Поиск и фильтры */}
      <SearchFilters 
        searchParams={searchParams}
        totalResults={chefsArray.length}
      />

      {/* Таблица поваров */}
      <ChefsTable 
        chefs={chefsArray}
        currentSort={sort}
      />

      {/* Информация о результате */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Показано {chefsArray.length} поваров
        </div>
      </div>
    </div>
  )
}