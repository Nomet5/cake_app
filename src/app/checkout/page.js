import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import Link from 'next/link'

const CheckoutPage = () => {
    // Данные заказа
    const orderItems = [
        {
            id: 1,
            name: 'Шоколадный торт "Вечер в Париже"',
            price: 2400,
        },
        {
            id: 2,
            name: 'Яблочный пирог с корицей',
            price: 850,
        }
    ]

    const personalization = {
        description: 'Поздравительная надпись',
        price: 200
    }

    const delivery = {
        time: 'сегодня 18:00-20:00',
        price: 0
    }

    const serviceFee = 50

    // Расчеты
    const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
    const total = subtotal + personalization.price + delivery.price + serviceFee

    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки и шаги */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-4 font-body">
                        <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                        <span>•</span>
                        <Link href="/cart" className="hover:text-bakery-500 transition-colors">Корзина</Link>
                        <span>•</span>
                        <span className="text-bakery-500">Оформление заказа</span>
                    </div>

                    {/* Шаги оформления */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-bakery-200 text-bakery-1050 rounded-full flex items-center justify-center text-sm font-body">
                                1
                            </div>
                            <span className="mx-2 text-bakery-1050 font-body">Корзина</span>
                        </div>

                        <div className="w-12 h-0.5 bg-bakery-300 mx-2"></div>

                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-bakery-200 text-bakery-1050 rounded-full flex items-center justify-center text-sm font-body">
                                2
                            </div>
                            <span className="mx-2 text-bakery-1050 font-body">Доставка</span>
                        </div>

                        <div className="w-12 h-0.5 bg-bakery-300 mx-2"></div>

                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-bakery-500 text-white rounded-full flex items-center justify-center text-sm font-body">
                                3
                            </div>
                            <span className="mx-2 text-bakery-500 font-semibold font-body">Оплата</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 text-bakery-1050 hover:text-bakery-500 transition-colors font-body">
                            ← Назад
                        </button>
                        <h1 className="text-3xl font-bold text-bakery-1150 font-display">
                            Оформление заказа
                        </h1>
                        <span className="text-bakery-1050 font-body">
                            3 товара
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Левая колонка - формы */}
                    <div className="space-y-6">
                        {/* Ваш заказ */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Ваш заказ
                            </h3>
                            <div className="space-y-3">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-bakery-1100 font-body">
                                        <span>{item.name} • {item.price}₽</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Персонализация: {personalization.description} • {personalization.price}₽</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Доставка: {delivery.time} • {delivery.price}₽</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 font-body">
                                    <span>Сервисный сбор: {serviceFee}₽</span>
                                </div>
                                <div className="border-t border-bakery-200 pt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-bakery-1150 font-body">К оплате:</span>
                                        <span className="text-bakery-500 font-body">{total}₽</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Получатель */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Получатель
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-bakery-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-bakery-1100 font-body">Иван Петров</p>
                                        <p className="text-bakery-1050 text-sm font-body">+7 (908) 123-45-67</p>
                                        <p className="text-bakery-1050 text-sm font-body">ivan@email.com</p>
                                    </div>
                                    <button className="text-bakery-500 hover:text-bakery-600 transition-colors text-sm font-body">
                                        Изменить
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Адрес доставки */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Адрес доставки
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-bakery-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-bakery-1100 font-body">Москва, ул. Тверская, 15, кв. 42</p>
                                        <p className="text-bakery-1050 text-sm font-body">Квартира • Домофон: 42 • Этаж: 4</p>
                                    </div>
                                    <button className="text-bakery-500 hover:text-bakery-600 transition-colors text-sm font-body">
                                        Изменить адрес
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Время доставки */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Время доставки
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border-2 border-bakery-500 bg-bakery-50 rounded-xl cursor-pointer">
                                    <input type="radio" name="deliveryTime" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" defaultChecked />
                                    <span className="ml-3 font-medium text-bakery-1100 font-body">Сегодня, 18:00-20:00</span>
                                </label>
                                <label className="flex items-center p-3 border border-bakery-200 rounded-xl cursor-pointer hover:border-bakery-400 transition-colors">
                                    <input type="radio" name="deliveryTime" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" />
                                    <span className="ml-3 text-bakery-1100 font-body">Завтра, 10:00-12:00</span>
                                </label>
                                <label className="flex items-center p-3 border border-bakery-200 rounded-xl cursor-pointer hover:border-bakery-400 transition-colors">
                                    <input type="radio" name="deliveryTime" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" />
                                    <span className="ml-3 text-bakery-1100 font-body">Завтра, 14:00-16:00</span>
                                </label>
                                <button className="text-bakery-500 hover:text-bakery-600 transition-colors text-sm font-body">
                                    Изменить время
                                </button>
                            </div>
                        </div>

                        {/* Способ оплаты */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Способ оплаты
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border-2 border-bakery-500 bg-bakery-50 rounded-xl cursor-pointer">
                                    <input type="radio" name="paymentMethod" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" defaultChecked />
                                    <span className="ml-3 font-medium text-bakery-1100 font-body">Банковская карта</span>
                                </label>
                                <label className="flex items-center p-3 border border-bakery-200 rounded-xl cursor-pointer hover:border-bakery-400 transition-colors">
                                    <input type="radio" name="paymentMethod" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" />
                                    <span className="ml-3 text-bakery-1100 font-body">Apple Pay</span>
                                </label>
                                <label className="flex items-center p-3 border border-bakery-200 rounded-xl cursor-pointer hover:border-bakery-400 transition-colors">
                                    <input type="radio" name="paymentMethod" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" />
                                    <span className="ml-3 text-bakery-1100 font-body">Google Pay</span>
                                </label>
                                <label className="flex items-center p-3 border border-bakery-200 rounded-xl cursor-pointer hover:border-bakery-400 transition-colors">
                                    <input type="radio" name="paymentMethod" className="text-bakery-500 border-bakery-300 focus:ring-bakery-400" />
                                    <span className="ml-3 text-bakery-1100 font-body">Наличные при получении</span>
                                </label>
                            </div>
                        </div>

                        {/* Данные карты */}
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Данные карты
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-bakery-1100 text-sm mb-2 font-body">Номер карты</label>
                                    <input
                                        type="text"
                                        placeholder="1234 56•• •••• 7800"
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-bakery-1100 text-sm mb-2 font-body">Срок действия</label>
                                        <input
                                            type="text"
                                            placeholder="12/25"
                                            className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-bakery-1100 text-sm mb-2 font-body">CVC</label>
                                        <input
                                            type="text"
                                            placeholder="•••"
                                            className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-bakery-1100 text-sm mb-2 font-body">Владелец карты</label>
                                    <input
                                        type="text"
                                        placeholder="IVAN PETROV"
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body"
                                    />
                                </div>
                                <label className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400" />
                                    <span className="ml-2 text-bakery-1050 text-sm font-body">Сохранить карту для будущих платежей</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - итого и кнопка оплаты */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200 sticky top-24">
                            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                                Ваш заказ
                            </h3>

                            <div className="space-y-3 mb-6">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-bakery-1100 text-sm font-body">
                                        <span className="flex-1">{item.name}</span>
                                        <span className="ml-2">{item.price}₽</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-bakery-1100 text-sm font-body">
                                    <span>{personalization.description}</span>
                                    <span>+{personalization.price}₽</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 text-sm font-body">
                                    <span>Доставка: {delivery.time}</span>
                                    <span>{delivery.price}₽</span>
                                </div>
                                <div className="flex justify-between text-bakery-1100 text-sm font-body">
                                    <span>Сервисный сбор</span>
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

                            <Button size="lg" className="w-full">
                                Оплатить {total}₽
                            </Button>

                            <p className="text-bakery-1050 text-xs text-center mt-4 font-body">
                                Все данные защищены и передаются в зашифрованном виде
                            </p>
                            <p className="text-bakery-1050 text-xs text-center mt-2 font-body">
                                Нажимая «Оплатить», вы соглашаетесь с условиями обслуживания
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default CheckoutPage