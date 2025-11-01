// src/app/admin/Components/layout/admin-breadcrumbs.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminBreadcrumbs() {
  const pathname = usePathname()
  
  // Функция для генерации хлебных крошек на основе пути
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(path => path)
    
    const breadcrumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/')
      const isLast = index === paths.length - 1
      
      // Преобразуем путь в читаемое название
      let label = getLabelForPath(path, paths, index)

      return {
        href: isLast ? null : href,
        label,
        isLast
      }
    })

    // Добавляем главную страницу
    breadcrumbs.unshift({
      href: '/admin',
      label: 'Главная',
      isLast: false
    })

    return breadcrumbs
  }

  // Функция для получения читаемого названия пути
  const getLabelForPath = (path, paths, index) => {
    const prevPath = index > 0 ? paths[index - 1] : null
    
    // Обработка для разных разделов админки
    switch (path) {
      case 'admin':
        return 'Панель управления'
      
      // Пользователи
      case 'users':
        return 'Пользователи'
      case 'create':
        return prevPath === 'users' ? 'Создание пользователя' : 'Создание'
      case 'edit':
        return 'Редактирование'
      
      // Категории
      case 'categories':
        return 'Категории'
      case 'create':
        return prevPath === 'categories' ? 'Создание категории' : 'Создание'
      
      // Повара
      case 'chefs':
        return 'Повара'
      case 'create':
        return prevPath === 'chefs' ? 'Создание повара' : 'Создание'
      
      // Уведомления
      case 'notifications':
        return 'Уведомления'
      
      // Заказы
      case 'orders':
        return 'Заказы'
      
      // Товары
      case 'products':
        return 'Товары'
      case 'create':
        return prevPath === 'products' ? 'Создание товара' : 'Создание'
      
      // Отзывы
      case 'reviews':
        return 'Отзывы'
      
      // Динамические ID
      default:
        // Если это ID (число), показываем контекстное название
        if (!isNaN(path) && prevPath) {
          return getLabelForId(prevPath)
        }
        // Для неизвестных путей - капитализируем первую букву
        return path.charAt(0).toUpperCase() + path.slice(1)
    }
  }

  // Функция для получения названия для ID
  const getLabelForId = (prevPath) => {
    switch (prevPath) {
      case 'users':
        return 'Профиль пользователя'
      case 'categories':
        return 'Категория'
      case 'chefs':
        return 'Профиль повара'
      case 'orders':
        return 'Детали заказа'
      case 'products':
        return 'Товар'
      case 'reviews':
        return 'Отзыв'
      case 'notifications':
        return 'Уведомление'
      default:
        return 'Детали'
    }
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg 
                className="h-4 w-4 text-gray-400 flex-shrink-0 mx-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            )}
            {crumb.isLast ? (
              <span className="text-gray-900 font-medium truncate max-w-32">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 truncate max-w-32"
                title={crumb.label}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}