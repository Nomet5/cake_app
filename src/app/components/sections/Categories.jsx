'use client'

import { motion } from 'framer-motion'
import FadeIn from '../ui/FadeIn'
import HoverScale from '../ui/HoverScale'

const Categories = () => {
    const categories = [
        { name: 'Торты', icon: '🎂', count: 45 },
        { name: 'Пироги', icon: '🥧', count: 67 },
        { name: 'Хлеб', icon: '🍞', count: 34 },
        { name: 'Десерты', icon: '🍰', count: 89 },
        { name: 'Завтраки', icon: '🥐', count: 23 },
        { name: 'Сладкая выпечка', icon: '🍪', count: 56 },
        { name: 'Праздник', icon: '🎉', count: 41 },
        { name: 'Веганское', icon: '🌱', count: 34 },
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
                            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
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
                                        <button className="flex flex-col items-center justify-center p-4 bg-bakery-50 rounded-2xl border border-bakery-200 hover:border-bakery-400 transition-all duration-200 min-w-[100px] group">
                                            <motion.span
                                                className="text-2xl mb-2"
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                {category.icon}
                                            </motion.span>
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

export default Categories