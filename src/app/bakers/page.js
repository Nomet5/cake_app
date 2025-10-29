import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import Rating from '../components/common/Rating'
import Link from 'next/link'

const BakersPage = () => {
    const bakers = [
        {
            id: 1,
            name: 'Пекарня "У Марии"',
            rating: 4.8,
            reviews: 127,
            specialties: ['Торты', 'Пироги', 'Десерты'],
            deliveryTime: '25-40 мин',
            minPrice: 500,
            distance: '2 км от вас',
            description: 'Семейная пекарня с 15-летним опытом. Готовим с любовью из натуральных продуктов.',
            image: '👩‍🍳'
        },
        {
            id: 2,
            name: 'Кондитерская "Сладости"',
            rating: 4.9,
            reviews: 84,
            specialties: ['Десерты', 'Торты', 'Пирожные'],
            deliveryTime: '15-30 мин',
            minPrice: 800,
            distance: '3 км от вас',
            description: 'Авторские десерты и торты на заказ. Используем только premium ингредиенты.',
            image: '🍰'
        },
        {
            id: 3,
            name: 'Домашняя кухня "Вкусно"',
            rating: 4.7,
            reviews: 56,
            specialties: ['Хлеб', 'Выпечка', 'Завтраки'],
            deliveryTime: '20-35 мин',
            minPrice: 300,
            distance: '1.5 км от вас',
            description: 'Домашняя выпечка как у бабушки. Натурально, вкусно и по-домашнему.',
            image: '🏠'
        }
    ]

    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                    <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                    <span>•</span>
                    <span className="text-bakery-500">Пекари</span>
                </div>

                {/* Заголовок */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-bakery-1150 mb-2 font-display">
                            Все пекари
                        </h1>
                        <p className="text-bakery-1050 font-body">
                            Найдено {bakers.length} пекаря • Лучшие кулинары вашего города
                        </p>
                    </div>
                </div>

                {/* Сетка пекарей */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bakers.map((baker) => (
                        <div
                            key={baker.id}
                            className="bg-white rounded-2xl p-6 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 border border-bakery-200"
                        >
                            <div className="flex gap-4">
                                {/* Аватар пекаря */}
                                <div className="w-20 h-20 bg-bakery-100 rounded-xl flex items-center justify-center text-2xl">
                                    {baker.image}
                                </div>

                                {/* Информация */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-bakery-1150 text-xl mb-1 font-body">
                                                {baker.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Rating rating={baker.rating} reviewCount={baker.reviews} size="sm" />
                                                <span className="text-bakery-1050 text-sm font-body">
                                                    {baker.distance}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Специализация */}
                                    <div className="mb-3">
                                        <p className="text-bakery-1050 text-sm font-body">
                                            {baker.specialties.join(', ')}
                                        </p>
                                    </div>

                                    {/* Описание */}
                                    <p className="text-bakery-1100 text-sm mb-4 leading-relaxed font-body">
                                        {baker.description}
                                    </p>

                                    {/* Детали доставки */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="text-bakery-1100 font-medium font-body">
                                            🕒 {baker.deliveryTime}
                                        </div>
                                        <div className="text-bakery-500 font-semibold font-body">
                                            от {baker.minPrice}₽
                                        </div>
                                    </div>

                                    {/* Кнопки действий */}
                                    <div className="flex gap-3 mt-4">
                                        <Link href={`/bakers/${baker.id}`} className="flex-1">
                                            <Button className="w-full">
                                                Смотреть товары
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">
                                            💬
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default BakersPage