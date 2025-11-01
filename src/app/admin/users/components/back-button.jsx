'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BackButton({ 
  href = '/admin/users', 
  children = 'Назад к списку пользователей' 
}) {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.back()
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </Link>
  )
}