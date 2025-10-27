// app/admin/error.jsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Анимированная иконка */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2">
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Упс! Что-то пошло не так
            </h1>
            <p className="text-gray-600">
              В админ-панели произошла ошибка. Мы уже работаем над исправлением.
            </p>
          </div>

          {/* Сообщение об ошибке */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-medium">Ошибка:</span> {error.message}
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:scale-105"
            >
              Попробовать снова
            </button>
            
            <Link
              href="/admin/dashboard"
              className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Код ошибки: ADMIN-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Нужна помощь?{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500 font-medium">
              Свяжитесь с поддержкой
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}