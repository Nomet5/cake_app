// app/admin/users/components/search-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'

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

  const filterItems = [
    {
      key: 'search',
      label: 'Поиск',
      type: 'input',
      placeholder: 'Имя, email или телефон...',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      delay: 100
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      options: [
        { value: '', label: 'Все статусы' },
        { value: 'active', label: 'Активные' },
        { value: 'inactive', label: 'Неактивные' }
      ],
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      delay: 200
    },
    {
      key: 'role',
      label: 'Роль',
      type: 'select',
      options: [
        { value: '', label: 'Все роли' },
        { value: 'chef', label: 'Повара' },
        { value: 'customer', label: 'Клиенты' }
      ],
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      delay: 300
    }
  ]

  const activeFilterLabels = {
    status: {
      active: 'Активные',
      inactive: 'Неактивные'
    },
    role: {
      chef: 'Повара',
      customer: 'Клиенты'
    }
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <FloatingElement speed="slow">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            Фильтры и поиск
          </h3>
        </FloatingElement>
        
        {/* Индикатор активных фильтров */}
        {hasFilters && (
          <AnimatedContainer animation="scaleIn" delay={100}>
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Фильтры активны
            </div>
          </AnimatedContainer>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-end">
        {filterItems.map((item, index) => (
          <AnimatedContainer
            key={item.key}
            animation="fadeInRight"
            delay={item.delay}
            duration="normal"
            className={item.type === 'input' ? 'flex-1' : ''}
          >
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span className="text-gray-400 mr-2 transition-colors duration-200 group-hover:text-blue-500">
                  {item.icon}
                </span>
                {item.label}
              </label>
              
              <div className="relative">
                {item.type === 'input' ? (
                  <>
                    <input
                      type="text"
                      value={filters[item.key]}
                      onChange={(e) => handleFilterChange(item.key, e.target.value)}
                      placeholder={item.placeholder}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 group-hover:shadow-sm"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                      {item.icon}
                    </div>
                    {filters[item.key] && (
                      <button
                        onClick={() => handleFilterChange(item.key, '')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="relative group">
                    <select
                      value={filters[item.key]}
                      onChange={(e) => handleFilterChange(item.key, e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 group-hover:shadow-sm appearance-none bg-white"
                    >
                      {item.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedContainer>
        ))}

        {/* Кнопка сброса */}
        <AnimatedContainer animation="fadeInRight" delay={400}>
          <AnimatedButton
            variant={hasFilters ? "danger" : "secondary"}
            size="md"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="min-w-[120px]"
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
          </AnimatedButton>
        </AnimatedContainer>
      </div>

      {/* Индикаторы активных фильтров */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filterItems.map((item) => {
          if (!filters[item.key]) return null
          
          let displayValue = filters[item.key]
          if (item.key === 'search') {
            displayValue = `"${filters[item.key]}"`
          } else if (activeFilterLabels[item.key]?.[filters[item.key]]) {
            displayValue = activeFilterLabels[item.key][filters[item.key]]
          }

          const colorClasses = {
            search: 'bg-blue-100 text-blue-800',
            status: 'bg-green-100 text-green-800',
            role: 'bg-purple-100 text-purple-800'
          }

          return (
            <AnimatedContainer
              key={item.key}
              animation="scaleIn"
              delay={100}
              className="inline-flex"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[item.key]}`}>
                {item.label}: {displayValue}
                <button
                  onClick={() => handleFilterChange(item.key, '')}
                  className="ml-2 hover:opacity-70 transition-opacity duration-200 flex items-center justify-center w-4 h-4"
                >
                  ×
                </button>
              </span>
            </AnimatedContainer>
          )
        })}
      </div>

      {/* Статистика фильтров */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={500}
        className="mt-4 pt-4 border-t border-gray-200"
      >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {hasFilters ? 'Применены фильтры поиска' : 'Используйте фильтры для поиска пользователей'}
          </div>
          
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center"
            >
              Очистить все
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}