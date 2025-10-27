// src/app/admin/Components/admin_breadcrumbs.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminBreadcrumbs() { // Named export
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
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {breadcrumb.isLast ? (
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <>
              <Link 
                href={breadcrumb.href}
                className="hover:text-blue-600 transition-colors"
              >
                {breadcrumb.label}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
        </div>
      ))}
    </nav>
  )
}

