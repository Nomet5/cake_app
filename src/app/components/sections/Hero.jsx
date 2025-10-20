'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../ui/Button'

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
        <section className="relative bg-gradient-to-br from-bakery-50 via-bakery-100 to-bakery-150 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Заголовок */}
                    <h1 className="text-4xl md:text-6xl font-bold text-bakery-1150 mb-6 font-display leading-tight">
                        Домашняя еда с{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bakery-400 to-bakery-600">
                            душой
                        </span>
                    </h1>

                    {/* Подзаголовок */}
                    <p className="text-xl text-bakery-1100 mb-8 leading-relaxed font-body">
                        Настоящий вкус от пекарей вашего города.
                        Каждый продукт – это история, приготовленная с любовью
                    </p>

                    {/* Поиск и CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Ищите "торт на день рождения"...'
                                className="w-full px-6 py-4 rounded-2xl border border-bakery-200 shadow-sm focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body text-bakery-1100 placeholder-bakery-1050"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-bakery-400 text-white p-2 rounded-xl hover:bg-bakery-500 transition-colors shadow-sm"
                            >
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/catalog">
                            <Button size="lg" className="min-w-[200px]">
                                Найти угощения
                            </Button>
                        </Link>
                        <Link href="/bakers">
                            <Button variant="outline" size="lg" className="min-w-[200px]">
                                Смотреть всех пекарей
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero