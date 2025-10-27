// app/admin/users/components/users-table.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import UserStatus from './user-status'
import DeleteUserModal from './DeleteUserModal'

export default function UsersTable({ users }) {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null
  })

  const openDeleteModal = (user) => {
    setDeleteModal({
      isOpen: true,
      user
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      user: null
    })
  }

  const handleDeleteSuccess = () => {
    // Перезагружаем страницу после успешного удаления
    window.location.reload()
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Контакты</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статистика</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user.firstName?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">
                        {user.firstName || 'Не указано'}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                </td>
                <td className="px-6 py-4">
                  <UserStatus user={user} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Заказы: {user._count?.orders || 0} | Отзывы: {user._count?.reviews || 0}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Link 
                      href={`/admin/users/${user.id}`} 
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Просмотр
                    </Link>
                    <Link 
                      href={`/admin/users/${user.id}/edit`} 
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Пользователи не найдены</p>
          </div>
        )}
      </div>

      <DeleteUserModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}