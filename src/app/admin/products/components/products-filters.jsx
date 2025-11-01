// app/admin/products/components/products-filters.jsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

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
    { key: 'all', label: 'Все статусы', color: 'gray' },
    { key: 'available', label: 'Доступные', color: 'green' },
    { key: 'unavailable', label: 'Недоступные', color: 'red' }
  ]

  const categoryFilters = [
    { key: 'all', label: 'Все категории', color: 'gray' },
    ...categories.map(cat => ({ 
      key: cat, 
      label: cat, 
      color: 'blue' 
    }))
  ]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Фильтры по статусу */}
      <div className="flex gap-3 flex-wrap">
        {statusFilters.map((filter, index) => (
          <button
            key={filter.key}
            onClick={() => handleFilter('status', filter.key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
              flex items-center group relative overflow-hidden min-w-[120px]
              ${activeStatus === filter.key 
                ? `bg-${filter.color}-500 text-white shadow-lg transform scale-105` 
                : `bg-${filter.color}-100 text-${filter.color}-700 hover:bg-${filter.color}-200 border border-${filter.color}-200`
              }
              animate-scale-in
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="relative z-10">
              {filter.label}
            </span>
          </button>
        ))}
      </div>

      {/* Фильтры по категории */}
      <div className="flex gap-3 flex-wrap">
        {categoryFilters.map((filter, index) => (
          <button
            key={filter.key}
            onClick={() => handleFilter('category', filter.key)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
              flex items-center group relative overflow-hidden min-w-[120px]
              ${activeCategory === filter.key 
                ? `bg-${filter.color}-500 text-white shadow-lg transform scale-105` 
                : `bg-${filter.color}-100 text-${filter.color}-700 hover:bg-${filter.color}-200 border border-${filter.color}-200`
              }
              animate-scale-in
            `}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <span className="relative z-10">
              {filter.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}