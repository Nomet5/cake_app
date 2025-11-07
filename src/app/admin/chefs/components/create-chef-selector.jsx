// app/admin/chefs/components/create-chef-selector.jsx
'use client'

import { useState } from 'react'
import CreateChefFromUser from './create-chef-from-user'
import CreateChefForm from '../create/components/create-chef-form'
import { 
  AnimatedContainer, 
  FloatingElement,
} from '../../Components/animation-component' // Исправлен путь импорта

export default function CreateChefSelector() {
  const [creationType, setCreationType] = useState(null) // 'user' | 'scratch' | null

  if (creationType === 'user') {
    return <CreateChefFromUser onBack={() => setCreationType(null)} />
  }

  if (creationType === 'scratch') {
    return <CreateChefForm onBack={() => setCreationType(null)} />
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto"
    >
      {/* Заголовок */}
      <div className="text-center mb-8">
        <FloatingElement speed="slow">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl text-white">👨‍🍳</span>
          </div>
        </FloatingElement>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Добавить повара</h1>
        <p className="text-gray-600">Выберите способ создания профиля повара</p>
      </div>

      {/* Карточки выбора */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Создание из существующего пользователя */}
        <AnimatedContainer animation="fadeInLeft" delay={100} duration="normal">
          <button
            onClick={() => setCreationType('user')}
            className="w-full text-left bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl text-white">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Из существующего пользователя
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Преобразовать существующего пользователя в повара. Будет использован его email и данные.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Выбрать пользователя</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </AnimatedContainer>

        {/* Создание с нуля */}
        <AnimatedContainer animation="fadeInRight" delay={200} duration="normal">
          <button
            onClick={() => setCreationType('scratch')}
            className="w-full text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl text-white">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Создать нового
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Создать полностью нового повара с нуля. Будет создан новый пользователь и профиль повара.
            </p>
            <div className="flex items-center text-green-600 font-medium">
              <span>Создать с нуля</span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>
        </AnimatedContainer>
      </div>

      {/* Информация */}
      <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
              <span className="text-xs text-white">ℹ️</span>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Рекомендация:</strong> Используйте "Из существующего пользователя" если пользователь уже зарегистрирован в системе. 
                Для полностью новых поваров используйте "Создать нового".
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </AnimatedContainer>
  )
}