import Link from 'next/link'
import Button from '../common/Button'
import Rating from '../common/Rating'

const PopularBakers = ({ bakers = [] }) => {
    // Fallback данные если массив пустой
    const displayBakers = bakers.length > 0 ? bakers : [
        {
            id: 1,
            name: 'Пекарня "У Марии"',
            rating: 4.8,
            reviews: 127,
            specialties: ['Торты', 'Пироги'],
            deliveryTime: '25-40 мин',
            minPrice: 500
        },
        {
            id: 2,
            name: 'Кондитерская "Сладости"',
            rating: 4.9,
            reviews: 84,
            specialties: ['Десерты', 'Торты'],
            deliveryTime: '15-30 мин',
            minPrice: 800
        },
        {
            id: 3,
            name: 'Домашняя кухня "Вкусно"',
            rating: 4.7,
            reviews: 56,
            specialties: ['Хлеб', 'Выпечка'],
            deliveryTime: '20-35 мин',
            minPrice: 300
        }
    ]

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-bakery-1150 font-display">
                        Популярные пекари
                    </h2>
                    <Link href="/bakers">
                        <Button variant="outline" size="sm">
                            Смотреть всех
                        </Button>
                    </Link>
                </div>

                {displayBakers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👨‍🍳</div>
                        <h3 className="text-xl font-semibold text-bakery-1100 mb-2">
                            Поваров пока нет
                        </h3>
                        <p className="text-bakery-1050">
                            Зайдите позже или создайте поваров в панели администратора
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayBakers.map((baker) => (
                            <div
                                key={baker.id}
                                className="bg-white rounded-2xl p-6 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 border border-bakery-200"
                            >
                                {/* Верхняя часть с аватаром и рейтингом */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-bakery-200 rounded-full flex items-center justify-center text-bakery-600 font-bold">
                                            👩‍🍳
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-bakery-1150 text-lg font-body">
                                                {baker.name}
                                            </h3>
                                            <Rating rating={baker.rating} reviewCount={baker.reviews} size="sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Специализация */}
                                <div className="mb-4">
                                    <p className="text-bakery-1050 text-sm font-body">
                                        {baker.specialties?.join(', ') || 'Разнообразная выпечка'}
                                    </p>
                                </div>

                                {/* Инфо о доставке и цене */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-bakery-1100 font-medium">
                                        {baker.deliveryTime}
                                    </div>
                                    <div className="text-bakery-500 font-semibold">
                                        от {baker.minPrice}₽
                                    </div>
                                </div>

                                {/* Кнопка просмотра */}
                                <Link href={`/bakers/${baker.id}`}>
                                    <Button variant="outline" size="sm" className="w-full mt-4">
                                        Смотреть товары
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default PopularBakers