'use client'

import { motion } from 'framer-motion'
import FadeIn from '../ui/FadeIn'
import HoverScale from '../ui/HoverScale'
import Image from 'next/image'

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
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <motion.h2
                        className="text-2xl font-bold text-bakery-1150 mb-6 font-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Быстрые категории
                    </motion.h2>

                    <div className="relative">
                        {/* Горизонтальный скролл с анимацией */}
                        <motion.div
                            className="flex gap-4 overflow-x-auto p-4 scrollbar-hide"
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
                                        <button className="flex flex-col items-center justify-center p-4 bg-bakery-50 rounded-2xl border border-bakery-200 hover:border-bakery-400 transition-all duration-200 min-w-[120px] group relative overflow-hidden">
                                            {/* Фотография категории */}
                                            <div className="w-16 h-16 mb-2 rounded-full overflow-hidden border-2 border-bakery-200 group-hover:border-bakery-400 transition-colors">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => {
                                                        // Fallback если изображение не загрузилось
                                                        e.target.style.display = 'none'
                                                        e.target.nextSibling.style.display = 'flex'
                                                    }}
                                                />
                                                {/* Fallback иконка */}
                                                <div className="w-full h-full bg-bakery-100 flex items-center justify-center text-bakery-600 text-lg hidden">
                                                    {getCategoryIcon(category.name)}
                                                </div>
                                            </div>

                                            <span className="text-sm font-medium text-bakery-1100 text-center font-body">
                                                {category.name}
                                            </span>
                                            <span className="text-xs text-bakery-1050 mt-1">
                                                {category.count}
                                            </span>
                                        </button>
                                    </HoverScale>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Градиент для индикации скролла */}
                        <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
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