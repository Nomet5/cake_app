'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CategoryActions() {
  const router = useRouter()

  return (
    <div className="flex space-x-3">
      <Link
        href="/admin/categories/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Создать категорию
      </Link>
    </div>
  )
}