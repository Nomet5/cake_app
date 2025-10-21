// components/UserTable.tsx
'use client'

import { deleteUser } from '../../lib/actions/user.actions'
import { adminPagination } from '../adminComponents/adminPagination'

export function UserTable({ 
  users, 
  pagination,
  currentPage 
}: { 
  users: any[]
  pagination: any
  currentPage: number
}) {
  const handleDelete = async (userId: number, userEmail: string) => {
    if (confirm(`Вы уверены, что хотите удалить пользователя ${userEmail}?`)) {
      const result = await deleteUser(userId)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Пагинация сверху */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-b border-gray-200">
          <adminPagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            basePath="/admin/users"
            searchParams={pagination.searchParams}
          />
        </div>
      )}

      {/* Таблица */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Пользователь
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Контакты
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Статистика
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Дата регистрации
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName}
                  </div>
                  <div className="text-sm text-gray-500">ID: {user.id}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.phone || '—'}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div>Заказы: {user._count.orders}</div>
                <div>Отзывы: {user._count.reviews}</div>
                <div>Адреса: {user._count.addresses}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </td>
              <td className="px-6 py-4 text-sm font-medium space-x-2">
                <a
                  href={`/admin/users/${user.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Просмотр
                </a>
                <a
                  href={`/admin/users/${user.id}/edit`}
                  className="text-green-600 hover:text-green-900"
                >
                  Редакт.
                </a>
                <button
                  onClick={() => handleDelete(user.id, user.email)}
                  className="text-red-600 hover:text-red-900"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Сообщение если нет пользователей */}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Пользователи не найдены
        </div>
      )}

      {/* Пагинация снизу */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <adminPagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            basePath="/admin/users"
            searchParams={pagination.searchParams}
          />
        </div>
      )}
    </div>
  )
}