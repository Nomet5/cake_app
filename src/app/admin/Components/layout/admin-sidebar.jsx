// src/app/admin/Components/layout/admin-sidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', label: 'Дашборд', icon: '📊' },
  { href: '/admin/users', label: 'Пользователи', icon: '👥' },
  { href: '/admin/chefs', label: 'Повара', icon: '👨‍🍳' },
  { href: '/admin/products', label: 'Товары', icon: '🍰' },
  { href: '/admin/categories', label: 'Категории', icon: '📁' },
  { href: '/admin/orders', label: 'Заказы', icon: '📦' },
  { href: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
  { href: '/admin/promotions', label: 'Акции', icon: '🎯' },
]

export default function AdminSidebar({ isOpen }) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)

  if (!isOpen) return null

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl min-h-screen border-r border-gray-200 animate-slide-in-left">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">CA</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Админ-панель</h2>
            <p className="text-xs text-gray-500">Cake App</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden animate-fade-in ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Анимированный фон при наведении */}
                {hoveredItem === item.href && pathname !== item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-xl"></div>
                )}
                
                <span className={`text-xl mr-4 transition-transform duration-300 group-hover:scale-110 ${
                  pathname === item.href ? 'text-white' : 'text-gray-600'
                }`}>
                  {item.icon}
                </span>
                
                <span className={`font-medium relative z-10 ${
                  pathname === item.href ? 'text-white' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
                
                {/* Индикатор активной страницы */}
                {pathname === item.href && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {/* Стрелка для активной страницы */}
                {pathname === item.href && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white"></div>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Статистика в сайдбаре */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-scale-in">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Быстрая статистика</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Активных заказов:</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between">
              <span>Новых пользователей:</span>
              <span className="font-semibold text-green-600">5</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}