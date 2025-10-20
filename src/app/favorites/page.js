import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Link from 'next/link'

const FavoritesPage = () => {
    return (
        <div className="min-h-screen bg-bakery-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-6 font-body">
                    <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                    <span>•</span>
                    <span className="text-bakery-500">Избранное</span>
                </div>

                {/* Заголовок */}
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">❤️</div>
                    <h1 className="text-3xl font-bold text-bakery-1150 mb-4 font-display">
                        Избранное
                    </h1>
                    <p className="text-bakery-1050 text-lg mb-8 font-body">
                        Здесь будут ваши любимые товары и пекари
                    </p>
                    <Link href="/catalog">
                        <button className="bg-bakery-500 text-white px-8 py-3 rounded-xl hover:bg-bakery-600 transition-colors font-body">
                            Найти угощения
                        </button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default FavoritesPage