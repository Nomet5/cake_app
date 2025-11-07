import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import Rating from '../components/common/Rating'
import Link from 'next/link'

// Функция для получения поваров из API
async function getBakers() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chefs`, {
            next: { revalidate: 60 } // Кешируем на 60 секунд
        })

        if (!response.ok) {
            throw new Error('Ошибка загрузки поваров')
        }

        const data = await response.json()

        if (data.success) {
            return data.data
        } else {
            console.error('API Error:', data.error)
            return []
        }
    } catch (error) {
        console.error('Error fetching bakers:', error)
        // Возвращаем пустой массив в случае ошибки
        return []
    }
}

const BakersPage = async () => {
    // Получаем поваров из API
    const bakers = await getBakers()

    return (
        <div className="min-h-screen bg-bakery-50 flex flex-col">
            <Header />

            {/* Основной контент - растягивается чтобы футер был внизу */}
            <main className="flex-1 container mx-auto px-4 py-8">
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

                {/* Сообщение если поваров нет */}
                {bakers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👨‍🍳</div>
                        <h3 className="text-xl font-semibold text-bakery-1100 mb-2">
                            Поваров пока нет
                        </h3>
                        <p className="text-bakery-1050">
                            Зайдите позже или создайте поваров в панели администратора
                        </p>
                    </div>
                )}

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
            </main>

            {/* Футер - теперь всегда внизу */}
            <Footer />
        </div>
    )
}

export default BakersPage