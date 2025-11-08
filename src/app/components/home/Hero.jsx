'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '../common/Button'
import FadeIn from '../common/FadeIn'

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
    }

    return (
        <section className="relative  py-20 overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-bakery-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-bakery-400 rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-bakery-600 rounded-full opacity-25 animate-ping"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Заголовок с анимацией */}
                    <FadeIn>
                        <h1 className="text-4xl md:text-6xl font-bold text-bakery-1150 mb-6 font-display leading-tight">
                            Домашняя еда с{' '}
                            <motion.span
                                className="bg-clip-text  text-bakery-400 "
                                animate={{
                                    backgroundPosition: ['0%', '100%', '0%']
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                style={{
                                    backgroundSize: '200% 100%'
                                }}
                            >
                                душой
                            </motion.span>
                        </h1>
                    </FadeIn>

                    {/* Подзаголовок */}
                    <FadeIn delay={0.2}>
                        <p className="text-xl text-bakery-1100 mb-8 leading-relaxed font-body">
                            Настоящий вкус от пекарей вашего города.
                            Каждый продукт – это история, приготовленная с любовью
                        </p>
                    </FadeIn>

                    {/* Поиск и CTA */}
                    <FadeIn delay={0.4}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                                <motion.input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder='Ищите "торт на день рождения"...'
                                    className="w-full px-6 py-4 rounded-2xl border border-bakery-200 shadow-sm focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body text-bakery-1100 placeholder-bakery-1050"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <motion.button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-bakery-400 text-white p-2 rounded-xl hover:bg-bakery-500 transition-colors shadow-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    🔍
                                </motion.button>
                            </form>
                        </div>
                    </FadeIn>

                    {/* Кнопки действий */}
                    <FadeIn delay={0.6}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/catalog">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button size="lg" className="min-w-[200px]">
                                        Найти угощения
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/bakers">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button variant="outline" size="lg" className="min-w-[200px]">
                                        Смотреть всех пекарей
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}

export default Hero