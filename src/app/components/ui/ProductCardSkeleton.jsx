const ProductCardSkeleton = () => {
    return (
        <div className="bg-bakery-50 rounded-2xl p-4 shadow-bakery-soft border border-bakery-200 animate-pulse">
            {/* Изображение товара */}
            <div className="bg-bakery-200 rounded-xl w-full h-48 mb-4"></div>

            {/* Информация о товаре */}
            <div className="mb-4">
                {/* Название */}
                <div className="h-5 bg-bakery-200 rounded mb-2"></div>
                <div className="h-4 bg-bakery-200 rounded w-3/4 mb-2"></div>

                {/* Рейтинг и пекарь */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-bakery-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-3 bg-bakery-150 rounded w-16"></div>
                </div>

                {/* Вес/порции */}
                <div className="h-3 bg-bakery-150 rounded w-24 mb-2"></div>
            </div>

            {/* Цена и кнопка */}
            <div className="flex items-center justify-between">
                <div className="h-7 bg-bakery-200 rounded w-20"></div>
                <div className="w-20 h-8 bg-bakery-200 rounded-lg"></div>
            </div>
        </div>
    )
}

export default ProductCardSkeleton