'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FilterSidebar from '../components/catalog/FilterSidebar'
import ProductCard from '../components/product/ProductCard'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton'
import TransitionWrapper from '../components/common/TransitionWrapper'
import Link from 'next/link'

// Функция для получения товаров из API
async function getProducts(searchQuery = '', selectedCategories = []) {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`)

        if (searchQuery) {
            url.searchParams.set('search', searchQuery)
        }

        if (selectedCategories.length > 0) {
            url.searchParams.set('categories', selectedCategories.join(','))
        }

        const response = await fetch(url, {
            next: { revalidate: 60 } // Кешируем на 60 секунд
        })

        if (!response.ok) {
            throw new Error('Ошибка загрузки товаров')
        }

        const data = await response.json()

        if (data.success) {
            return data.data
        } else {
            console.error('API Error:', data.error)
            return []
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

// Функция для получения категорий из API
async function getCategories() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/categories`, {
            next: { revalidate: 300 } // Кешируем на 5 минут
        })

        if (!response.ok) {
            throw new Error('Ошибка загрузки категорий')
        }

        const data = await response.json()

        if (data.success) {
            return data.data
        } else {
            console.error('API Error:', data.error)
            return []
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export default function CatalogPage() {
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 5000],
        dietary: []
    })
    const [sortBy, setSortBy] = useState('popular')
    const [isLoading, setIsLoading] = useState(true)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [availableCategories, setAvailableCategories] = useState([])

    // Получаем параметры поиска из URL
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    // Загружаем товары и категории при загрузке страницы
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)

            // Параллельно загружаем товары и категории
            const [productsData, categoriesData] = await Promise.all([
                getProducts(searchQuery, filters.categories),
                getCategories()
            ])

            setProducts(productsData)
            setAvailableCategories(categoriesData)
            setIsLoading(false)
        }

        loadData()
    }, [searchQuery])

    // Функция применения фильтров
    const handleFiltersChange = async (newFilters) => {
        setIsLoading(true)
        setFilters(newFilters)

        // Перезагружаем товары с новыми фильтрами
        const productsData = await getProducts(searchQuery, newFilters.categories)
        setProducts(productsData)

        // На мобильных закрываем фильтры после применения
        if (window.innerWidth < 1024) {
            setIsFiltersOpen(false)
        }

        setIsLoading(false)
    }

    // Функция фильтрации и сортировки товаров
    const filteredProducts = useMemo(() => {
        let filtered = products

        // Фильтрация по цене
        filtered = filtered.filter(product =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        )

        // Фильтрация по диетическим особенностям
        if (filters.dietary.length > 0) {
            filtered = filtered.filter(product =>
                filters.dietary.every(diet => product.dietary.includes(diet))
            )
        }

        // Сортировка
        switch (sortBy) {
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating)
                break
            case 'popular':
            default:
                // По умолчанию - популярные сначала
                filtered.sort((a, b) => {
                    if (a.isPopular && !b.isPopular) return -1
                    if (!a.isPopular && b.isPopular) return 1
                    return b.rating - a.rating
                })
                break
        }

        return filtered
    }, [products, filters, sortBy])

    // Ключ для анимации перехода
    const contentKey = `${isLoading}-${filteredProducts.length}-${searchQuery}`

    return (
        <div className="min-h-screen bg-bakery-50 flex flex-col">
            <Header />

            <div className="flex-1 container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                    <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                    <span>•</span>
                    <span className="text-bakery-500">Каталог товаров</span>
                    {searchQuery && (
                        <>
                            <span>•</span>
                            <span className="text-bakery-400">Поиск: "{searchQuery}"</span>
                        </>
                    )}
                </div>

                {/* Заголовок и сортировка */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-bakery-1150 mb-2 font-display">
                            {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все товары'}
                        </h1>
                        {!isLoading && (
                            <p className="text-bakery-1050 font-body text-sm lg:text-base">
                                Найдено {filteredProducts.length} товаров
                                {availableCategories.length > 0 && ` в ${availableCategories.length} категориях`}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                        {/* Кнопка фильтров для мобильных */}
                        <button
                            className="lg:hidden bg-bakery-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        >
                            <span>📊</span>
                            Фильтры
                            {(filters.categories.length > 0 || filters.dietary.length > 0) && (
                                <span className="bg-white text-bakery-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    !
                                </span>
                            )}
                        </button>

                        {/* Селектор сортировки */}
                        <select
                            className="bg-white border border-bakery-200 rounded-xl px-3 py-2 text-bakery-1100 focus:ring-2 focus:ring-bakery-400 focus:border-transparent font-body text-sm lg:text-base"
                            value={sortBy}
                            onChange={(e) => {
                                setIsLoading(true)
                                setSortBy(e.target.value)
                                setTimeout(() => setIsLoading(false), 300)
                            }}
                            disabled={isLoading}
                        >
                            <option value="popular">По популярности</option>
                            <option value="price-high">Сначала дорогие</option>
                            <option value="price-low">Сначала дешевые</option>
                            <option value="rating">По рейтингу</option>
                        </select>
                    </div>
                </div>

                {/* Основной контент с фильтрами */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Боковая панель фильтров */}
                    <aside className={`lg:w-80 ${isFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            {/* Заголовок фильтров для мобильных */}
                            <div className="flex items-center justify-between mb-4 lg:hidden">
                                <h2 className="text-lg font-bold text-bakery-1150 font-display">Фильтры</h2>
                                <button
                                    className="text-bakery-500 hover:text-bakery-600"
                                    onClick={() => setIsFiltersOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <FilterSidebar
                                onFiltersChange={handleFiltersChange}
                                selectedCategories={filters.categories}
                                priceRange={filters.priceRange}
                                selectedDietary={filters.dietary}
                                availableCategories={availableCategories} // Передаем реальные категории
                            />
                        </div>
                    </aside>

                    {/* Сетка товаров с плавным переходом */}
                    <main className="flex-1 min-h-[400px]">
                        <TransitionWrapper keyName={contentKey}>
                            {isLoading ? (
                                // Скелетоны во время загрузки
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <ProductCardSkeleton key={index} />
                                    ))}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                // Сообщение когда товаров нет
                                <div className="text-center py-12 lg:py-16">
                                    <div className="text-5xl lg:text-6xl mb-4">
                                        {searchQuery ? '🔍' : '😔'}
                                    </div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-bakery-1150 mb-4 font-display">
                                        {searchQuery ? 'Товары не найдены' : 'Нет товаров по выбранным фильтрам'}
                                    </h2>
                                    <p className="text-bakery-1050 mb-6 lg:mb-8 font-body text-sm lg:text-base">
                                        {searchQuery
                                            ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                                            : products.length === 0
                                                ? 'В каталоге пока нет товаров. Зайдите позже.'
                                                : 'Попробуйте изменить параметры фильтров'
                                        }
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <button
                                            className="bg-bakery-500 text-white px-6 py-3 rounded-xl hover:bg-bakery-600 transition-colors font-body text-sm lg:text-base"
                                            onClick={() => {
                                                setFilters({ categories: [], priceRange: [0, 5000], dietary: [] })
                                                setIsFiltersOpen(false)
                                            }}
                                        >
                                            Сбросить фильтры
                                        </button>
                                        {searchQuery && (
                                            <Link href="/catalog">
                                                <button className="bg-bakery-200 text-bakery-1100 px-6 py-3 rounded-xl hover:bg-bakery-300 transition-colors font-body text-sm lg:text-base">
                                                    Показать все товары
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Товары после загрузки
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard key={product.id} product={product} index={index} />
                                    ))}
                                </div>
                            )}
                        </TransitionWrapper>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}