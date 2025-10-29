'use client'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import Link from 'next/link'
import { useCart } from '../components/context/CartContext'

const CartPage = () => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getCartTotal
    } = useCart()

    // Дополнительные товары
    const additionalItems = [
        {
            id: 101,
            name: 'Чай травяной',
            price: 250,
            image: '🍵'
        },
        {
            id: 102,
            name: 'Кофе',
            price: 300,
            image: '☕'
        }
    ]

    // Расчеты
    const subtotal = getCartTotal()
    const deliveryFee = subtotal >= 2000 ? 0 : 300
    const serviceFee = 50
    const total = subtotal + deliveryFee + serviceFee
    const freeDeliveryRemaining = Math.max(0, 2000 - subtotal)

    // Функция для увеличения количества
    const increaseQuantity = (item) => {
        updateQuantity(item.id, item.personalization?.description, item.quantity + 1)
    }

    // Функция для уменьшения количества
    const decreaseQuantity = (item) => {
        updateQuantity(item.id, item.personalization?.description, item.quantity - 1)
    }

    // Функция удаления товара
    const handleRemoveItem = (item) => {
        removeFromCart(item.id, item.personalization?.description)
    }

    // Функция добавления дополнительного товара
    const addAdditionalItem = (additionalItem) => {
        // Здесь можно добавить логику для дополнительных товаров
        alert(`Товар "${additionalItem.name}" добавлен в корзину!`)
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />

                {/* Контент занимает все доступное пространство */}
                <div className="flex-1 flex flex-col">
                    <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
                        {/* Хлебные крошки */}
                        <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                            <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                            <span>•</span>
                            <span className="text-bakery-500">Корзина</span>
                        </div>

                        {/* Пустая корзина - центрируем контент */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                            <div className="text-6xl mb-4">🛒</div>
                            <h1 className="text-3xl font-bold text-bakery-1150 mb-4 font-display">
                                Корзина пуста
                            </h1>
                            <p className="text-bakery-1050 text-lg mb-8 font-body">
                                Добавьте товары из каталога, чтобы сделать заказ
                            </p>
                            <Link href="/catalog">
                                <Button size="lg">
                                    Перейти в каталог
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                    <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                    <span>•</span>
                    <span className="text-bakery-500">Корзина</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Левая колонка - товары */}
                    <div className="lg:flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-bakery-1150 font-display">
                                Корзина
                            </h1>
                            <span className="text-bakery-1050 font-body">
                                {cartItems.reduce((total, item) => total + item.quantity, 0)} товара
                            </span>
                        </div>

                        {/* Баннер бесплатной доставки */}
                        {freeDeliveryRemaining > 0 && (
                            <div className="bg-gradient-to-r from-bakery-900 to-bakery-950 text-white rounded-2xl p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">🚚</div>
                                    <div>
                                        <p className="font-semibold">До бесплатной доставки осталось {freeDeliveryRemaining}₽!</p>
                                        <p className="text-bakery-200 text-sm">Бесплатная доставка при заказе от 2000₽</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Список товаров */}
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.personalization?.description || 'no-personalization'}`}
                                    className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                    <div className="flex gap-4">
                                        {/* Изображение товара */}
                                        <div className="w-20 h-20 bg-bakery-100 rounded-xl flex items-center justify-center text-2xl">
                                            🎂
                                        </div>

                                        {/* Информация о товаре */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-bakery-1150 text-lg font-body">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-bakery-1050 text-sm font-body">
                                                        {item.baker} {item.details && `• ${item.details}`}
                                                    </p>
                                                </div>
                                                <span className="text-xl font-bold text-bakery-500">
                                                    {(item.price + (item.personalizationPrice || 0)) * item.quantity}₽
                                                </span>
                                            </div>

                                            {/* Персонализация */}
                                            {item.personalization && (
                                                <p className="text-bakery-1050 text-sm mb-3 font-body">
                                                    Персонализация: {item.personalization.description} • +{item.personalization.price}₽
                                                </p>
                                            )}

                                            {/* Время готовности */}
                                            <p className="text-bakery-900 text-sm mb-4 font-body">
                                                🕒 Готов к: {item.readyBy || 'завтра, 14:00-16:00'}
                                            </p>

                                            {/* Управление количеством и удаление */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="w-8 h-8 bg-bakery-100 text-bakery-600 rounded-lg hover:bg-bakery-200 transition-colors font-body"
                                                        onClick={() => decreaseQuantity(item)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-semibold text-bakery-1100 w-8 text-center font-body">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="w-8 h-8 bg-bakery-100 text-bakery-600 rounded-lg hover:bg-bakery-200 transition-colors font-body"
                                                        onClick={() => increaseQuantity(item)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="text-bakery-1050 hover:text-bakery-600 transition-colors font-body"
                                                    onClick={() => handleRemoveItem(item)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Дополнительные товары */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Добавить к заказу
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {additionalItems.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl p-4 shadow-bakery-soft border border-bakery-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-bakery-100 rounded-lg flex items-center justify-center text-xl">
                                                    {item.image}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-bakery-1100 font-body">
                                                        {item.name}
                                                    </h4>
                                                    <span className="text-bakery-500 font-semibold font-body">
                                                        {item.price}₽
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="w-8 h-8 bg-bakery-500 text-white rounded-lg hover:bg-bakery-600 transition-colors font-body"
                                                onClick={() => addAdditionalItem(item)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Информация о доставке */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Доставка
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-bakery-1100 font-body">Москва, ул. Тверская, 15, кв. 42</p>
                                        <p className="text-bakery-1050 text-sm font-body">Квартира • Домофон: 42 • Этаж: 4</p>
                                    </div>
                                    <button className="text-bakery-500 hover:text-bakery-600 transition-colors text-sm font-body">
                                        Изменить адрес
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-bakery-200">
                                    <div>
                                        <p className="font-medium text-bakery-1100 font-body">Сегодня, 18:00-20:00</p>
                                        <p className="text-bakery-900 text-sm font-body">
                                            {deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee}₽`}
                                        </p>
                                    </div>
                                    <button className="text-bakery-500 hover:text-bakery-600 transition-colors text-sm font-body">
                                        Изменить время
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - итого */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200 sticky top-24">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Итого
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Товары ({cartItems.reduce((total, item) => total + item.quantity, 0)}):</span>
                                    <span>{subtotal}₽</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Доставка:</span>
                                    <span>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee}₽`}</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Сервисный сбор:</span>
                                    <span>{serviceFee}₽</span>
                                </div>
                            </div>

                            <div className="border-t border-bakery-200 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-bakery-1150 font-body">
                                        К оплате:
                                    </span>
                                    <span className="text-2xl font-bold text-bakery-500">
                                        {total}₽
                                    </span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button size="lg" className="w-full">
                                    Перейти к оплате
                                </Button>
                            </Link>

                            <p className="text-bakery-1050 text-xs text-center mt-4 font-body">
                                Нажимая кнопку, вы соглашаетесь с условиями обслуживания
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default CartPage