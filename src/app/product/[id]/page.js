'use client'

import { useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import Button from '../../components/common/Button'
import Rating from '../../components/common/Rating'
import ProductReviews from '../../components/product/ProductReviews'
import { useCart } from '../../components/context/CartContext'
import { useToast } from '../../components/context/ToastContext'
import Link from 'next/link'

// Временные данные товара
const mockProduct = {
    id: 1,
    name: 'Шоколадный торт "Вечер в Париже"',
    price: 2400,
    rating: 4.8,
    reviews: 127,
    baker: {
        name: 'Пекарня "У Марии"',
        rating: 4.8,
        distance: '2 км от вас',
        description: 'Готовим с любовью уже 15 лет. Использую только натуральные продукты от проверенных поставщиков. Каждый торт — это маленькое произведение искусства...',
        features: ['Проверенный пекарь', 'Домашняя кухня', '2 км от вас'],
        prepTime: '1-2 дня',
        deliveryTime: '25-40 мин'
    },
    details: {
        weight: '2 кг',
        servings: '10-12 порций',
        readyBy: 'завтра к 14:00'
    },
    description: 'Нежный бисквит с тёмным шоколадом, малиновым конфитюром и шоколадным ганашем. Идеален для особых случаев.',
    ingredients: [
        'Мука пшеничная',
        'Шоколад тёмный 70%',
        'Сливочное масло',
        'Яйца куриные',
        'Малина свежая'
    ],
    allergens: ['глютен', 'яйца'],
    personalization: [
        { name: 'Поздравительная надпись', price: 200 },
        { name: 'Дополнительный декор', price: 300 },
        { name: 'Подарочная упаковка', price: 150 }
    ]
}

export default function ProductPage({ params }) {
    const product = mockProduct
    const { addToCart } = useCart()
    const { addToast } = useToast()
    const [selectedPersonalization, setSelectedPersonalization] = useState([])
    const [activeTab, setActiveTab] = useState('description') // 'description', 'reviews', 'similar'

    // Функция для переключения персонализации
    const togglePersonalization = (option) => {
        setSelectedPersonalization(prev =>
            prev.some(item => item.name === option.name)
                ? prev.filter(item => item.name !== option.name)
                : [...prev, option]
        )
    }

    // Функция добавления в корзину
    const handleAddToCart = () => {
        // Собираем все данные о товаре
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            baker: product.baker.name,
            details: `${product.details.weight} • ${product.details.servings}`,
            readyBy: product.details.readyBy,
            personalization: selectedPersonalization.length > 0
                ? {
                    description: selectedPersonalization.map(p => p.name).join(', '),
                    price: selectedPersonalization.reduce((sum, p) => sum + p.price, 0)
                }
                : null,
            personalizationPrice: selectedPersonalization.reduce((sum, p) => sum + p.price, 0)
        }

        addToCart(cartItem)
        if (selectedPersonalization.length > 0) {
            const personalizationText = selectedPersonalization.map(p => p.name).join(', ')
            addToast(`"${product.name}" с ${personalizationText} добавлен в корзину!`, 'success')
        } else {
            addToast(`"${product.name}" добавлен в корзину!`, 'success')
        }
    }

    // Расчет итоговой цены с персонализацией
    const personalizationTotal = selectedPersonalization.reduce((sum, option) => sum + option.price, 0)
    const totalPrice = product.price + personalizationTotal

    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                    <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                    <span>•</span>
                    <Link href="/catalog" className="hover:text-bakery-500 transition-colors">Каталог</Link>
                    <span>•</span>
                    <span className="text-bakery-500">Торт</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Левая колонка - изображение */}
                    <div>
                        <div className="bg-white rounded-2xl p-8 shadow-bakery-soft border border-bakery-200">
                            <div className="w-full h-96 bg-bakery-100 rounded-xl flex items-center justify-center text-6xl text-bakery-600 mb-4">
                                🎂
                            </div>

                            {/* Действия с товаром */}
                            <div className="flex gap-4 mt-6">
                                <button className="flex-1 py-3 border border-bakery-200 rounded-xl text-bakery-1050 hover:border-bakery-400 hover:text-bakery-500 transition-colors font-body">
                                    ❤️ В избранное
                                </button>
                                <button className="flex-1 py-3 border border-bakery-200 rounded-xl text-bakery-1050 hover:border-bakery-400 hover:text-bakery-500 transition-colors font-body">
                                    ↗️ Поделиться
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - информация */}
                    <div>
                        {/* Заголовок и рейтинг */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-bakery-1150 mb-4 font-display">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <Rating rating={product.rating} reviewCount={product.reviews} size="lg" />
                                <span className="text-bakery-1050 font-body">
                                    {product.baker.distance}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-bakery-1050 font-body">
                                <span>👩‍🍳 {product.baker.name}</span>
                                <Rating rating={product.baker.rating} size="sm" />
                            </div>
                        </div>

                        {/* Основная информация */}
                        <div className="bg-bakery-100 rounded-2xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl font-bold text-bakery-500">
                                    {product.price}₽
                                </span>
                                <span className="text-bakery-1050 font-body">
                                    {product.details.weight} • {product.details.servings}
                                </span>
                            </div>

                            <div className="text-bakery-900 font-semibold font-body">
                                🕒 Готовность: {product.details.readyBy}
                            </div>
                        </div>

                        {/* Описание */}
                        <div className="mb-6">
                            <p className="text-bakery-1100 leading-relaxed font-body">
                                {product.description}
                            </p>
                        </div>

                        {/* Состав и аллергены */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-bakery-1150 mb-3 font-body">Состав и аллергены</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {product.ingredients.map((ingredient, index) => (
                                    <span key={index} className="bg-bakery-100 text-bakery-1100 px-3 py-1 rounded-full text-sm font-body">
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                            <p className="text-bakery-1050 text-sm font-body">
                                <strong>Аллергены:</strong> {product.allergens.join(', ')}
                            </p>
                        </div>

                        {/* Персонализация */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-bakery-1150 mb-4 font-body">Персонализация</h3>
                            <div className="space-y-3">
                                {product.personalization.map((option, index) => (
                                    <label key={index} className="flex items-center justify-between p-4 border border-bakery-200 rounded-xl hover:border-bakery-400 transition-colors cursor-pointer">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400"
                                                checked={selectedPersonalization.some(p => p.name === option.name)}
                                                onChange={() => togglePersonalization(option)}
                                            />
                                            <span className="ml-3 text-bakery-1100 font-body">{option.name}</span>
                                        </div>
                                        <span className="text-bakery-500 font-semibold">+{option.price}₽</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Итоговая цена и кнопка */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="text-3xl font-bold text-bakery-500">
                                    {totalPrice}₽
                                </span>
                                {personalizationTotal > 0 && (
                                    <p className="text-bakery-1050 text-sm mt-1 font-body">
                                        Базовая цена: {product.price}₽ + персонализация: {personalizationTotal}₽
                                    </p>
                                )}
                            </div>
                            <Button size="lg" onClick={handleAddToCart}>
                                🛒 Добавить в корзину
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Табы для дополнительной информации */}
                <div className="mt-12">
                    <div className="border-b border-bakery-200 mb-8">
                        <nav className="flex gap-8">
                            <button
                                className={`pb-4 font-body font-medium transition-colors ${activeTab === 'description'
                                        ? 'text-bakery-500 border-b-2 border-bakery-500'
                                        : 'text-bakery-1050 hover:text-bakery-500'
                                    }`}
                                onClick={() => setActiveTab('description')}
                            >
                                Описание
                            </button>
                            <button
                                className={`pb-4 font-body font-medium transition-colors ${activeTab === 'reviews'
                                        ? 'text-bakery-500 border-b-2 border-bakery-500'
                                        : 'text-bakery-1050 hover:text-bakery-500'
                                    }`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Отзывы ({product.reviews})
                            </button>
                            <button
                                className={`pb-4 font-body font-medium transition-colors ${activeTab === 'similar'
                                        ? 'text-bakery-500 border-b-2 border-bakery-500'
                                        : 'text-bakery-1050 hover:text-bakery-500'
                                    }`}
                                onClick={() => setActiveTab('similar')}
                            >
                                Похожие товары
                            </button>
                        </nav>
                    </div>

                    {/* Контент табов */}
                    {activeTab === 'description' && (
                        <div className="bg-white rounded-2xl p-8 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">Подробное описание</h3>
                            <div className="prose prose-bakery max-w-none">
                                <p className="text-bakery-1100 leading-relaxed font-body">
                                    {product.description}
                                </p>
                                <p className="text-bakery-1100 leading-relaxed font-body mt-4">
                                    Этот изысканный торт создан для особых моментов в жизни. Нежный шоколадный бисквит
                                    пропитан ароматным сиропом и сочетается с малиновым конфитюром собственного приготовления.
                                    Шоколадный ганаш придает торту благородный вкус и идеальную текстуру.
                                </p>
                                <p className="text-bakery-1100 leading-relaxed font-body mt-4">
                                    Идеально подходит для дней рождений, свадеб, юбилеев и других праздничных мероприятий.
                                    Каждый торт готовится индивидуально с учетом ваших пожеланий.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <ProductReviews productId={product.id} productName={product.name} />
                    )}

                    {activeTab === 'similar' && (
                        <div className="bg-white rounded-2xl p-8 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">Похожие товары</h3>
                            <p className="text-bakery-1050 font-body">
                                Раздел похожих товаров находится в разработке...
                            </p>
                        </div>
                    )}
                </div>

                {/* Информация о пекаре */}
                <div className="mt-16">
                    <div className="bg-white rounded-2xl p-8 shadow-bakery-soft border border-bakery-200">
                        <h2 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">О пекаре</h2>

                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-bakery-200 rounded-full flex items-center justify-center text-2xl text-bakery-600">
                                👩‍🍳
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h3 className="text-xl font-semibold text-bakery-1150 font-body">
                                        {product.baker.name}
                                    </h3>
                                    <Rating rating={product.baker.rating} size="sm" />
                                </div>

                                <p className="text-bakery-1100 leading-relaxed mb-4 font-body">
                                    {product.baker.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.baker.features.map((feature, index) => (
                                        <span key={index} className="bg-bakery-100 text-bakery-1100 px-3 py-1 rounded-full text-sm font-body">
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                <div className="text-bakery-1050 text-sm font-body">
                                    <span className="mr-6">⏱️ Время готовки: {product.baker.prepTime}</span>
                                    <span>🚚 Доставка: {product.baker.deliveryTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button variant="outline" size="sm">
                                📞 Позвонить
                            </Button>
                            <Button variant="outline" size="sm">
                                ✉️ Написать
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                                👀 Смотреть все товары
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}