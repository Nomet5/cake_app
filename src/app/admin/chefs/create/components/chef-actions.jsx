// app/admin/chefs/[id]/components/chef-actions.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteChefModal from '../../components/delete-chef-modal'

export default function ChefActions({ chef }) {
  const [deleteModal, setDeleteModal] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)
  
  const handleDeleteSuccess = () => {
    window.location.href = '/admin/chefs'
  }

  const handleStatusToggle = async () => {
    // Здесь будет логика переключения статуса
    console.log('Toggle status for chef:', chef.id)
  }

  const buttons = [
    {
      key: 'edit',
      label: 'Редактировать',
      href: `/admin/chefs/${chef.id}/edit`,
      color: 'blue',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delay: 0
    },
    {
      key: 'status',
      label: chef.isActive ? 'Заблокировать' : 'Активировать',
      onClick: handleStatusToggle,
      color: chef.isActive ? 'orange' : 'green',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {chef.isActive ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          )}
        </svg>
      ),
      delay: 0.1
    },
    {
      key: 'delete',
      label: 'Удалить',
      onClick: () => setDeleteModal(true),
      color: 'red',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      delay: 0.2
    }
  ]

  const getButtonClasses = (color, isHovered) => {
    const baseClasses = "px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 flex items-center group relative overflow-hidden"
    
    const colorClasses = {
      blue: `bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 ${isHovered ? 'shadow-lg shadow-blue-200' : 'shadow-lg'}`,
      green: `bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 ${isHovered ? 'shadow-lg shadow-green-200' : 'shadow-lg'}`,
      orange: `bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 ${isHovered ? 'shadow-lg shadow-orange-200' : 'shadow-lg'}`,
      red: `bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 ${isHovered ? 'shadow-lg shadow-red-200' : 'shadow-lg'}`
    }

    return `${baseClasses} ${colorClasses[color]}`
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {buttons.map((button, index) => (
          <div
            key={button.key}
            className="relative group"
            onMouseEnter={() => setHoveredButton(button.key)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Для кнопок со ссылками - оборачиваем всю кнопку в Link */}
            {button.href ? (
              <Link
                href={button.href}
                className={getButtonClasses(button.color, hoveredButton === button.key)}
                style={{ animationDelay: `${button.delay}s` }}
                prefetch={false}
              >
                {/* Анимированный фон */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Иконка с анимацией */}
                <span className="relative z-10 mr-2 transition-transform duration-300 group-hover:scale-110">
                  {button.icon}
                </span>
                
                {/* Текст */}
                <span className="relative z-10 font-semibold">
                  {button.label}
                </span>
              </Link>
            ) : (
              /* Для обычных кнопок - используем button */
              <button
                onClick={button.onClick}
                className={getButtonClasses(button.color, hoveredButton === button.key)}
                style={{ animationDelay: `${button.delay}s` }}
                type="button"
              >
                {/* Анимированный фон */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Иконка с анимацией */}
                <span className="relative z-10 mr-2 transition-transform duration-300 group-hover:scale-110">
                  {button.icon}
                </span>
                
                {/* Текст */}
                <span className="relative z-10 font-semibold">
                  {button.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Дополнительные ссылки */}
      <div className="flex flex-wrap gap-4 mt-3 text-sm">

        <Link
          href={`/admin/chefs/${chef.id}/dishes`}
          className="text-green-600 hover:text-green-800 transition-colors duration-200 flex items-center group"
        >
          <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Блюда повара
        </Link>

        <Link
          href={`/admin/chefs/${chef.id}/orders`}
          className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center group"
        >
          <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Заказы
        </Link>
      </div>

      {/* Модальное окно удаления */}
      {deleteModal && (
        <DeleteChefModal
          chef={chef}
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  )
}