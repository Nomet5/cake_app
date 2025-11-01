// app/admin/chefs/components/chefs-table.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  bulkUpdateChefs, 
  updateChefStatus,
  verifyChef 
} from "../../../actions/admin/chef.actions"
import { AnimatedTableRow, TableActionButton } from "../../Components/animation-component"

export default function ChefsTable({ chefs, currentSort, pagination }) {
  const router = useRouter()
  const [selectedChefs, setSelectedChefs] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSelectChef = (chefId) => {
    const newSelected = new Set(selectedChefs)
    if (newSelected.has(chefId)) {
      newSelected.delete(chefId)
    } else {
      newSelected.add(chefId)
    }
    setSelectedChefs(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedChefs.size === chefs.length) {
      setSelectedChefs(new Set())
    } else {
      setSelectedChefs(new Set(chefs.map(chef => chef.id)))
    }
  }

  const handleBulkOperation = async (operation) => {
    if (selectedChefs.size === 0) return

    try {
      setLoading(true)
      setError('')
      
      const chefIds = Array.from(selectedChefs)
      let result

      switch (operation) {
        case 'activate':
          result = await bulkUpdateChefs(chefIds, true)
          break
        case 'deactivate':
          result = await bulkUpdateChefs(chefIds, false)
          break
        case 'verify':
          // Для массовой верификации нужно вызвать verify для каждого повара
          const results = await Promise.all(
            chefIds.map(id => verifyChef(id))
          )
          const successful = results.filter(r => r.success).length
          result = { 
            success: true, 
            message: `Верифицировано ${successful} из ${chefIds.length} поваров`,
            updatedCount: successful
          }
          break
        default:
          result = { error: 'Неизвестная операция' }
      }
      
      if (result.success) {
        setSelectedChefs(new Set())
        // Обновляем страницу для отображения изменений
        router.refresh()
      } else {
        setError(result.error || 'Ошибка выполнения операции')
      }
    } catch (err) {
      setError('Произошла ошибка при выполнении операции')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = async (chefId, currentStatus) => {
    try {
      setLoading(true)
      const result = await updateChefStatus(chefId, !currentStatus)
      
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Ошибка изменения статуса')
      }
    } catch (err) {
      setError('Произошла ошибка при изменении статуса')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyChef = async (chefId) => {
    try {
      setLoading(true)
      const result = await verifyChef(chefId)
      
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Ошибка верификации')
      }
    } catch (err) {
      setError('Произошла ошибка при верификации')
    } finally {
      setLoading(false)
    }
  }

  const handleChefClick = (chefId) => {
    router.push(`/admin/chefs/${chefId}`)
  }

  const getStatusBadge = (chef) => {
    if (chef.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
          Активен
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1"></span>
          Неактивен
        </span>
      )
    }
  }

  const getVerificationBadge = (chef) => {
    if (chef.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Верифицирован
        </span>
      )
    }
    return null
  }

  if (chefs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Повары не найдены</h3>
        <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтрации</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Массовые операции */}
      {selectedChefs.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">
                Выбрано поваров: {selectedChefs.size}
              </span>
            </div>
            <div className="flex space-x-2">
              <TableActionButton
                onClick={() => handleBulkOperation('activate')}
                variant="success"
                disabled={loading}
              >
                Активировать
              </TableActionButton>
              <TableActionButton
                onClick={() => handleBulkOperation('deactivate')}
                variant="secondary"
                disabled={loading}
              >
                Деактивировать
              </TableActionButton>
              <TableActionButton
                onClick={() => handleBulkOperation('verify')}
                variant="primary"
                disabled={loading}
              >
                Верифицировать
              </TableActionButton>
            </div>
          </div>
        </div>
      )}

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

      {/* Таблица */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedChefs.size === chefs.length && chefs.length > 0}
                  onChange={handleSelectAll}
                  disabled={loading}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Повар
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистика
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Действия</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chefs.map((chef, index) => (
              <AnimatedTableRow 
                key={chef.id} 
                index={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedChefs.has(chef.id)}
                    onChange={() => handleSelectChef(chef.id)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={loading}
                  />
                </td>
                <td 
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleChefClick(chef.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {chef.businessName?.charAt(0) || 'П'}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {chef.businessName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {chef.user?.email}
                      </div>
                      {chef.specialty && (
                        <div className="text-xs text-gray-400 mt-1">
                          {chef.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    {getStatusBadge(chef)}
                    {getVerificationBadge(chef)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      Товаров: {chef._count?.products || 0}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Заказов: {chef._count?.orders || 0}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(chef.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <TableActionButton
                      onClick={() => handleChefClick(chef.id)}
                      variant="primary"
                    >
                      Просмотр
                    </TableActionButton>
                    <TableActionButton
                      onClick={() => handleStatusToggle(chef.id, chef.isActive)}
                      variant={chef.isActive ? "secondary" : "success"}
                      disabled={loading}
                    >
                      {chef.isActive ? 'Деактивировать' : 'Активировать'}
                    </TableActionButton>
                    {!chef.isVerified && (
                      <TableActionButton
                        onClick={() => handleVerifyChef(chef.id)}
                        variant="success"
                        disabled={loading}
                      >
                        Верифицировать
                      </TableActionButton>
                    )}
                  </div>
                </td>
              </AnimatedTableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}