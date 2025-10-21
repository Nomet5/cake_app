// components/ProductFilters.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getActiveCategories, getChefs } from '../../lib/actions'

export function ProductFilters({ 
  search, 
  chefId, 
  categoryId, 
  available 
}: { 
  search: string
  chefId?: number
  categoryId?: number
  available?: boolean
}) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: search || '',
    chefId: chefId || '',
    categoryId: categoryId || '',
    available: available !== undefined ? String(available) : ''
  })
  const [chefs, setChefs] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  // Загружаем данные для фильтров
  useEffect(() => {
    const loadFilterData = async () => {
      const [chefsResult, categoriesResult] = await Promise.all([
        getChefs(1, 100),
        getActiveCategories()
      ])
      
      if (chefsResult.success) setChefs(chefsResult.chefs)
      if (categoriesResult.success) setCategories(categoriesResult.categories)
    }
    
    loadFilterData()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Строим URL с фильтрами
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.chefId) params.set('chefId', newFilters.chefId)
    if (newFilters.categoryId) params.set('categoryId', newFilters.categoryId)
    if (newFilters.available) params.set('available', newFilters.available)
    
    router.push(`/admin/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '', chefId: '', categoryId: '', available: '' })
    router.push('/admin/products')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Поиск по названию */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Название товара..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Фильтр по повару */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Повар
          </label>
          <select
            value={filters.chefId}
            onChange={(e) => handleFilterChange('chefId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все повары</option>
            {chefs.map((chef) => (
              <option key={chef.id} value={chef.id}>
                {chef.businessName}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по категории */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по доступности */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <select
            value={filters.available}
            onChange={(e) => handleFilterChange('available', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все</option>
            <option value="true">Доступен</option>
            <option value="false">Недоступен</option>
          </select>
        </div>

        {/* Кнопка сброса */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  )
}