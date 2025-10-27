// app/admin/users/components/search-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Безопасное получение параметров
  const search = searchParams?.get('search') || ''
  const status = searchParams?.get('status') || ''
  const role = searchParams?.get('role') || ''

  const [filters, setFilters] = useState({
    search: search,
    status: status,
    role: role
  })

  const [hasFilters, setHasFilters] = useState(false)

  useEffect(() => {
    const hasActiveFilters = search || status || role
    setHasFilters(!!hasActiveFilters)
  }, [search, status, role])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Обновляем URL с новыми параметрами
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    
    router.push(`/admin/users?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '', status: '', role: '' })
    router.push('/admin/users')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-blue-600 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Фильтры и поиск
        </h3>
        
        {/* Индикатор активных фильтров */}
        {hasFilters && (
          <div className="flex items-center animate-scale-in">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm text-green-600 font-medium">Фильтры активны</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Поиск по имени/email */}
        <div className="flex-1 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <svg 
              className="w-4 h-4 mr-2 text-gray-400 transition-colors duration-200 group-hover:text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Поиск
          </label>
          <div className="relative group">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Имя, email или телефон..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift group-hover:border-blue-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 animate-scale-in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Фильтр по статусу */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <svg 
              className="w-4 h-4 mr-2 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Статус
          </label>
          <div className="relative group">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift group-hover:border-blue-300 appearance-none bg-white"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Фильтр по роли */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <svg 
              className="w-4 h-4 mr-2 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Роль
          </label>
          <div className="relative group">
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift group-hover:border-blue-300 appearance-none bg-white"
            >
              <option value="">Все роли</option>
              <option value="chef">Повара</option>
              <option value="customer">Клиенты</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Кнопка сброса */}
        <div className="flex items-end animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={clearFilters}
            disabled={!hasFilters}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift flex items-center group"
          >
            <svg 
              className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Сбросить
          </button>
        </div>

      </div>

      {/* Индикаторы активных фильтров */}
      <div className="mt-4 flex flex-wrap gap-2 animate-fade-in">
        {filters.search && (
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium animate-scale-in">
            Поиск: "{filters.search}"
            <button
              onClick={() => handleFilterChange('search', '')}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              ×
            </button>
          </span>
        )}
        {filters.status && (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-scale-in">
            Статус: {filters.status === 'active' ? 'Активные' : 'Неактивные'}
            <button
              onClick={() => handleFilterChange('status', '')}
              className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              ×
            </button>
          </span>
        )}
        {filters.role && (
          <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium animate-scale-in">
            Роль: {filters.role === 'chef' ? 'Повара' : 'Клиенты'}
            <button
              onClick={() => handleFilterChange('role', '')}
              className="ml-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  )
}