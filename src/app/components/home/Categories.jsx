'use client'

import { motion } from 'framer-motion'
import FadeIn from '../common/FadeIn'
import HoverScale from '../common/HoverScale'
import Image from 'next/image'
import { useRef } from 'react'

const Categories = () => {
    const categories = [
        {
            name: 'Торты',
            image: '/images/categories/cake.png',
            count: 45
        },
        {
            name: 'Пироги',
            image: '/images/categories/pies.png',
            count: 67
        },
        {
            name: 'Хлеб',
            image: '/images/categories/bread.png',
            count: 34
        },
        {
            name: 'Десерты',
            image: '/images/categories/desserts.png',
            count: 89
        },
        {
            name: 'Завтраки',
            image: '/images/categories/breakfast.png',
            count: 23
        },
        {
            name: 'Сладкая выпечка',
            image: '/images/categories/sweets.png',
            count: 56
        },
        {
            name: 'Праздник',
            image: '/images/categories/celebration.png',
            count: 41
        },
        {
            name: 'Вегетарианское',
            image: '/images/categories/vegan.png',
            count: 34
        },
    ]

    const scrollContainerRef = useRef(null)

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    // Анимация для контейнера
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    // Анимация для элементов
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <FadeIn>
            <section className="py-16 bg-bakery-100">
                <div className="container mx-auto px-4">
                    <motion.h2
                        className="text-3xl font-bold text-bakery-1150 mb-8 font-display text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Быстрые категории
                    </motion.h2>

                    <div className="relative">
                        {/* Кнопки навигации для десктопа */}
                        <div className="hidden lg:block">
                            <button
                                onClick={scrollLeft}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-bakery-600 hover:text-bakery-700 w-10 h-10 rounded-full shadow-lg border border-bakery-200 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-bakery-600 hover:text-bakery-700 w-10 h-10 rounded-full shadow-lg border border-bakery-200 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Горизонтальный скролл с кастомным скроллбаром */}
                        <motion.div
                            ref={scrollContainerRef}
                            className="flex gap-6 overflow-x-auto p-4 scroll-container"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {categories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className="flex-shrink-0"
                                >
                                    <HoverScale scale={1.05}>
                                        <button className="flex flex-col items-center justify-center p-6 bg-bakery-50 rounded-2xl border border-bakery-200 hover:border-bakery-400 transition-all duration-200 min-w-[160px] group relative overflow-hidden shadow-bakery-soft hover:shadow-bakery-medium">
                                            {/* Фотография категории */}
                                            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-bakery-200 group-hover:border-bakery-400 transition-colors">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        // Fallback если изображение не загрузилось
                                                        e.target.style.display = 'none'
                                                        e.target.nextSibling.style.display = 'flex'
                                                    }}
                                                />
                                                {/* Fallback иконка */}
                                                <div className="w-full h-full bg-bakery-100 flex items-center justify-center text-bakery-600 text-3xl hidden">
                                                    {getCategoryIcon(category.name)}
                                                </div>
                                            </div>

                                            <span className="text-base font-semibold text-bakery-1100 text-center font-body">
                                                {category.name}
                                            </span>
                                            <span className="text-sm text-bakery-1050 mt-2 font-medium">
                                                {category.count} товаров
                                            </span>
                                        </button>
                                    </HoverScale>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </FadeIn>
    )
}

// Функция для fallback иконок
const getCategoryIcon = (categoryName) => {
    const icons = {
        'Торты': '🎂',
        'Пироги': '🥧',
        'Хлеб': '🍞',
        'Десерты': '🍰',
        'Завтраки': '🥐',
        'Сладкая выпечка': '🍪',
        'Праздник': '🎉',
        'Веганское': '🌱'
    }
    return icons[categoryName] || '🍽️'
}

export default Categories