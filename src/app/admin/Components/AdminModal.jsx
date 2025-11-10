// components/AdminModal.jsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { AnimatedContainer, AnimatedButton } from './animation-component'

export const AdminModal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showMaximizeButton = false,
  className = '',
  position = 'center',
  triggerRef, // Ref на элемент, который открывает модальное окно
  ...props
}) => {
  const [isClosing, setIsClosing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const modalRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Функция закрытия с анимацией
  const handleClose = useCallback(() => {
    setIsClosing(true)
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    
    closeTimeoutRef.current = setTimeout(() => {
      onClose?.()
      setIsClosing(false)
      setIsMaximized(false)
    }, 300)
  }, [onClose])

  // Переключение полноэкранного режима
  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  // Обработчик клика вне модального окна
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что клик был не по модальному окну и не по триггеру
      if (
        modalRef.current && 
        !modalRef.current.contains(event.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target)
      ) {
        handleClose()
      }
    }

    if (isOpen && closeOnBackdropClick) {
      // Используем setTimeout чтобы событие сработало после обработчика кнопки
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, closeOnBackdropClick, handleClose, triggerRef])

  // Обработчик Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, handleClose])

  // Размеры модального окна
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }

  // Позиционирование
  const positionClasses = {
    center: 'items-center justify-center',
    topRight: 'items-start justify-end',
    topLeft: 'items-start justify-start',
    bottomRight: 'items-end justify-end',
    bottomLeft: 'items-end justify-start'
  }

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Модальное окно */}
      <div 
        className={`
          fixed inset-0 z-[9999] flex p-4 pointer-events-none
          ${positionClasses[position]}
        `}
      >
        <div
          ref={modalRef}
          className={`
            relative bg-white rounded-2xl shadow-2xl pointer-events-auto
            transform-gpu transition-all duration-300 ease-in-out
            flex flex-col max-h-[90vh] 
            ${isMaximized ? 'w-full h-full m-4 rounded-xl' : sizeClasses[size]}
            ${isOpen && !isClosing 
              ? 'animate-modal-in opacity-100 scale-100 translate-y-0' 
              : 'animate-modal-out opacity-0 scale-95 translate-y-4'
            }
            ${className}
          `}
          {...props}
        >
          {/* Кнопка закрытия - теперь в правом верхнем углу без заголовка */}
          {showCloseButton && (
            <div className="absolute top-4 right-4 z-10">
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all border border-gray-200/60 bg-white/80 backdrop-blur-sm"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </AnimatedButton>
            </div>
          )}

          {/* Контент */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

// Хук для удобного использования модального окна
export const useAdminModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const triggerRef = useRef(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef
  }
}