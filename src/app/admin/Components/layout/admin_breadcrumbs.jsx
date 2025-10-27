// src/app/admin/Components/admin_breadcrumbs.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(segment => segment)

  const pathLabels = {
    'admin': 'Главная',
    'dashboard': 'Дашборд',
    'users': 'Пользователи',
    'chefs': 'Повара',
    'products': 'Товары',
    'categories': 'Категории',
    'orders': 'Заказы',
    'reviews': 'Отзывы',
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    let label = pathLabels[segment] || segment
    
    return {
      href,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      isLast: index === pathSegments.length - 1
    }
  })

  // Добавляем главную страницу
  if (!breadcrumbs[0] || breadcrumbs[0].label !== 'Главная') {
    breadcrumbs.unshift({
      href: '/admin',
      label: 'Главная',
      isLast: false
    })
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 animate-fade-in">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
          {breadcrumb.isLast ? (
            <span className="text-gray-900 font-medium bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              {breadcrumb.label}
            </span>
          ) : (
            <>
              <Link 
                href={breadcrumb.href}
                className="hover:text-blue-600 transition-all duration-300 hover-lift px-2 py-1 rounded-lg"
              >
                {breadcrumb.label}
              </Link>
              <span className="mx-2 text-gray-400 animate-pulse">/</span>
            </>
          )}
        </div>
      ))}
    </nav>
  )
}