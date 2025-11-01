// app/admin/products/components/products-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedContainer, AnimatedButton, FloatingElement } from '../../Components/animation-component'

export default function ProductsFilters({ categories = [] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentStatus = searchParams?.get('status') || 'all'
  const currentCategory = searchParams?.get('category') || 'all'
  
  const [activeStatus, setActiveStatus] = useState(currentStatus)
  const [activeCategory, setActiveCategory] = useState(currentCategory)

  useEffect(() => {
    setActiveStatus(currentStatus)
    setActiveCategory(currentCategory)
  }, [currentStatus, currentCategory])

  const handleFilter = (type, value) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (value === 'all') {
      params.delete(type)
    } else {
      params.set(type, value)
    }
    
    router.push(`/admin/products?${params.toString()}`)
  }

  const statusFilters = [
    { 
      key: 'all', 
      label: 'Все продукты', 
      description: 'Полный список продуктов',
      activeClass: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg',
      inactiveClass: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200',
      icon: '📦',
      delay: 0,
      count: '∞'
    },
    { 
      key: 'available', 
      label: 'Доступные', 
      description: 'Продукты доступные для заказа',
      activeClass: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      inactiveClass: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200',
      icon: '✅',
      delay: 100,
      count: '🟢'
    },
    { 
      key: 'unavailable', 
      label: 'Недоступные', 
      description: 'Продукты временно недоступны',
      activeClass: 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg',
      inactiveClass: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200',
      icon: '⏸️',
      delay: 200,
      count: '🔴'
    }
  ]

  const categoryFilters = [
    { 
      key: 'all', 
      label: 'Все категории', 
      description: 'Продукты из всех категорий',
      activeClass: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg',
      inactiveClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
      icon: '📋',
      delay: 300,
      count: '∞'
    },
    ...categories.map((cat, index) => ({ 
      key: cat, 
      label: cat, 
      description: `Продукты из категории ${cat}`,
      activeClass: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg',
      inactiveClass: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200',
      icon: '🏷️',
      delay: 400 + (index * 50),
      count: '📁'
    }))
  ]

  const activeStatusData = statusFilters.find(f => f.key === activeStatus)
  const activeCategoryData = categoryFilters.find(f => f.key === activeCategory)

  const hasActiveFilters = activeStatus !== 'all' || activeCategory !== 'all'

  return (
    <div className="flex flex-col gap-6">
      {/* Фильтры по статусу */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Статус продуктов</h3>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          {statusFilters.map((filter) => (
            <AnimatedContainer
              key={filter.key}
              animation="fadeInUp"
              delay={filter.delay}
              duration="normal"
            >
              <FloatingElement speed="normal">
                <button
                  onClick={() => handleFilter('status', filter.key)}
                  className={`
                    relative group px-6 py-4 rounded-2xl text-sm font-semibold 
                    transition-all duration-500 ease-out flex items-center 
                    min-w-[160px] h-16 overflow-hidden border-2
                    ${activeStatus === filter.key 
                      ? `${filter.activeClass} border-transparent transform scale-105 shadow-xl` 
                      : `${filter.inactiveClass} hover:scale-105 hover:shadow-lg`
                    }
                  `}
                >
                  {/* Анимированный фон */}
                  <div className={`
                    absolute inset-0 transition-all duration-500
                    ${activeStatus === filter.key 
                      ? 'bg-white opacity-0 group-hover:opacity-10' 
                      : 'bg-gray-200 opacity-0 group-hover:opacity-20'
                    }
                  `}></div>
                  
                  {/* Иконка */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center mr-3
                    transition-all duration-500 text-2xl
                    ${activeStatus === filter.key 
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
                      ${activeStatus === filter.key 
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
                    ${activeStatus === filter.key 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-white text-gray-600 group-hover:bg-opacity-50'
                    }
                  `}>
                    {filter.count}
                  </div>

                  {/* Индикатор активного фильтра */}
                  {activeStatus === filter.key && (
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
      </div>

      {/* Фильтры по категории */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Категории продуктов</h3>
        </div>
        
        <div className="flex gap-4 flex-wrap">
          {categoryFilters.map((filter) => (
            <AnimatedContainer
              key={filter.key}
              animation="fadeInUp"
              delay={filter.delay}
              duration="normal"
            >
              <FloatingElement speed="normal">
                <button
                  onClick={() => handleFilter('category', filter.key)}
                  className={`
                    relative group px-6 py-4 rounded-2xl text-sm font-semibold 
                    transition-all duration-500 ease-out flex items-center 
                    min-w-[160px] h-16 overflow-hidden border-2
                    ${activeCategory === filter.key 
                      ? `${filter.activeClass} border-transparent transform scale-105 shadow-xl` 
                      : `${filter.inactiveClass} hover:scale-105 hover:shadow-lg`
                    }
                  `}
                >
                  {/* Анимированный фон */}
                  <div className={`
                    absolute inset-0 transition-all duration-500
                    ${activeCategory === filter.key 
                      ? 'bg-white opacity-0 group-hover:opacity-10' 
                      : 'bg-gray-200 opacity-0 group-hover:opacity-20'
                    }
                  `}></div>
                  
                  {/* Иконка */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center mr-3
                    transition-all duration-500 text-2xl
                    ${activeCategory === filter.key 
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
                      ${activeCategory === filter.key 
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
                    ${activeCategory === filter.key 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-white text-gray-600 group-hover:bg-opacity-50'
                    }
                  `}>
                    {filter.count}
                  </div>

                  {/* Индикатор активного фильтра */}
                  {activeCategory === filter.key && (
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
      </div>
      
      {/* Индикатор активных фильтров */}
      {hasActiveFilters && (
        <AnimatedContainer
          animation="fadeInUp"
          delay={500}
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
                  Активные фильтры
                </h4>
                <div className="flex gap-4 mt-1">
                  {activeStatus !== 'all' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Статус:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        {activeStatusData?.label}
                      </span>
                    </div>
                  )}
                  {activeCategory !== 'all' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Категория:</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                        {activeCategoryData?.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {[activeStatus !== 'all', activeCategory !== 'all'].filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  активных фильтра
                </div>
              </div>
              
              <AnimatedButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  handleFilter('status', 'all')
                  handleFilter('category', 'all')
                }}
                className="min-w-[100px]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Сбросить все
              </AnimatedButton>
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Дополнительная информация */}
      <AnimatedContainer
        animation="fadeInUp"
        delay={600}
        duration="normal"
      >
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!hasActiveFilters 
                ? 'Показаны все продукты системы' 
                : `Отфильтровано по выбранным параметрам`
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