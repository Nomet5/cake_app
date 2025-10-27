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
      activeClass: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg',
      inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
      icon: '👥',
      delay: 0
    },
    { 
      key: 'chef', 
      label: 'Повара', 
      activeClass: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200',
      icon: '👨‍🍳',
      delay: 0.1
    },
    { 
      key: 'customer', 
      label: 'Клиенты', 
      activeClass: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg',
      inactiveClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
      icon: '👤',
      delay: 0.2
    }
  ]

  return (
    <div className="flex gap-3 flex-wrap animate-fade-in">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => handleRoleFilter(filter.key)}
          className={`
            px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 
            hover-lift flex items-center group relative overflow-hidden
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
          <span className="relative z-10">
            {filter.label}
          </span>
          
          {/* Индикатор активного фильтра */}
          {activeFilter === filter.key && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          )}
          
          {/* Счетчик (можно добавить реальные данные) */}
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
      
      {/* Индикатор активного фильтра */}
      {activeFilter !== 'all' && (
        <div className="flex items-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">
            Фильтр: {filters.find(f => f.key === activeFilter)?.label}
          </span>
          <button
            onClick={() => handleRoleFilter('all')}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 animate-scale-in"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Анимация переключения */}
      <div className="absolute inset-0 pointer-events-none">
        {filters.map((filter) => (
          activeFilter === filter.key && (
            <div
              key={filter.key}
              className={`
                absolute inset-0 rounded-xl transition-all duration-500
                ${filter.key === 'all' ? 'bg-gradient-to-r from-gray-600 to-gray-700' : ''}
                ${filter.key === 'chef' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : ''}
                ${filter.key === 'customer' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : ''}
              `}
            ></div>
          )
        ))}
      </div>
    </div>
  )
}