'use client'

import Link from 'next/link'
import Button from './Button'
import Rating from './Rating'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import FadeIn from './FadeIn'
import HoverScale from './HoverScale'

const ProductCard = ({ product, index = 0 }) => {
    const { addToCart } = useCart()
    const { addToast } = useToast()

    // Функция добавления в корзину
    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)

        // Красивое уведомление вместо alert
        addToast(`"${product.name}" добавлен в корзину!`, 'success')
    }

    return (
        <FadeIn delay={index * 0.1}>
            <HoverScale>
                <div className="bg-white rounded-2xl p-4 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 border border-bakery-200 group">
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