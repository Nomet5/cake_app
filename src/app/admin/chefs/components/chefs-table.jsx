'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toggleChefActive, verifyChef, deleteChef } from "../../../actions/admin/chef.actions"

export default function ChefsTable({ chefs, currentSort }) {
  const router = useRouter()

  const handleToggleActive = async (chefId, currentStatus) => {
    if (confirm(`Вы уверены, что хотите ${currentStatus ? 'деактивировать' : 'активировать'} повара?`)) {
      const result = await toggleChefActive(chefId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    }
  }

  const handleVerify = async (chefId) => {
    if (confirm('Вы уверены, что хотите верифицировать повара?')) {
      const result = await verifyChef(chefId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    }
  }

  const handleDelete = async (chefId, chefName) => {
    if (confirm(`Вы уверены, что хотите удалить повара "${chefName}"?`)) {
      const result = await deleteChef(chefId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    }
  }

  if (chefs.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Повары не найдены</h3>
        <p className="mt-2 text-gray-500">
          Попробуйте изменить параметры поиска или фильтры
        </p>
        <Link
          href="/admin/chefs/create"
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить первого повара
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Заголовок таблицы */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Список поваров</h3>
          <span className="text-sm text-gray-500">
            {chefs.length} всего
          </span>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Повар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Опыт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистика
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chefs.map((chef) => (
              <tr key={chef.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {chef.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {chef.id}
                      </div>
                      {chef.description && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {chef.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{chef.user?.email}</div>
                  <div className="text-sm text-gray-500">{chef.user?.firstName}</div>
                  <div className="text-sm text-gray-400">{chef.user?.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {chef.yearsOfExperience ? `${chef.yearsOfExperience} лет` : 'Не указано'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="w-20">Товары:</span>
                      <span className="font-medium">{chef._count?.products || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20">Заказы:</span>
                      <span className="font-medium">{chef._count?.orders || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-20">Отзывы:</span>
                      <span className="font-medium">{chef._count?.reviews || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      chef.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {chef.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      chef.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {chef.isVerified ? 'Верифицирован' : 'Не верифицирован'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/chefs/${chef.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                      title="Просмотреть профиль"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/admin/chefs/${chef.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded hover:bg-indigo-50"
                      title="Редактировать"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleToggleActive(chef.id, chef.isActive)}
                      className={`p-1 rounded transition-colors ${
                        chef.isActive 
                          ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50' 
                          : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                      }`}
                      title={chef.isActive ? 'Деактивировать' : 'Активировать'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    {!chef.isVerified && (
                      <button
                        onClick={() => handleVerify(chef.id)}
                        className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded hover:bg-purple-50"
                        title="Верифицировать"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(chef.id, chef.businessName)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                      title="Удалить"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}