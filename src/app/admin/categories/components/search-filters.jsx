// app/admin/categories/components/categories-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'

export default function CategoriesFilters({ totalResults, onFiltersChange }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sort: 'name'
  })

  // Инициализация фильтров из URL параметров
  useEffect(() => {
    const currentFilters = {
      search: searchParams?.get('search') || '',
      status: searchParams?.get('status') || '',
      sort: searchParams?.get('sort') || 'name'
    }
    setFilters(currentFilters)
  }, [searchParams])

  const applyFilters = (newFilters) => {
    const params = new URLSearchParams()
    
    // Добавляем только заполненные фильтры
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        // Для сортировки не добавляем значение по умолчанию
        if (key === 'sort' && value === 'name') {
          return
        }
        params.set(key, value)
      }
    })
    
    // Удаляем параметр page при изменении фильтров
    params.delete('page')
    
    // Формируем URL
    const queryString = params.toString()
    const url = queryString ? `/admin/categories?${queryString}` : '/admin/categories'
    
    router.push(url)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { search: '', status: '', sort: 'name' }
    setFilters(newFilters)
    router.push('/admin/categories')
  }

  const hasActiveFilters = filters.search || filters.status || filters.sort !== 'name'

  const filterOptions = {
    status: [
      { value: '', label: 'Все статусы', icon: '🌐' },
      { value: 'active', label: 'Активные', icon: '✅' },
      { value: 'inactive', label: 'Неактивные', icon: '⏸️' }
    ],
    sort: [
      { value: 'name', label: 'По названию (А-Я)', icon: '🔤' },
      { value: 'name_desc', label: 'По названию (Я-А)', icon: '🔠' },
      { value: 'createdAt_desc', label: 'По дате (новые)', icon: '🆕' },
      { value: 'createdAt', label: 'По дате (старые)', icon: '📅' },
      { value: 'products', label: 'По товарам (много)', icon: '📦' },
      { value: 'products_desc', label: 'По товарам (мало)', icon: '📥' }
    ]
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Основные фильтры занимают всю ширину */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Поиск - занимает всю доступную ширину */}
        <AnimatedContainer animation="fadeInUp" delay={0} duration="normal" className="w-full">
          <div className="w-full bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
              🔍 Поиск категорий
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Название, описание..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
            />
          </div>
        </AnimatedContainer>

        {/* Статус - занимает всю доступную ширину */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal" className="w-full">
          <div className="w-full bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
              📊 Статус
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-sm"
            >
              {filterOptions.status.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </AnimatedContainer>

        {/* Сортировка - занимает всю доступную ширину */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal" className="w-full">
          <div className="w-full bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mb-2 block">
              🔄 Сортировка
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
            >
              {filterOptions.sort.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </AnimatedContainer>
      </div>

      {/* Индикатор активных фильтров и кнопка сброса - занимает всю ширину */}
      {hasActiveFilters && (
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal" className="w-full">
          <div className="w-full flex items-center justify-between bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Активные фильтры:
                {filters.search && (
                  <span className="ml-2 bg-white px-2 py-1 rounded border border-blue-200 text-blue-700">
                    🔍 "{filters.search}"
                  </span>
                )}
                {filters.status && (
                  <span className="ml-2 bg-white px-2 py-1 rounded border border-green-200 text-green-700">
                    📊 {filterOptions.status.find(s => s.value === filters.status)?.label}
                  </span>
                )}
                {filters.sort !== 'name' && (
                  <span className="ml-2 bg-white px-2 py-1 rounded border border-purple-200 text-purple-700">
                    🔄 {filterOptions.sort.find(s => s.value === filters.sort)?.label}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">
                  {totalResults}
                </div>
                <div className="text-xs text-gray-500">
                  найдено
                </div>
              </div>
              
              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 border-blue-300 hover:bg-blue-50 text-sm"
              >
                ✕ Сбросить
              </AnimatedButton>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Убрана секция с кнопкой создания категории */}
    </div>
  )
}