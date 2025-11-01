// app/admin/chefs/components/chefs-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'

export default function ChefsFilters({ totalResults }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: searchParams?.get('search') || '',
    status: searchParams?.get('status') || '',
    specialization: searchParams?.get('specialization') || '',
    sort: searchParams?.get('sort') || 'name'
  })

  useEffect(() => {
    setFilters({
      search: searchParams?.get('search') || '',
      status: searchParams?.get('status') || '',
      specialization: searchParams?.get('specialization') || '',
      sort: searchParams?.get('sort') || 'name'
    })
  }, [searchParams])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams(searchParams?.toString() || '')
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'name') {
        params.set(k, v)
      } else {
        params.delete(k)
      }
    })
    
    router.push(`/admin/chefs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '', status: '', specialization: '', sort: 'name' })
    router.push('/admin/chefs')
  }

  const hasActiveFilters = filters.search || filters.status || filters.specialization || filters.sort !== 'name'

  const filterOptions = {
    status: [
      { value: '', label: 'Все статусы', icon: '🌐' },
      { value: 'active', label: 'Активен', icon: '✅' },
      { value: 'inactive', label: 'Неактивен', icon: '⏸️' },
      { value: 'pending', label: 'На проверке', icon: '⏳' },
      { value: 'banned', label: 'Заблокирован', icon: '🚫' }
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
      { value: 'rating', label: 'По рейтингу (↑)', icon: '⭐' },
      { value: 'rating_desc', label: 'По рейтингу (↓)', icon: '🌟' },
      { value: 'joined', label: 'По дате (новые)', icon: '🆕' },
      { value: 'joined_desc', label: 'По дате (старые)', icon: '📅' }
    ]
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      active: 'Активен',
      inactive: 'Неактивен',
      pending: 'На проверке',
      banned: 'Заблокирован'
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
            <div className="bg-white rounded-xl border-2 border-blue-200 p-4 hover-lift hover-glow transition-all duration-300 shadow-sm hover:shadow-md">
              <label htmlFor="search" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="text-lg mr-2">🔍</span>
                Поиск поваров
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Имя, email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </FloatingElement>
        </AnimatedContainer>

        {/* Статус */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-green-200 p-4 hover-lift hover-glow transition-all duration-300 shadow-sm hover:shadow-md">
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
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FloatingElement>
        </AnimatedContainer>

        {/* Специализация */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <FloatingElement speed="normal">
            <div className="bg-white rounded-xl border-2 border-purple-200 p-4 hover-lift hover-glow transition-all duration-300 shadow-sm hover:shadow-md">
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
            <div className="bg-white rounded-xl border-2 border-orange-200 p-4 hover-lift hover-glow transition-all duration-300 shadow-sm hover:shadow-md">
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

      {/* Дополнительная информация */}
      <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
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

      {/* Быстрые фильтры статусов */}
      <AnimatedContainer animation="fadeInUp" delay={600} duration="normal">
        <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-4 border-2 border-orange-100">
          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="text-lg mr-2">⚡</span>
            Быстрые фильтры по статусам
          </h5>
          <div className="flex gap-2 flex-wrap">
            {filterOptions.status.slice(1).map((status, index) => (
              <button
                key={status.value}
                onClick={() => handleFilterChange('status', status.value)}
                className={`
                  px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300
                  flex items-center border
                  ${filters.status === status.value
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:scale-105'
                  }
                `}
              >
                <span className="mr-1.5">{status.icon}</span>
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}