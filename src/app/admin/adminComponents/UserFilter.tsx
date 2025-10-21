// components/UserFilters.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function UserFilters({ search }: { search: string }) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: search || ''
  })

  const handleFilterChange = (value: string) => {
    setFilters({ search: value })
    
    const params = new URLSearchParams()
    if (value) params.set('search', value)
    
    router.push(`/admin/users?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '' })
    router.push('/admin/users')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск пользователей
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange(e.target.value)}
            placeholder="Поиск по email, имени или телефону..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {search && (
          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 whitespace-nowrap"
          >
            Сбросить
          </button>
        )}
      </div>
    </div>
  )
}