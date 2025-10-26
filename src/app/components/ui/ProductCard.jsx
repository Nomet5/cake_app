// src/app/components/ui/ProductCard.jsx
'use client'

import Link from 'next/link'
import Button from './Button'
import Rating from './Rating'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useFavorites } from '../../context/FavoritesContext' // ← ДОБАВЛЕНО
import FadeIn from './FadeIn'
import HoverScale from './HoverScale'

const ProductCard = ({ product, index = 0 }) => {
    const { addToCart } = useCart()
    const { addToast } = useToast()
    const { toggleFavorite, isFavorite } = useFavorites() // ← ДОБАВЛЕНО

    // Функция добавления в корзину
    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        addToast(`"${product.name}" добавлен в корзину!`, 'success')
    }

    // Функция избранного ← ДОБАВЛЕНО
    const handleFavoriteClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(product.id)

        if (isFavorite(product.id)) {
            addToast(`"${product.name}" удален из избранного`, 'info')
        } else {
            addToast(`"${product.name}" добавлен в избранное!`, 'success')
        }
    }

    return (
        <FadeIn delay={index * 0.1}>
            <HoverScale>
                <div className="bg-white rounded-2xl p-4 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 border border-bakery-200 group relative"> {/* ← Добавлен relative */}
                    {/* Кнопка избранного ← ДОБАВЛЕНО */}
                    <button
                        onClick={handleFavoriteClick}
                        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${isFavorite(product.id)
                                ? 'text-red-500 hover:text-red-600 transform scale-110'
                                : 'text-bakery-1050 hover:text-red-400 hover:scale-110'
                            }`}
                    >
                        {/* Используем SVG вместо эмодзи для лучшего контроля */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={isFavorite(product.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="transition-colors duration-200"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>

                    {/* Ссылка на весь кликабельный блок */}
                    <Link href={`/product/${product.id}`} className="block">
                        <div className="cursor-pointer mb-3">
                            {/* Изображение товара */}
                            <div className="bg-bakery-100 rounded-xl w-full h-48 mb-4 flex items-center justify-center text-bakery-600 text-4xl relative overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <span>🎂</span>
                                )}

                                {/* Бейдж новинки/хита */}
                                {product.isNew && (
                                    <div className="absolute top-2 left-2 bg-bakery-900 text-white text-xs px-2 py-1 rounded-full">
                                        Новинка
                                    </div>
                                )}
                                {product.isPopular && (
                                    <div className="absolute top-2 left-2 bg-bakery-1200 text-white text-xs px-2 py-1 rounded-full">
                                        Хит
                                    </div>
                                )}
                            </div>

                            {/* Информация о товаре */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-bakery-1150 text-lg mb-2 font-body group-hover:text-bakery-500 transition-colors line-clamp-2">
                                    {product.name}
                                </h3>

                                <div className="flex items-center justify-between mb-2">
                                    <Rating rating={product.rating} reviewCount={product.reviews} size="sm" />
                                    <span className="text-bakery-1050 text-sm font-body">
                                        {product.baker}
                                    </span>
                                </div>

                                {/* Вес/порции */}
                                {product.weight && (
                                    <p className="text-bakery-1050 text-sm mb-2">
                                        {product.weight} • {product.servings}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Цена и кнопка (отдельно от ссылки) */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-bakery-500">
                                {product.price}₽
                            </span>
                            {product.oldPrice && (
                                <span className="text-bakery-1050 line-through text-sm ml-2">
                                    {product.oldPrice}₽
                                </span>
                            )}
                        </div>
                        <Button
                            size="sm"
                            className="!px-4 transition-all duration-200 hover:scale-110"
                            onClick={handleAddToCart}
                        >
                            В корзину
                        </Button>
                    </div>
                </div>
            </HoverScale>
        </FadeIn>
    )
}

export default ProductCard