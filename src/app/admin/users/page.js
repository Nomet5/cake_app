// app/admin/users/page.tsx
import { getUsers, deleteUser } from '@/lib/actions'
import { UserTable } from '@/components/UserTable'
import { UserFilters } from '@/components/UserFilters'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    search?: string; 
  }
}) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  
  const result = await getUsers(page, 20, search)

  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Ошибка: {result.error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Пользователи</h1>
          <p className="text-gray-600 mt-2">
            Управление пользователями платформы
          </p>
        </div>
        <a
          href="/admin/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          <span>Добавить пользователя</span>
        </a>
      </div>

      {/* Фильтры и поиск */}
      <UserFilters search={search} />

      {/* Таблица пользователей */}
      <UserTable 
        users={result.users} 
        pagination={result.pagination}
        currentPage={page}
      />
    </div>
  )
}