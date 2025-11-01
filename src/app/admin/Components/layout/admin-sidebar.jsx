// src/app/admin/Components/layout/admin-sidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AnimatedContainer, AnimatedList } from '../animation-component'

const menuItems = [
  { id: 1, href: '/admin', label: 'Дашборд', icon: '📊' },
  { id: 2, href: '/admin/users', label: 'Пользователи', icon: '👥' },
  { id: 3, href: '/admin/chefs', label: 'Повара', icon: '👨‍🍳' },
  { id: 4, href: '/admin/products', label: 'Товары', icon: '🍰' },
  { id: 5, href: '/admin/categories', label: 'Категории', icon: '📁' },
  { id: 6, href: '/admin/orders', label: 'Заказы', icon: '📦' },
  { id: 7, href: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
  { id: 8, href: '/admin/promotions', label: 'Акции', icon: '🎯' },
]

export default function AdminSidebar({ isOpen }) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)

  if (!isOpen) return null

  return (
    <AnimatedContainer 
      animation="fadeInLeft"
      duration="slow"
      className="w-64 bg-gradient-to-b from-white to-gray-50/80 shadow-xl min-h-screen border-r border-gray-200/50 backdrop-blur-sm admin-transition"
    >
      {/* Заголовок сайдбара */}
      <div className="p-6 border-b border-gray-200/50">
        <AnimatedContainer animation="scaleIn" delay={150} duration="slow">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500/90 to-purple-600/90 rounded-xl flex items-center justify-center shadow-lg hover-glow transition-all duration-700 ease-out">
              <span className="text-white font-bold text-lg">CA</span>
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-gray-900 text-lg">Админ-панель</h2>
              <p className="text-xs text-gray-500/80">Cake App</p>
            </div>
          </div>
        </AnimatedContainer>
      </div>
      
      {/* Навигационное меню */}
      <nav className="p-4">
        <AnimatedList
          items={menuItems}
          animation="fadeInLeft"
          staggerDelay={80}
          duration="normal"
          className="space-y-1"
          renderItem={(item, index) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-500 ease-out group relative overflow-hidden nav-item ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500/95 to-purple-600/95 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02] nav-item-active'
                    : 'text-gray-700 hover:bg-gray-100/80 hover:scale-[1.02] hover:shadow-md'
                }`}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Анимированный фон при наведении */}
                {hoveredItem === item.href && pathname !== item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl transition-all duration-500 ease-out"></div>
                )}
                
                {/* Иконка */}
                <span className={`text-lg mr-3 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12 ${
                  pathname === item.href ? 'text-white' : 'text-gray-600'
                }`}>
                  {item.icon}
                </span>
                
                {/* Текст */}
                <span className={`font-medium relative z-10 transition-all duration-300 ease-out ${
                  pathname === item.href ? 'text-white' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
                
                {/* Индикатор активной страницы */}
                {pathname === item.href && (
                  <AnimatedContainer 
                    animation="scaleIn" 
                    duration="ultra-slow"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse-gentle shadow-sm"></div>
                  </AnimatedContainer>
                )}
                
                {/* Стрелка для активной страницы */}
                {pathname === item.href && (
                  <AnimatedContainer 
                    animation="fadeInRight"
                    duration="slow"
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-0 h-0 border-t-3 border-b-3 border-l-3 border-transparent border-l-white/90 transition-all duration-300 ease-out"></div>
                  </AnimatedContainer>
                )}

                {/* Светящийся эффект для активного элемента */}
                {pathname === item.href && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 animate-pulse-gentle"></div>
                )}
              </Link>
            </li>
          )}
        />
      </nav>
    </AnimatedContainer>
  )
}