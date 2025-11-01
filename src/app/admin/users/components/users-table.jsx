// app/admin/users/components/users-table.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import UserStatus from './user-status'
import DeleteUserModal from './DeleteUserModal'
import { 
  AnimatedTableContainer,
  AnimatedTableRow,
  TableActionButton,
  SubtleHover // Добавьте этот импорт
} from '../../Components/animation-component' // Обновите путь

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
    window.location.reload()
  }

  const getInitials = (user) => {
    return user.firstName?.charAt(0) || user.email.charAt(0)
  }

  const getAvatarColor = (user) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-indigo-500'
    ]
    const index = user.id % colors.length
    return colors[index]
  }

  return (
    <>
      <AnimatedTableContainer
        delay={100}
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
      >
        {/* Заголовок таблицы */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SubtleHover className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </SubtleHover>
              <h3 className="text-lg font-semibold text-gray-900">
                Список пользователей
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Всего: <span className="text-blue-600 font-semibold">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Таблица */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статистика
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <AnimatedTableRow
                  key={user.id}
                  index={index}
                  delay={100}
                  className="group hover:bg-gray-50"
                >
                  {/* Пользователь */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <SubtleHover>
                        <div className={`w-10 h-10 ${getAvatarColor(user)} rounded-lg flex items-center justify-center text-white font-medium shadow-sm`}>
                          {getInitials(user)}
                        </div>
                      </SubtleHover>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName || 'Не указано'}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Контакты */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>

                  {/* Статус */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UserStatus user={user} />
                  </td>

                  {/* Статистика */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {user._count?.orders || 0} зак.
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {user._count?.reviews || 0} отз.
                      </span>
                      {user.chefProfile && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Повар
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Действия */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Просмотр
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                      >
                        Редакт.
                      </Link>
                      <TableActionButton
                        variant="danger"
                        onClick={() => openDeleteModal(user)}
                      >
                        Удалить
                      </TableActionButton>
                    </div>
                  </td>
                </AnimatedTableRow>
              ))}
            </tbody>
          </table>
        </div>

        {/* Сообщение о пустой таблице */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
            <p className="text-gray-500 text-sm">
              Попробуйте изменить параметры фильтрации или поиска
            </p>
          </div>
        )}
      </AnimatedTableContainer>

      {/* Модальное окно удаления */}
      <DeleteUserModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}