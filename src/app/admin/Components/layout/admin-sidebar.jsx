// src/app/admin/Components/layout/admin-sidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { AnimatedContainer } from '../animation-component'

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

export default function AdminSidebar({ isOpen, notificationsCount }) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const leaveTimerRef = useRef(null)

  // Обработчик входа курсора
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
    }
    setIsHovered(true)
  }

  // Обработчик выхода курсора с задержкой
  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 150) // Короткая задержка для плавности
  }

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
      }
    }
  }, [])

  const shouldExpand = isOpen || isHovered

  return (
    <div 
      className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
        shouldExpand ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`bg-gradient-to-b from-white to-gray-50/80 shadow-xl min-h-screen border-r border-gray-200/50 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        shouldExpand ? 'w-64' : 'w-20'
      }`}>
        
        {/* Навигационное меню */}
        <nav className="p-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-xl transition-all duration-200 ease-out group relative overflow-hidden ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500/95 to-purple-600/95 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-md'
                  } px-3 py-3 ${shouldExpand ? 'justify-start' : 'justify-center'}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Анимированный фон при наведении */}
                  {hoveredItem === item.id && pathname !== item.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl"></div>
                  )}
                  
                  {/* Иконка - всегда на своем месте */}
                  <span className={`text-lg transition-all duration-200 ease-out group-hover:scale-110 ${
                    pathname === item.href ? 'text-white' : 'text-gray-600'
                  } ${shouldExpand ? 'mr-3' : 'mr-0'}`}>
                    {item.icon}
                  </span>
                  
                  {/* Текст - скрыт/показан через opacity и width */}
                  <span 
                    className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out ${
                      pathname === item.href ? 'text-white' : 'text-gray-700'
                    } ${
                      shouldExpand 
                        ? 'opacity-100 w-auto ml-0' 
                        : 'opacity-0 w-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Индикатор активной страницы */}
                  {pathname === item.href && (
                    <div className={`absolute transition-all duration-300 ${
                      shouldExpand ? 'right-4' : 'right-2'
                    } top-1/2 transform -translate-y-1/2`}>
                      <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-pulse shadow-sm"></div>
                    </div>
                  )}
                  
                  {/* Бейдж уведомлений */}
                  {notificationsCount > 0 && (item.href === '/admin/orders' || item.href === '/admin/reviews') && (
                    <div className={`absolute ${
                      shouldExpand ? 'right-10' : 'right-1'
                    } top-1/2 transform -translate-y-1/2`}>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  )}

                  {/* Подсказка при наведении в компактном режиме */}
                  {!shouldExpand && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Подвал сайдбара - только при раскрытии */}
        {shouldExpand && (
          <div className="absolute bottom-4 left-4 right-4 opacity-0 animate-fade-in">
            <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/30">
              <p className="text-xs text-gray-500 text-center">
                Cake App Admin v1.0
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Невидимая зона для плавного перехода */}
      {isHovered && !isOpen && (
        <div 
          className="absolute top-0 right-0 h-full w-4 transform translate-x-full"
          onMouseEnter={handleMouseEnter}
        />
      )}
    </div>
  )
}