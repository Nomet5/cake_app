// app/admin/users/components/user-actions.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteUserModal from './DeleteUserModal'

export default function UserActions({ user }) {
  const [deleteModal, setDeleteModal] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)

  const handleDeleteSuccess = () => {
    window.location.href = '/admin/users'
  }

  const buttons = [
    {
      key: 'edit',
      label: 'Редактировать',
      href: `/admin/users/${user.id}/edit`,
      color: 'blue',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delay: 0
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
      delay: 0.1
    }
  ]

  const getButtonClasses = (color, isHovered) => {
    const baseClasses = "px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover-lift shadow-lg flex items-center group relative overflow-hidden animate-scale-in"
    
    const colorClasses = {
      blue: `bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 ${isHovered ? 'shadow-blue-200' : ''}`,
      red: `bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 ${isHovered ? 'shadow-red-200' : ''}`
    }

    return `${baseClasses} ${colorClasses[color]}`
  }

  return (
    <>
      <div className="flex space-x-3 animate-fade-in">
        {buttons.map((button, index) => (
          <div
            key={button.key}
            className={getButtonClasses(button.color, hoveredButton === button.key)}
            style={{ animationDelay: `${button.delay}s` }}
            onMouseEnter={() => setHoveredButton(button.key)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            {/* Светящийся эффект при наведении */}
            {hoveredButton === button.key && (
              <div className="absolute inset-0 rounded-xl bg-current opacity-20 animate-pulse"></div>
            )}
            
            {/* Иконка с анимацией */}
            <span className="relative z-10 mr-2 transition-transform duration-300 group-hover:scale-110">
              {button.icon}
            </span>
            
            {/* Текст */}
            <span className="relative z-10 font-semibold">
              {button.label}
            </span>
            
            {/* Эффект волны при клике */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 group-active:animate-ping-slow transition-all duration-500"></div>
            </div>

            {/* Рендерим либо Link либо button */}
            {button.href ? (
              <Link
                href={button.href}
                className="absolute inset-0 rounded-xl"
                prefetch={false}
              />
            ) : (
              <button
                onClick={button.onClick}
                className="absolute inset-0 rounded-xl"
              />
            )}
          </div>
        ))}
      </div>

      {/* Дополнительные действия (можно развернуть) */}
      <div className="mt-3 flex space-x-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Link
          href={`/admin/users/${user.id}`}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group"
        >
          <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Просмотр профиля
        </Link>
        
        {user.chefProfile && (
          <Link
            href={`/admin/chefs/${user.chefProfile.id}`}
            className="text-sm text-green-600 hover:text-green-800 transition-colors duration-200 flex items-center group"
          >
            <svg className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Профиль повара
          </Link>
        )}
      </div>

      <DeleteUserModal
        user={user}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}