// app/admin/chefs/components/chefs-table.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  bulkUpdateChefs, 
  updateChefStatus,
  verifyChef 
} from "../../../actions/admin/chef.actions"

export default function ChefsTable({ chefs, currentSort, pagination, searchParams }) {
  const router = useRouter()
  const params = useSearchParams()
  const [selectedChefs, setSelectedChefs] = useState(new Set())
  const [loadingStates, setLoadingStates] = useState({})
  const [error, setError] = useState('')
  const [currentFilters, setCurrentFilters] = useState({})

  // Обновляем текущие фильтры при изменении searchParams
  useEffect(() => {
    const filters = {
      search: params?.get('search') || '',
      status: params?.get('status') || '',
      specialization: params?.get('specialization') || '',
      sort: params?.get('sort') || 'name'
    }
    setCurrentFilters(filters)
  }, [params])

  // Сбрасываем выделение при изменении фильтров
  useEffect(() => {
    setSelectedChefs(new Set())
  }, [currentFilters])

  // Остальные функции остаются без изменений...
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
        router.refresh()
      } else {
        setError(result.error || 'Ошибка выполнения операции')
      }
    } catch (err) {
      setError('Произошла ошибка при выполнении операции')
    }
  }

  // Остальные функции без изменений...
  const handleStatusToggle = async (chefId, currentStatus) => {
    try {
      setLoadingStates(prev => ({ ...prev, [chefId]: true }))
      setError('')
      
      const result = await updateChefStatus(chefId, !currentStatus)
      
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Ошибка изменения статуса')
      }
    } catch (err) {
      setError('Произошла ошибка при изменении статуса')
    } finally {
      setLoadingStates(prev => ({ ...prev, [chefId]: false }))
    }
  }

  const handleVerifyChef = async (chefId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [`verify_${chefId}`]: true }))
      setError('')
      
      const result = await verifyChef(chefId)
      
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Ошибка верификации')
      }
    } catch (err) {
      setError('Произошла ошибка при верификации')
    } finally {
      setLoadingStates(prev => ({ ...prev, [`verify_${chefId}`]: false }))
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

  // Получить текст для пустого состояния в зависимости от фильтров
  const getEmptyStateMessage = () => {
    const { search, status, specialization } = currentFilters

    if (search && status && specialization) {
      return `Не найдено поваров с поиском "${search}", статусом "${getStatusLabel(status)}" и специализацией "${specialization}"`
    } else if (search && status) {
      return `Не найдено поваров с поиском "${search}" и статусом "${getStatusLabel(status)}"`
    } else if (search && specialization) {
      return `Не найдено поваров с поиском "${search}" и специализацией "${specialization}"`
    } else if (status && specialization) {
      return `Не найдено поваров со статусом "${getStatusLabel(status)}" и специализацией "${specialization}"`
    } else if (search) {
      return `Не найдено поваров с поиском "${search}"`
    } else if (status) {
      return `Не найдено поваров со статусом "${getStatusLabel(status)}"`
    } else if (specialization) {
      return `Не найдено поваров со специализацией "${specialization}"`
    }
    
    return 'Повары не найдены'
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'Активен',
      inactive: 'Неактивен',
      pending: 'На проверке',
      verified: 'Верифицирован'
    }
    return statusLabels[status] || status
  }

  // Простые кнопки действий
  const ActionButton = ({ onClick, children, variant = 'primary', disabled = false }) => {
    const baseClasses = "px-3 py-1 text-sm rounded-lg transition-colors duration-200"
    const variantClasses = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      success: "bg-green-500 text-white hover:bg-green-600",
      danger: "bg-red-500 text-white hover:bg-red-600"
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    )
  }

  // Информация о текущих фильтрах
  const hasActiveFilters = currentFilters.search || currentFilters.status || currentFilters.specialization

  if (chefs.length === 0) {
    return (
      <div className="space-y-4">
        {/* Информация о текущих фильтрах */}
        {hasActiveFilters && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium text-yellow-800">Активные фильтры</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  {currentFilters.search && `Поиск: "${currentFilters.search}"`}
                  {currentFilters.status && ` • Статус: ${getStatusLabel(currentFilters.status)}`}
                  {currentFilters.specialization && ` • Специализация: ${currentFilters.specialization}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Сообщение о пустом состоянии */}
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getEmptyStateMessage()}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters 
              ? 'Попробуйте изменить параметры фильтрации' 
              : 'В системе пока нет зарегистрированных поваров'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => router.push('/admin/chefs')}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Информация о результатах */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">
              Найдено <span className="font-semibold text-gray-900">{pagination?.totalItems || chefs.length}</span> поваров
              {currentFilters.status && (
                <span className="ml-2">
                  со статусом <span className="font-semibold text-gray-900">{getStatusLabel(currentFilters.status)}</span>
                </span>
              )}
              {currentFilters.specialization && (
                <span className="ml-2">
                  со специализацией <span className="font-semibold text-gray-900">"{currentFilters.specialization}"</span>
                </span>
              )}
            </span>
          </div>
          
          {pagination && (
            <div className="text-sm text-gray-500">
              Страница <span className="font-semibold">{pagination.currentPage}</span> из <span className="font-semibold">{pagination.totalPages}</span>
            </div>
          )}
        </div>
      </div>

      {/* Массовые операции */}
      {selectedChefs.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">
                Выбрано поваров: {selectedChefs.size}
              </span>
            </div>
            <div className="flex space-x-2">
              <ActionButton
                onClick={() => handleBulkOperation('activate')}
                variant="success"
              >
                Активировать
              </ActionButton>
              <ActionButton
                onClick={() => handleBulkOperation('deactivate')}
                variant="secondary"
              >
                Деактивировать
              </ActionButton>
              <ActionButton
                onClick={() => handleBulkOperation('verify')}
                variant="primary"
              >
                Верифицировать
              </ActionButton>
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
            {chefs.map((chef) => (
              <tr key={chef.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedChefs.has(chef.id)}
                    onChange={() => handleSelectChef(chef.id)}
                    onClick={(e) => e.stopPropagation()}
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
                  <div className="space-y-2 flex flex-col">
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
                    <ActionButton
                      onClick={() => handleChefClick(chef.id)}
                      variant="primary"
                    >
                      Просмотр
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleStatusToggle(chef.id, chef.isActive)}
                      variant={chef.isActive ? "secondary" : "success"}
                      disabled={loadingStates[chef.id]}
                    >
                      {loadingStates[chef.id] ? '...' : chef.isActive ? 'Деактивировать' : 'Активировать'}
                    </ActionButton>
                    {!chef.isVerified && (
                      <ActionButton
                        onClick={() => handleVerifyChef(chef.id)}
                        variant="success"
                        disabled={loadingStates[`verify_${chef.id}`]}
                      >
                        {loadingStates[`verify_${chef.id}`] ? '...' : 'Верифицировать'}
                      </ActionButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">
            Показано {chefs.length} из {pagination.totalItems} поваров
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(params?.toString() || '')
                params.set('page', (pagination.currentPage - 1).toString())
                router.push(`/admin/chefs?${params.toString()}`)
              }}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Назад
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => {
                const params = new URLSearchParams(params?.toString() || '')
                params.set('page', (pagination.currentPage + 1).toString())
                router.push(`/admin/chefs?${params.toString()}`)
              }}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  )
}