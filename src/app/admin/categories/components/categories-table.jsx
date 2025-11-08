// app/admin/categories/components/categories-table.jsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { bulkUpdateCategories, updateCategoryStatus } from "../../../actions/admin/category.actions"
import CategoryStatus from './category-status'


export default function CategoriesTable({ categories, currentSort, pagination, searchParams }) {
  const router = useRouter()
  const params = useSearchParams()
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [loadingStates, setLoadingStates] = useState({})
  const [error, setError] = useState('')
  const [currentFilters, setCurrentFilters] = useState({})

  // Обновляем текущие фильтры при изменении searchParams
  useEffect(() => {
    const filters = {
      search: params?.get('search') || '',
      status: params?.get('status') || '',
      sort: params?.get('sort') || 'name'
    }
    setCurrentFilters(filters)
  }, [params])

  // Сбрасываем выделение при изменении фильтров
  useEffect(() => {
    setSelectedCategories(new Set())
  }, [currentFilters])

  const handleSelectCategory = (categoryId) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set())
    } else {
      setSelectedCategories(new Set(categories.map(category => category.id)))
    }
  }

  const handleBulkOperation = async (operation) => {
    if (selectedCategories.size === 0) return

    try {
      setError('')
      
      const categoryIds = Array.from(selectedCategories)
      let result

      switch (operation) {
        case 'activate':
          result = await bulkUpdateCategories(categoryIds, true)
          break
        case 'deactivate':
          result = await bulkUpdateCategories(categoryIds, false)
          break
        default:
          result = { error: 'Неизвестная операция' }
      }
      
      if (result.success) {
        setSelectedCategories(new Set())
        router.refresh()
      } else {
        setError(result.error || 'Ошибка выполнения операции')
      }
    } catch (err) {
      setError('Произошла ошибка при выполнении операции')
    }
  }

  const handleStatusToggle = async (categoryId, currentStatus) => {
    try {
      setLoadingStates(prev => ({ ...prev, [categoryId]: true }))
      setError('')
      
      const result = await updateCategoryStatus(categoryId, !currentStatus)
      
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'Ошибка изменения статуса')
      }
    } catch (err) {
      setError('Произошла ошибка при изменении статуса')
    } finally {
      setLoadingStates(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  const handleCategoryClick = (categoryId) => {
    router.push(`/admin/categories/${categoryId}`)
  }

  // Получить текст для пустого состояния в зависимости от фильтров
  const getEmptyStateMessage = () => {
    const { search, status } = currentFilters

    if (search && status) {
      return `Не найдено категорий с поиском "${search}" и статусом "${getStatusLabel(status)}"`
    } else if (search) {
      return `Не найдено категорий с поиском "${search}"`
    } else if (status) {
      return `Не найдено категорий со статусом "${getStatusLabel(status)}"`
    }
    
    return 'Категории не найдены'
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'Активна',
      inactive: 'Неактивна'
    }
    return statusLabels[status] || status
  }

  // Функция для отображения названий товаров
  const renderProductNames = (category) => {
    if (!category.products || category.products.length === 0) {
      return (
        <span className="text-sm text-gray-400 italic">Нет товаров</span>
      )
    }

    // Показываем первые 3 товара + счетчик остальных
    const visibleProducts = category.products.slice(0, 3)
    const remainingCount = category.products.length - 3

    return (
      <div className="space-y-1">
        {visibleProducts.map((product) => (
          <div key={product.id} className="flex items-center text-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            <span className="text-gray-700 truncate max-w-[200px]" title={product.name}>
              {product.name}
            </span>
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 ml-4">
            +{remainingCount} еще...
          </div>
        )}
      </div>
    )
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
  const hasActiveFilters = currentFilters.search || currentFilters.status

  if (categories.length === 0) {
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
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Сообщение о пустом состоянии */}
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getEmptyStateMessage()}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters 
              ? 'Попробуйте изменить параметры фильтрации' 
              : 'В системе пока нет категорий'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => router.push('/admin/categories')}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
              Найдено <span className="font-semibold text-gray-900">{pagination?.totalItems || categories.length}</span> категорий
              {currentFilters.status && (
                <span className="ml-2">
                  со статусом <span className="font-semibold text-gray-900">{getStatusLabel(currentFilters.status)}</span>
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
      {selectedCategories.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">
                Выбрано категорий: {selectedCategories.size}
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
                  checked={selectedCategories.size === categories.length && categories.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Порядок
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Товары ({categories.reduce((sum, cat) => sum + (cat.products?.length || 0), 0)})
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Действия</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => (
              <TableRow 
                key={category.id} 
                category={category} 
                index={index}
                isSelected={selectedCategories.has(category.id)}
                onSelect={() => handleSelectCategory(category.id)}
                onStatusToggle={() => handleStatusToggle(category.id, category.isActive)}
                loading={loadingStates[category.id]}
                onClick={() => handleCategoryClick(category.id)}
                renderProductNames={renderProductNames}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">
            Показано {categories.length} из {pagination.totalItems} категорий
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(params?.toString() || '')
                params.set('page', (pagination.currentPage - 1).toString())
                router.push(`/admin/categories?${params.toString()}`)
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
                router.push(`/admin/categories?${params.toString()}`)
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

// Отдельный компонент для строки таблицы
const TableRow = ({ category, index, isSelected, onSelect, onStatusToggle, loading, onClick, renderProductNames }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <tr 
      className={`
        transition-all duration-300 border-b border-gray-100 cursor-pointer
        ${isHovered ? 'bg-blue-50' : 'bg-white'}
        ${isSelected ? 'bg-blue-100' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="relative w-12 px-6 sm:w-16 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" onClick={onClick}>
        <Link 
          href={`/admin/categories/${category.id}`}
          className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-300 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          {category.name}
        </Link>
        {category.description && (
          <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
            {category.description}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" onClick={onClick}>
        <CategoryStatus isActive={category.isActive} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap" onClick={onClick}>
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-100 hover:text-blue-600">
          {category.sortOrder}
        </span>
      </td>
      <td className="px-6 py-4" onClick={onClick}>
        <div className="max-w-[250px]">
          {renderProductNames(category)}
          <div className="text-xs text-gray-400 mt-1">
            Всего: {category.products?.length || 0} товаров
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
          <ActionButton
            onClick={onClick}
            variant="primary"
          >
            Просмотр
          </ActionButton>
          <ActionButton
            onClick={onStatusToggle}
            variant={category.isActive ? "secondary" : "success"}
            disabled={loading}
          >
            {loading ? '...' : category.isActive ? 'Деактивировать' : 'Активировать'}
          </ActionButton>
        </div>
      </td>
    </tr>
  )
}

// Вспомогательный компонент кнопки
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