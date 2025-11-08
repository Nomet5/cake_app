'use client'

import Link from 'next/link'
import Button from '../common/Button'
import Rating from '../common/Rating'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import FadeIn from '../common/FadeIn'

const RecommendedProducts = () => {
    const { addToCart } = useCart()
    const { addToast } = useToast()

    const products = [
        {
            id: 1,
            name: 'Шоколадный торт "Вечер в Париже"',
            price: 2400,
            rating: 4.9,
            baker: 'Пекарня "У Марии"',
            image: '/api/placeholder/200/200'
        },
        {
            id: 2,
            name: 'Медовик классический',
            price: 1800,
            rating: 4.7,
            baker: 'Пекарня "У Марии"',
            image: '/api/placeholder/200/200'
        },
        {
            id: 3,
            name: 'Яблочный пирог',
            price: 850,
            rating: 4.6,
            baker: 'Домашняя кухня "Вкусно"',
            image: '/api/placeholder/200/200'
        },
        {
            id: 4,
            name: 'Чизкейк Нью-Йорк',
            price: 2200,
            rating: 4.8,
            baker: 'Кондитерская "Сладости"',
            image: '/api/placeholder/200/200'
        }
    ]

    // Функция для кнопки "+"
    const handleAddToCart = (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        addToast(`"${product.name}" добавлен в корзину!`, 'success')
    }

    return (
        <FadeIn>
            <section className="py-16 bg-bakery-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-bakery-1150 font-display">
                            Новинки недели
                        </h2>
                        <Link href="/catalog">
                            <Button variant="outline" size="sm">
                                Все новинки
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <FadeIn key={product.id} delay={index * 0.1}>
                                <div className="bg-bakery-50 rounded-2xl p-4 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 border border-bakery-200 group">
                                    {/* Ссылка на весь кликабельный блок */}
                                    <Link href={`/product/${product.id}`} className="block">
                                        <div className="cursor-pointer mb-3">
                                            {/* Изображение товара */}
                                            <div className="bg-white rounded-xl w-full h-48 mb-4 flex items-center justify-center text-bakery-300 text-4xl group-hover:scale-105 transition-transform duration-300">
                                                🎂
                                            </div>

                                            {/* Информация о товаре */}
                                            <div>
                                                <h3 className="font-semibold text-bakery-1150 text-lg mb-1 font-body group-hover:text-bakery-500 transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-bakery-1050 text-sm mb-2 font-body">
                                                    {product.baker}
                                                </p>
                                                <Rating rating={product.rating} size="sm" />
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Цена и кнопка (отдельно от ссылки) */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-bakery-500">
                                            {product.price}₽
                                        </span>
                                        <Button
                                            size="sm"
                                            className="!px-3 !py-2 hover:scale-110 transition-transform"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </FadeIn>
    )
}

export default RecommendedProducts