// app/admin/users/components/create-user-button.jsx
'use client'

import Link from "next/link";

export default function CreateUserButton() {
  return (
    <>
      {/* Кнопка-ссылка для создания пользователя */}
      <Link
        href="/admin/chefs/create"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover-lift shadow-lg font-medium flex items-center justify-center group animate-fade-in"
      >
        <svg 
          className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Добавить повара
      </Link>
    </> 
  )
}