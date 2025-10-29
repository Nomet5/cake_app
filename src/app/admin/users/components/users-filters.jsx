// app/admin/users/components/users-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function UsersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Безопасное получение параметров
  const currentRole = searchParams?.get('role') || 'all'
  const [activeFilter, setActiveFilter] = useState(currentRole)

  useEffect(() => {
    setActiveFilter(currentRole)
  }, [currentRole])

  const handleRoleFilter = (role) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (role === 'all') {
      params.delete('role')
    } else {
      params.set('role', role)
    }
    
    router.push(`/admin/users?${params.toString()}`)
  }

  const filters = [
    { 
      key: 'all', 
      label: 'Все пользователи', 
      activeClass: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg transform scale-105',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 hover:shadow-md',
      icon: '👥',
      delay: 0
    },
    { 
      key: 'chef', 
      label: 'Повара', 
      activeClass: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105',
      inactiveClass: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:shadow-md',
      icon: '👨‍🍳',
      delay: 0.1
    },
    { 
      key: 'customer', 
      label: 'Клиенты', 
      activeClass: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg transform scale-105',
      inactiveClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:shadow-md',
      icon: '👤',
      delay: 0.2
    }
  ]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Основные фильтры */}
      <div className="flex gap-3 flex-wrap relative">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleRoleFilter(filter.key)}
            className={`
              px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 
              flex items-center group relative overflow-hidden min-w-[140px]
              ${activeFilter === filter.key ? filter.activeClass : filter.inactiveClass}
              animate-scale-in
            `}
            style={{ animationDelay: `${filter.delay}s` }}
          >
            {/* Анимированный фон при активном состоянии */}
            {activeFilter === filter.key && (
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            )}
            
            {/* Иконка с анимацией */}
            <span className={`
              text-lg mr-2 transition-transform duration-300
              ${activeFilter === filter.key ? 'scale-110' : 'group-hover:scale-110'}
            `}>
              {filter.icon}
            </span>
            
            {/* Текст */}
            <span className="relative z-10 whitespace-nowrap">
              {filter.label}
            </span>
            
            {/* Индикатор активного фильтра */}
            {activeFilter === filter.key && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
            )}
            
            {/* Счетчик */}
            <span className={`
              ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300
              ${activeFilter === filter.key 
                ? 'bg-white bg-opacity-20' 
                : 'bg-white bg-opacity-50'
              }
            `}>
              {filter.key === 'all' && '∞'}
              {filter.key === 'chef' && '👑'}
              {filter.key === 'customer' && '💼'}
            </span>
          </button>
        ))}
      </div>
      
      {/* Индикатор активного фильтра */}
      {activeFilter !== 'all' && (
        <div className="flex items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-700 font-medium mr-2">
              Активный фильтр: 
            </span>
            <span className="text-sm font-semibold text-green-600">
              {filters.find(f => f.key === activeFilter)?.label}
            </span>
            <button
              onClick={() => handleRoleFilter('all')}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              title="Сбросить фильтр"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}