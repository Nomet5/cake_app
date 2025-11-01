// components/ux/animations.jsx
'use client'

import { useEffect, useRef, useState } from 'react'

// Базовый анимированный контейнер
export const AnimatedContainer = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  duration = 'normal',
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(entry.target)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, triggerOnce])

  const animationClasses = {
    fadeInUp: 'animate-fade-in-up',
    fadeInDown: 'animate-fade-in-down',
    fadeInLeft: 'animate-fade-in-left',
    fadeInRight: 'animate-fade-in-right',
    scaleIn: 'animate-scale-in',
    slideInUp: 'animate-slide-in-up',
    slideInDown: 'animate-slide-in-down'
  }

  const durationClasses = {
    fast: 'duration-fast',
    normal: 'duration-normal',
    slow: 'duration-slow'
  }

  return (
    <div
      ref={ref}
      className={`
        ${isVisible ? animationClasses[animation] : 'opacity-0'}
        ${durationClasses[duration]}
        ${className}
      `}
      style={{
        animationDelay: isVisible ? `${delay}ms` : '0ms'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// Компонент для анимированных списков
export const AnimatedList = ({ 
  items, 
  renderItem,
  animation = 'fadeInUp',
  staggerDelay = 100,
  className = '',
  ...props 
}) => {
  return (
    <div className={`stagger-animation ${className}`} {...props}>
      {items.map((item, index) => (
        <AnimatedContainer
          key={item.id || index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {renderItem(item, index)}
        </AnimatedContainer>
      ))}
    </div>
  )
}

// Анимированная кнопка
export const AnimatedButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-xl transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-200",
    ghost: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props} // Убедитесь, что здесь нет лишних пропсов
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="loader-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>Загрузка...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Анимированная карточка
export const AnimatedCard = ({ 
  children, 
  hoverable = true,
  animated = true,
  className = '',
  ...props 
}) => {
  return (
    <AnimatedContainer animation="fadeInUp" duration="normal">
      <div
        className={`
          card
          ${hoverable ? 'card-hover' : ''}
          ${animated ? 'transform-3d' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </AnimatedContainer>
  )
}

// Компонент для скелетон-загрузки
export const SkeletonLoader = ({ 
  type = 'text',
  className = ''
}) => {
  const types = {
    text: 'h-4 rounded skeleton',
    title: 'h-6 rounded skeleton',
    card: 'h-48 rounded-xl skeleton',
    avatar: 'w-12 h-12 rounded-full skeleton',
    button: 'h-10 rounded-xl skeleton'
  }

  return (
    <div className={`${types[type]} ${className}`} />
  )
}

// Плавающий элемент
export const FloatingElement = ({ 
  children,
  speed = 'normal',
  className = ''
}) => {
  const speedClasses = {
    slow: 'animate-float-slow',
    normal: 'animate-float',
    fast: 'animate-float'
  }

  return (
    <div className={`${speedClasses[speed]} ${className}`}>
      {children}
    </div>
  )
}

// Компоненты для таблиц
export const AnimatedTableContainer = ({ 
  children, 
  delay = 0,
  className = '',
  ...props 
}) => {
  return (
    <div
      className={`
        animate-fade-in-up
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  )
}

export const AnimatedTableRow = ({ 
  children,
  index = 0,
  delay = 0,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay + (index * 50))

    return () => clearTimeout(timer)
  }, [delay, index])

  return (
    <tr
      className={`
        transition-all duration-500 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
        hover:bg-blue-50/30
        ${className}
      `}
      style={{
        transitionDelay: `${delay + (index * 50)}ms`
      }}
      {...props}
    >
      {children}
    </tr>
  )
}

export const TableActionButton = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 ease-out inline-flex items-center justify-center focus:outline-none focus:ring-2"
  
  const variants = {
    primary: "text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-200 px-3 py-1 rounded",
    success: "text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-200 px-3 py-1 rounded",
    danger: "text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-200 px-3 py-1 rounded",
    secondary: "text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:ring-gray-200 px-3 py-1 rounded"
  }

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2000,
  className = '',
  format = true
}) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      let start = 0
      const increment = value / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [value, duration, isVisible])

  const displayValue = format ? count.toLocaleString() : count

  return (
    <span ref={ref} className={`font-bold ${className}`}>
      {displayValue}
    </span>
  )
}

export const SubtleHover = ({ 
  children,
  className = '',
  ...props 
}) => {
  return (
    <div
      className={`
        transition-all duration-300 ease-out
        hover:scale-105
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}