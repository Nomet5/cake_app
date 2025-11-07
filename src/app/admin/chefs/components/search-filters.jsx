// app/admin/chefs/components/chefs-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'
import { getChefStatusStats } from '../../../actions/admin/chef.actions'

export default function ChefsFilters({ totalResults, onFiltersChange }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    specialization: '',
    sort: 'name'
  })

  const [statusStats, setStatusStats] = useState({
    active: 0,
    inactive: 0,
    pending: 0,
    verified: 0,
    total: 0
  })

  const [loading, setLoading] = useState(false)

  // Инициализация фильтров из URL параметров
  useEffect(() => {
    const currentFilters = {
      search: searchParams?.get('search') || '',
      status: searchParams?.get('status') || '',
      specialization: searchParams?.get('specialization') || '',
      sort: searchParams?.get('sort') || 'name'
    }
    setFilters(currentFilters)
  }, [searchParams])

  // Загружаем статистику по статусам
  useEffect(() => {
    const loadStatusStats = async () => {
      try {
        setLoading(true)
        const stats = await getChefStatusStats()
        setStatusStats(stats)
      } catch (error) {
        console.error('Error loading status stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStatusStats()
  }, [])

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
    const url = queryString ? `/admin/chefs?${queryString}` : '/admin/chefs'
    
    router.push(url)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  // Функция для быстрого применения фильтра статуса
  const applyQuickStatusFilter = (status) => {
    const newFilters = { ...filters, status }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { search: '', status: '', specialization: '', sort: 'name' }
    setFilters(newFilters)
    router.push('/admin/chefs')
  }

  const hasActiveFilters = filters.search || filters.status || filters.specialization || filters.sort !== 'name'

  const filterOptions = {
    status: [
      { value: '', label: 'Все статусы', icon: '🌐', count: statusStats.total },
      { value: 'active', label: 'Активен', icon: '✅', count: statusStats.active },
      { value: 'inactive', label: 'Неактивен', icon: '⏸️', count: statusStats.inactive },
      { value: 'pending', label: 'На проверке', icon: '⏳', count: statusStats.pending },
      { value: 'verified', label: 'Верифицирован', icon: '⭐', count: statusStats.verified }
    ],
    specialization: [
      { value: '', label: 'Все специализации', icon: '🍽️' },
      { value: 'Итальянская кухня', label: 'Итальянская кухня', icon: '🍝' },
      { value: 'Французская кухня', label: 'Французская кухня', icon: '🥐' },
      { value: 'Японская кухня', label: 'Японская кухня', icon: '🍣' },
      { value: 'Русская кухня', label: 'Русская кухня', icon: '🥟' },
      { value: 'Вегетарианская', label: 'Вегетарианская', icon: '🥦' },
      { value: 'Десерты', label: 'Десерты', icon: '🍰' }
    ],
    sort: [
      { value: 'name', label: 'По имени (А-Я)', icon: '🔤' },
      { value: 'name_desc', label: 'По имени (Я-А)', icon: '🔠' },
      { value: 'createdAt_desc', label: 'По дате (новые)', icon: '🆕' },
      { value: 'createdAt', label: 'По дате (старые)', icon: '📅' },
      { value: 'products', label: 'По товарам (много)', icon: '📦' },
      { value: 'products_desc', label: 'По товарам (мало)', icon: '📥' }
    ]
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

  return (
    <div className="flex flex-col gap-6">
      {/* Основные фильтры в виде карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Поиск */}
        <AnimatedContainer animation="fadeInUp" delay={0} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-blue-200 p-4 hover-lift transition-all duration-300 shadow-sm hover:shadow-md">
              <label htmlFor="search" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🔍</span>
                Поиск поваров
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Имя, email, специализация..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </FloatingElement>
        </AnimatedContainer>

        {/* Статус */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-green-200 p-4 hover-lift transition-all duration-300 shadow-sm hover:shadow-md">
              <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">📊</span>
                Статус повара
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              >
                {filterOptions.status.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label} {option.count !== undefined && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>
          </FloatingElement>
        </AnimatedContainer>

        {/* Специализация */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-purple-200 p-4 hover-lift transition-all duration-300 shadow-sm hover:shadow-md">
              <label htmlFor="specialization" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🎯</span>
                Специализация
              </label>
              <select
                id="specialization"
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              >
                {filterOptions.specialization.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FloatingElement>
        </AnimatedContainer>

        {/* Сортировка */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-orange-200 p-4 hover-lift transition-all duration-300 shadow-sm hover:shadow-md">
              <label htmlFor="sort" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🔄</span>
                Сортировка
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              >
                {filterOptions.sort.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FloatingElement>
        </AnimatedContainer>
      </div>

      {/* Индикатор активных фильтров */}
      {hasActiveFilters && (
        <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  Активные фильтры
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {filters.search && `Поиск: "${filters.search}"`}
                  {filters.status && ` • Статус: ${getStatusLabel(filters.status)}`}
                  {filters.specialization && ` • Специализация: ${filters.specialization}`}
                  {filters.sort !== 'name' && ` • Сортировка: ${filterOptions.sort.find(s => s.value === filters.sort)?.label}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {totalResults}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  найдено поваров
                </div>
              </div>
              
              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                className="min-w-[120px] bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Сбросить всё
              </AnimatedButton>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Быстрые фильтры статусов */}
      <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
        <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-4 border-2 border-orange-100">
          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="text-lg mr-2">⚡</span>
            Быстрые фильтры по статусам
          </h5>
          <div className="flex gap-2 flex-wrap">
            {filterOptions.status.slice(1).map((status) => (
              <button
                key={status.value}
                onClick={() => applyQuickStatusFilter(status.value)}
                disabled={status.count === 0}
                className={`
                  px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center border relative group
                  ${filters.status === status.value
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105'
                    : status.count === 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:scale-105 hover:shadow-sm'
                  }
                `}
              >
                <span className="mr-1.5">{status.icon}</span>
                {status.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs transition-colors ${
                  filters.status === status.value
                    ? 'bg-orange-600 text-white'
                    : status.count === 0
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-orange-200 group-hover:text-orange-700'
                }`}>
                  {status.count}
                </span>
                
                {/* Индикатор загрузки */}
                {loading && filters.status === status.value && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </AnimatedContainer>

      {/* Дополнительная информация */}
      <AnimatedContainer animation="fadeInUp" delay={600} duration="normal">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!hasActiveFilters 
                ? 'Показаны все повары системы' 
                : 'Результаты отфильтрованы по выбранным критериям'
              }
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Фильтры применяются мгновенно
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}