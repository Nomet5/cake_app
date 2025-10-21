const ProductPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-bakery-50">
            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-4 bg-bakery-250 rounded w-16"></div>
                    <div className="h-4 bg-bakery-250 rounded w-4"></div>
                    <div className="h-4 bg-bakery-250 rounded w-20"></div>
                    <div className="h-4 bg-bakery-250 rounded w-4"></div>
                    <div className="h-4 bg-bakery-250 rounded w-12"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Левая колонка - изображение */}
                    <div>
                        <div className="bg-white rounded-2xl p-8 shadow-bakery-soft border border-bakery-200">
                            <div className="w-full h-96 bg-bakery-150 rounded-xl mb-4 animate-pulse"></div>
                            <div className="flex gap-4 mt-6">
                                <div className="flex-1 h-12 bg-bakery-250 rounded-xl"></div>
                                <div className="flex-1 h-12 bg-bakery-250 rounded-xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - информация */}
                    <div className="space-y-6">
                        {/* Заголовок и рейтинг */}
                        <div>
                            <div className="h-10 bg-bakery-250 rounded mb-4 w-3/4"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 bg-bakery-250 rounded"></div>
                                    ))}
                                </div>
                                <div className="h-4 bg-bakery-200 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-bakery-200 rounded w-40"></div>
                        </div>

                        {/* Основная информация */}
                        <div className="bg-bakery-150 rounded-2xl p-6 space-y-4">
                            <div className="flex justify-between">
                                <div className="h-8 bg-bakery-250 rounded w-24"></div>
                                <div className="h-4 bg-bakery-200 rounded w-32"></div>
                            </div>
                            <div className="h-4 bg-bakery-200 rounded w-48"></div>
                        </div>

                        {/* Описание */}
                        <div className="space-y-2">
                            <div className="h-4 bg-bakery-250 rounded"></div>
                            <div className="h-4 bg-bakery-250 rounded w-5/6"></div>
                            <div className="h-4 bg-bakery-250 rounded w-4/6"></div>
                        </div>

                        {/* Состав и аллергены */}
                        <div>
                            <div className="h-6 bg-bakery-250 rounded w-40 mb-3"></div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-6 bg-bakery-250 rounded-full w-16"></div>
                                ))}
                            </div>
                            <div className="h-4 bg-bakery-200 rounded w-32"></div>
                        </div>

                        {/* Персонализация */}
                        <div>
                            <div className="h-6 bg-bakery-250 rounded w-40 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 bg-bakery-250 rounded-xl"></div>
                                ))}
                            </div>
                        </div>

                        {/* Цена и кнопка */}
                        <div className="flex items-center justify-between">
                            <div className="h-10 bg-bakery-250 rounded w-32"></div>
                            <div className="h-12 bg-bakery-250 rounded-xl w-48"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPageSkeleton