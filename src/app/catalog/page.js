'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FilterSidebar from '../components/ui/FilterSidebar'
import ProductCard from '../components/ui/ProductCard'
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton'
import TransitionWrapper from '../components/ui/TransitionWrapper'
import Link from 'next/link'

// Расширенные данные товаров для фильтрации
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

export default function CatalogPage() {
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 5000],
        dietary: []
    })
    const [sortBy, setSortBy] = useState('popular')
    const [isLoading, setIsLoading] = useState(true)

    // Получаем параметры поиска из URL
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    // Имитация загрузки данных
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800) // Уменьшили время загрузки

        return () => clearTimeout(timer)
    }, [searchQuery, filters, sortBy])

    // Функция применения фильтров
    const handleFiltersChange = (newFilters) => {
        setIsLoading(true)
        setFilters(newFilters)
    }

    // Функция фильтрации и поиска товаров
    const filteredProducts = useMemo(() => {
        let filtered = mockProducts

        // Поиск по запросу
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.baker.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            )
        }

        // Фильтрация по категориям
        if (filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                filters.categories.includes(product.category)
            )
        }

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
    }, [filters, sortBy, searchQuery])

    // Ключ для анимации перехода
    const contentKey = `${isLoading}-${filteredProducts.length}-${searchQuery}`

    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
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
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-bakery-1150 mb-2 font-display">
                            {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все товары'}
                        </h1>
                        {!isLoading && (
                            <p className="text-bakery-1050 font-body">
                                Найдено {filteredProducts.length} товаров • Показано 1-{filteredProducts.length} из {filteredProducts.length}
                            </p>
                        )}
                    </div>

                    {/* Селектор сортировки */}
                    <div className="mt-4 lg:mt-0">
                        <select
                            className="bg-white border border-bakery-200 rounded-xl px-4 py-2 text-bakery-1100 focus:ring-2 focus:ring-bakery-400 focus:border-transparent font-body"
                            value={sortBy}
                            onChange={(e) => {
                                setIsLoading(true)
                                setSortBy(e.target.value)
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
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Боковая панель фильтров */}
                    <aside className="lg:w-80">
                        <FilterSidebar
                            onFiltersChange={handleFiltersChange}
                            selectedCategories={filters.categories}
                            priceRange={filters.priceRange}
                            selectedDietary={filters.dietary}
                        />
                    </aside>

                    {/* Сетка товаров с плавным переходом */}
                    <main className="flex-1 min-h-[400px]">
                        <TransitionWrapper keyName={contentKey}>
                            {isLoading ? (
                                // Скелетоны во время загрузки
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <ProductCardSkeleton key={index} />
                                    ))}
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                // Сообщение когда товаров нет
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-4">
                                        {searchQuery ? '🔍' : '😔'}
                                    </div>
                                    <h2 className="text-2xl font-bold text-bakery-1150 mb-4 font-display">
                                        {searchQuery ? 'Товары не найдены' : 'Нет товаров по выбранным фильтрам'}
                                    </h2>
                                    <p className="text-bakery-1050 mb-8 font-body">
                                        {searchQuery
                                            ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                                            : 'Попробуйте изменить параметры фильтров'
                                        }
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            className="bg-bakery-500 text-white px-6 py-3 rounded-xl hover:bg-bakery-600 transition-colors font-body"
                                            onClick={() => setFilters({ categories: [], priceRange: [0, 5000], dietary: [] })}
                                        >
                                            Сбросить фильтры
                                        </button>
                                        {searchQuery && (
                                            <Link href="/catalog">
                                                <button className="bg-bakery-200 text-bakery-1100 px-6 py-3 rounded-xl hover:bg-bakery-300 transition-colors font-body">
                                                    Показать все товары
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Товары после загрузки
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard key={product.id} product={product} index={index} />
                                    ))}
                                </div>
                            )}
                        </TransitionWrapper>
                    </main>
                </div>

                {/* Пагинация (только когда есть товары) */}
                {!isLoading && filteredProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button className="w-10 h-10 flex items-center justify-center text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            ←
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-bakery-500 text-white rounded-xl font-body">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            3
                        </button>
                        <span className="text-bakery-1050 px-2 font-body">...</span>
                        <button className="w-10 h-10 flex items-center justify-center text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            5
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            →
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}