// app/admin/products/components/search-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  AnimatedContainer,
  FloatingElement 
} from '../../Components/animation-component'

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setSearchQuery(searchParams?.get('search') || '')
  }, [searchParams])

  const handleSearch = (value) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    
    router.push(`/admin/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    router.push('/admin/products')
  }

  const hasActiveFilters = searchParams?.toString() && searchParams.toString() !== ''

  return (
    <AnimatedContainer animation="slideInRight" duration="fast">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-blue-100 shadow-sm">
        
        {/* Левая часть - Заголовок и описание */}
        <div className="flex-1">
          <FloatingElement speed="slow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Поиск продуктов</h3>
                <p className="text-sm text-gray-600">
                  Найдите нужный продукт по названию или описанию
                </p>
              </div>
            </div>
          </FloatingElement>
        </div>

        {/* Правая часть - Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          
          {/* Поле поиска */}
          <FloatingElement speed="normal">
            <div className="relative group">
              <div className={`
                absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl 
                transition-all duration-300 blur-sm group-hover:blur-md
                ${isFocused ? 'opacity-50' : 'opacity-30'}
              `}></div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введите название продукта..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`
                    w-full sm:w-80 pl-12 pr-4 py-3 rounded-xl 
                    border-2 transition-all duration-300 
                    bg-white backdrop-blur-sm
                    shadow-lg focus:shadow-xl
                    ${isFocused 
                      ? 'border-blue-400 ring-4 ring-blue-100' 
                      : 'border-gray-200 hover:border-blue-300'
                    }
                  `}
                />
                
                {/* Иконка поиска */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`
                    h-5 w-5 transition-all duration-300
                    ${isFocused ? 'text-blue-500 scale-110' : 'text-gray-400'}
                  `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Индикатор поиска */}
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </FloatingElement>

          {/* Кнопка сброса фильтров */}
          {hasActiveFilters && (
            <FloatingElement speed="fast">
              <button
                onClick={clearFilters}
                className="
                  px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 
                  text-white rounded-xl font-medium
                  transition-all duration-300 
                  hover:from-gray-600 hover:to-gray-700
                  hover:scale-105 hover:shadow-lg
                  active:scale-95
                  flex items-center space-x-2
                  border-2 border-gray-400
                  shadow-md
                "
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-semibold">Сбросить</span>
              </button>
            </FloatingElement>
          )}

          {/* Индикатор активных фильтров */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Фильтры активны</span>
              <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                {searchQuery ? 'Поиск' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>Поиск по названию и описанию продукта</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span>Автоматическое применение при вводе</span>
        </div>
        {!hasActiveFilters && (
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Введите текст для начала поиска</span>
          </div>
        )}
      </div>
    </AnimatedContainer>
  )
}