// src/app/favorites/page.js
'use client'

import { useState, useMemo } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Link from 'next/link'
import { useFavorites } from '../components/context/FavoritesContext'
import ProductCard from '../components/product/ProductCard'
import FadeIn from '../components/common/FadeIn'
import TransitionWrapper from '../components/common/TransitionWrapper'

// Используем те же mock данные что и в catalog
const mockProducts = [
    {
        id: 1,
        name: 'Шоколадный торт "Вечер в Париже"',
        price: 2400,
        rating: 4.9,
        reviews: 127,
        baker: 'Пекарня "У Марии"',
        weight: '2.5 кг',
        servings: '12-14 порций',
        category: 'Торты',
        dietary: [],
        isPopular: true
    },
    {
        id: 2,
        name: 'Медовик классический',
        price: 1800,
        oldPrice: 2000,
        rating: 4.7,
        reviews: 89,
        baker: 'Пекарня "У Марии"',
        weight: '2 кг',
        servings: '10-12 порций',
        category: 'Торты',
        dietary: [],
        isNew: true
    },
    {
        id: 3,
        name: 'Яблочный пирог с корицей',
        price: 850,
        rating: 4.6,
        reviews: 45,
        baker: 'Домашняя кухня "Вкусно"',
        weight: '1.2 кг',
        servings: '6-8 порций',
        category: 'Пироги',
        dietary: ['Без яиц']
    },
    {
        id: 4,
        name: 'Чизкейк Нью-Йорк',
        price: 2200,
        rating: 4.8,
        reviews: 67,
        baker: 'Кондитерская "Сладости"',
        weight: '2 кг',
        servings: '10-12 порций',
        category: 'Десерты',
        dietary: []
    },
    {
        id: 5,
        name: 'Тирамису итальянский',
        price: 1200,
        rating: 4.7,
        reviews: 34,
        baker: 'Кондитерская "Сладости"',
        weight: '1.5 кг',
        servings: '8-10 порций',
        category: 'Десерты',
        dietary: [],
        isNew: true
    },
    {
        id: 6,
        name: 'Морковный торт веганский',
        price: 1600,
        rating: 4.5,
        reviews: 23,
        baker: 'Пекарня "У Марии"',
        weight: '1.8 кг',
        servings: '10-12 порций',
        category: 'Торты',
        dietary: ['Веганское', 'Без яиц']
    },
    {
        id: 7,
        name: 'Бородинский хлеб',
        price: 450,
        rating: 4.6,
        reviews: 78,
        baker: 'Домашняя кухня "Вкусно"',
        weight: '0.8 кг',
        servings: '8-10 порций',
        category: 'Хлеб',
        dietary: ['Без сахара']
    },
    {
        id: 8,
        name: 'Круассаны с шоколадом',
        price: 300,
        rating: 4.4,
        reviews: 56,
        baker: 'Кондитерская "Сладости"',
        weight: '0.4 кг',
        servings: '4 порции',
        category: 'Утренняя выпечка',
        dietary: []
    },
    {
        id: 9,
        name: 'Пирог с вишней',
        price: 950,
        rating: 4.6,
        reviews: 34,
        baker: 'Домашняя кухня "Вкусно"',
        weight: '1.3 кг',
        servings: '6-8 порций',
        category: 'Пироги',
        dietary: ['Без глютена']
    }
]

const FavoritesPage = () => {
    const { favorites } = useFavorites()
    const [isLoading] = useState(false) // Можно убрать, т.к. данные локальные

    // Получаем товары из избранного
    const favoriteProducts = useMemo(() => {
        return mockProducts.filter(product => favorites.includes(product.id))
    }, [favorites])

    // Функция для получения правильного окончания слова "товар"
    const getProductsWord = (count) => {
        if (count === 1) return 'товар'
        if (count > 1 && count < 5) return 'товара'
        return 'товаров'
    }

    return (
        <div className="min-h-screen flex flex-col bg-bakery-50">
            <Header />

            {/* Контент занимает все доступное пространство */}
            <div className="flex-1 flex flex-col">
                <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
                    {/* Хлебные крошки */}
                    <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                        <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                        <span>•</span>
                        <span className="text-bakery-500">Избранное</span>
                    </div>

                    <TransitionWrapper keyName={`favorites-${favoriteProducts.length}`}>
                        {favoriteProducts.length === 0 ? (
                            /* Пустое избранное - центрируем контент */
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                                <FadeIn>
                                    <div className="text-6xl mb-6">🤍</div>
                                    <h1 className="text-3xl font-bold text-bakery-1150 mb-4 font-display">
                                        В избранном пока пусто
                                    </h1>
                                    <p className="text-bakery-1050 text-lg mb-8 font-body max-w-md">
                                        Добавляйте понравившиеся товары в избранное, чтобы не потерять их и быстро найти позже
                                    </p>
                                    <Link href="/catalog">
                                        <button className="bg-bakery-500 text-white px-8 py-3 rounded-xl hover:bg-bakery-600 transition-colors font-body text-lg">
                                            Перейти в каталог
                                        </button>
                                    </Link>
                                </FadeIn>
                            </div>
                        ) : (
                            /* Страница с товарами */
                            <div className="flex-1">
                                <FadeIn>
                                    {/* Заголовок и количество */}
                                    <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-bakery-1150 mb-2 font-display">
                                            Избранное
                                        </h1>
                                        <p className="text-bakery-1050 font-body">
                                            {favoriteProducts.length} {getProductsWord(favoriteProducts.length)} в избранном
                                        </p>
                                    </div>

                                    {/* Сетка товаров */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {favoriteProducts.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
                                    </div>

                                    {/* Кнопка продолжить покупки */}
                                    <div className="text-center mt-12">
                                        <Link href="/catalog">
                                            <button className="bg-bakery-200 text-bakery-1100 px-8 py-3 rounded-xl hover:bg-bakery-300 transition-colors font-body text-lg border border-bakery-300">
                                                Продолжить покупки
                                            </button>
                                        </Link>
                                    </div>
                                </FadeIn>
                            </div>
                        )}
                    </TransitionWrapper>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default FavoritesPage