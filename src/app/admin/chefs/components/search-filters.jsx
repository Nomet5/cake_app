'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchFilters({ searchParams, totalResults }) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    status: searchParams.status || '',
    specialization: searchParams.specialization || '',
    sort: searchParams.sort || 'name'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Обновляем URL с новыми параметрами
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    
    router.push(`/admin/chefs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '', status: '', specialization: '', sort: 'name' })
    router.push('/admin/chefs')
  }

  const hasActiveFilters = filters.search || filters.status || filters.specialization || filters.sort !== 'name'

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Поиск и фильтры</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Поиск */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Поиск по имени или email
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Введите имя или email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Статус */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Статус
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все статусы</option>
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
            <option value="pending">На проверке</option>
            <option value="banned">Заблокирован</option>
          </select>
        </div>

        {/* Специализация */}
        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
            Специализация
          </label>
          <select
            id="specialization"
            value={filters.specialization}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Все специализации</option>
            <option value="Итальянская кухня">Итальянская кухня</option>
            <option value="Французская кухня">Французская кухня</option>
            <option value="Японская кухня">Японская кухня</option>
            <option value="Русская кухня">Русская кухня</option>
            <option value="Вегетарианская">Вегетарианская</option>
            <option value="Десерты">Десерты</option>
          </select>
        </div>

        {/* Сортировка */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Сортировка
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">По имени (А-Я)</option>
            <option value="name_desc">По имени (Я-А)</option>
            <option value="rating">По рейтингу (↑)</option>
            <option value="rating_desc">По рейтингу (↓)</option>
            <option value="joined">По дате (новые)</option>
            <option value="joined_desc">По дате (старые)</option>
          </select>
        </div>
      </div>

      {/* Результаты фильтрации */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Найдено поваров: <span className="font-semibold">{totalResults}</span>
            {filters.search && ` по запросу "${filters.search}"`}
            {filters.status && ` со статусом "${getStatusLabel(filters.status)}"`}
            {filters.specialization && ` со специализацией "${filters.specialization}"`}
          </p>
        </div>
      )}
    </div>
  )
}

function getStatusLabel(status) {
  const statusLabels = {
    active: 'Активен',
    inactive: 'Неактивен',
    pending: 'На проверке',
    banned: 'Заблокирован'
  }
  return statusLabels[status] || status
}