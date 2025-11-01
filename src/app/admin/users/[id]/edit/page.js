// src/app/admin/users/[id]/edit/page.jsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import EditUserForm from '../../../Components/EditUserForm'
import { getUserById } from '../../../../actions/admin/user.actions'
import { AnimatedContainer, SkeletonLoader } from '../../../Components/animation-component'

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const result = await getUserById(params.id)
        
        if (result.success) {
          setUser(result.user)
        } else {
          setError(result.error || 'Пользователь не найден')
        }
      } catch (err) {
        setError('Ошибка при загрузке пользователя')
        console.error('Fetch user error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AnimatedContainer animation="fadeInUp">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <SkeletonLoader type="title" className="w-64" />
            </div>
            <div className="space-y-4">
              <SkeletonLoader type="text" className="w-full" />
              <SkeletonLoader type="text" className="w-3/4" />
              <SkeletonLoader type="text" className="w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <SkeletonLoader type="text" className="w-full" />
                <SkeletonLoader type="text" className="w-full" />
                <SkeletonLoader type="text" className="w-full" />
                <SkeletonLoader type="text" className="w-full" />
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <SkeletonLoader type="button" className="w-24" />
                <SkeletonLoader type="button" className="w-40" />
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AnimatedContainer animation="fadeInUp">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться к списку пользователей
            </button>
          </div>
        </AnimatedContainer>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <AnimatedContainer animation="fadeInUp">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Пользователь не найден</h3>
            <p className="text-gray-600 mb-4">Запрошенный пользователь не существует или был удален</p>
            <button
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Вернуться к списку пользователей
            </button>
          </div>
        </AnimatedContainer>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <AnimatedContainer animation="fadeInUp" delay={100}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse-gentle"></span>
              Редактирование пользователя
            </h1>
            <p className="text-gray-600 mt-1">
              Изменение данных пользователя {user.firstName || user.email}
            </p>
          </div>
          
          {/* Кнопка возврата */}
          <button
            onClick={() => router.push(`/admin/users/${user.id}`)}
            className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover-lift"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к профилю
          </button>
        </div>
      </AnimatedContainer>

      {/* Основной контент */}
      <AnimatedContainer animation="fadeInUp" delay={200}>
        <EditUserForm user={user} />
      </AnimatedContainer>

      {/* Дополнительная информация */}
      <AnimatedContainer animation="fadeInUp" delay={300}>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Информация</h4>
              <p className="text-sm text-blue-700">
                Изменения вступят в силу сразу после сохранения. Пользователь получит уведомление 
                об изменении его данных, если это предусмотрено настройками системы.
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}