// app/admin/products/[id]/components/product-actions.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import DeleteProductModal from '../../Components/DeleteProductModal'
import { 
  AnimatedButton,
  AnimatedContainer 
} from "../../Components/animation-component"

export default function ProductActions({ product }) {
  const [deleteModal, setDeleteModal] = useState(false)

  const handleDeleteSuccess = () => {
    window.location.href = '/admin/products'
  }

  const mainActions = [
    {
      key: 'edit',
      label: 'Редактировать',
      href: `/admin/products/${product.id}/edit`,
      variant: 'primary',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      delay: 0
    },
    {
      key: 'view',
      label: 'Просмотр на сайте',
      href: `/products/${product.id}`,
      variant: 'success',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      delay: 100
    },
    {
      key: 'delete',
      label: 'Удалить',
      onClick: () => setDeleteModal(true),
      variant: 'danger',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      delay: 200
    }
  ]

  const quickLinks = [
    {
      key: 'analytics',
      label: 'Детальная аналитика',
      href: `/admin/products/${product.id}/analytics`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-purple-600 hover:text-purple-800'
    },
    {
      key: 'chef',
      label: 'Профиль повара',
      href: `/admin/chefs/${product.chef?.id}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      color: 'text-orange-600 hover:text-orange-800'
    },
    {
      key: 'orders',
      label: 'История заказов',
      href: `/admin/products/${product.id}/orders`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'text-indigo-600 hover:text-indigo-800'
    }
  ]

  return (
    <>
      <AnimatedContainer animation="fadeInUp" delay={400}>
        <div className="flex flex-wrap gap-3">
          {mainActions.map((action, index) => (
            <AnimatedButton
              key={action.key}
              variant={action.variant}
              size="md"
              onClick={action.onClick}
              className="flex items-center space-x-2 min-w-[160px] justify-center group relative overflow-hidden"
              style={{ animationDelay: `${action.delay}ms` }}
            >
              {/* Иконка с анимацией */}
              <span className="transition-transform duration-300 group-hover:scale-110">
                {action.icon}
              </span>
              
              {/* Текст */}
              <span className="font-semibold">
                {action.label}
              </span>

              {/* Для ссылочных кнопок оборачиваем в Link */}
              {action.href ? (
                <Link
                  href={action.href}
                  className="absolute inset-0"
                  prefetch={false}
                  target={action.key === 'view' ? '_blank' : undefined}
                />
              ) : null}
            </AnimatedButton>
          ))}
        </div>
      </AnimatedContainer>

      {/* Дополнительные ссылки */}
      <AnimatedContainer animation="fadeInUp" delay={500}>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {quickLinks.map((link, index) => (
            <Link
              key={link.key}
              href={link.href}
              className={`${link.color} transition-colors duration-200 flex items-center group`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <span className="mr-2 transition-transform duration-300 group-hover:scale-110">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </AnimatedContainer>

      {/* Информационная панель */}
      <AnimatedContainer animation="fadeInUp" delay={600} className="mt-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-900">Быстрые действия</div>
                <div className="text-xs text-blue-700">
                  Управление продуктом и просмотр статистики
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                ID: {product.id}
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Модальное окно удаления */}
      <DeleteProductModal
        product={product}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}