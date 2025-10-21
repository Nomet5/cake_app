// components/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'Дашборд', icon: '📊' },
  { href: '/admin/users', label: 'Пользователи', icon: '👥' },
  { href: '/admin/chefs', label: 'Повара', icon: '👨‍🍳' },
  { href: '/admin/products', label: 'Товары', icon: '🍰' },
  { href: '/admin/orders', label: 'Заказы', icon: '📦' },
  { href: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}