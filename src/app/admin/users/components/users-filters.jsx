// app/admin/users/components/users-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'


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
      description: 'Полный список пользователей',
      activeClass: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg',
      inactiveClass: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
      icon: '👥',
      delay: 0,
      count: '∞'
    },
    { 
      key: 'chef', 
      label: 'Повара', 
      description: 'Пользователи с профилем повара',
      activeClass: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200',
      icon: '👨‍🍳',
      delay: 100,
      count: '👑'
    },
    { 
      key: 'customer', 
      label: 'Клиенты', 
      description: 'Обычные пользователи',
      activeClass: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg',
      inactiveClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
      icon: '👤',
      delay: 200,
      count: '💼'
    }
  ]

  const activeFilterData = filters.find(f => f.key === activeFilter)

  return (
    <div className="flex flex-col gap-6">
      {/* Основные фильтры */}
      <div className="flex gap-4 flex-wrap">
        {filters.map((filter) => (
          <AnimatedContainer
            key={filter.key}
            animation="fadeInUp"
            delay={filter.delay}
            duration="normal"
          >
            <FloatingElement speed="normal">
              <button
                onClick={() => handleRoleFilter(filter.key)}
                className={`
                  relative group px-6 py-4 rounded-2xl text-sm font-semibold 
                  transition-all duration-500 ease-out flex items-center 
                  min-w-[160px] h-16 overflow-hidden border-2
                  ${activeFilter === filter.key 
                    ? `${filter.activeClass} border-transparent transform scale-105 shadow-xl` 
                    : `${filter.inactiveClass} hover:scale-105 hover:shadow-lg`
                  }
                `}
              >
                {/* Анимированный фон */}
                <div className={`
                  absolute inset-0 transition-all duration-500
                  ${activeFilter === filter.key 
                    ? 'bg-white opacity-0 group-hover:opacity-10' 
                    : 'bg-gray-200 opacity-0 group-hover:opacity-20'
                  }
                `}></div>
                
                {/* Иконка */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mr-3
                  transition-all duration-500 text-2xl
                  ${activeFilter === filter.key 
                    ? 'bg-white bg-opacity-20 scale-110' 
                    : 'bg-white scale-100 group-hover:scale-110'
                  }
                `}>
                  {filter.icon}
                </div>
                
                {/* Текст и описание */}
                <div className="text-left flex-1">
                  <div className="font-semibold text-base leading-tight">
                    {filter.label}
                  </div>
                  <div className={`
                    text-xs mt-0.5 transition-all duration-300
                    ${activeFilter === filter.key 
                      ? 'text-white text-opacity-90' 
                      : 'text-gray-500 group-hover:text-gray-700'
                    }
                  `}>
                    {filter.description}
                  </div>
                </div>
                
                {/* Счетчик */}
                <div className={`
                  ml-2 px-2 py-1 rounded-lg text-xs font-bold 
                  transition-all duration-300
                  ${activeFilter === filter.key 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-white text-gray-600 group-hover:bg-opacity-50'
                  }
                `}>
                  {filter.count}
                </div>

                {/* Индикатор активного фильтра */}
                {activeFilter === filter.key && (
                  <div className="absolute -top-1 -right-1">
                    <div className="relative">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>
            </FloatingElement>
          </AnimatedContainer>
        ))}
      </div>
      
      {/* Индикатор активного фильтра */}
      {activeFilter !== 'all' && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={300}
          duration="normal"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  Активный фильтр
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {activeFilterData?.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {activeFilterData?.label}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  выбранный фильтр
                </div>
              </div>
              
              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={() => handleRoleFilter('all')}
                className="min-w-[100px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Сбросить
              </AnimatedButton>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Дополнительная информация */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={400}
        duration="normal"
      >
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activeFilter === 'all' 
                ? 'Показаны все пользователи системы' 
                : `Отфильтровано по: ${activeFilterData?.label.toLowerCase()}`
              }
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Фильтры обновляются в реальном времени
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}