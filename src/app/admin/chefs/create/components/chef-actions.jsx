'use client'

import Link from 'next/link'

export default function ChefActions() {
  return (
    <div className="flex space-x-3">
      <Link
        href="/admin/chefs/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Добавить повара
      </Link>
    </div>
  )
}