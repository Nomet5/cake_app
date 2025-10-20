const Categories = () => {
    const categories = [
        { name: 'Торты', icon: '🎂', count: 45 },
        { name: 'Пироги', icon: '🥧', count: 67 },
        { name: 'Хлеб', icon: '🍞', count: 34 },
        { name: 'Десерты', icon: '🍰', count: 89 },
        { name: 'Завтраки', icon: '🥐', count: 23 },
        { name: 'Сладкая выпечка', icon: '🍪', count: 56 },
        { name: 'Праздник', icon: '🎉', count: 41 },
        { name: 'Веганское', icon: '🌱', count: 34 },
    ]

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">
                    Быстрые категории
                </h2>

                <div className="relative">
                    {/* Горизонтальный скролл */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center justify-center p-4 bg-bakery-50 rounded-2xl border border-bakery-200 hover:border-bakery-400 transition-all duration-200 min-w-[100px] flex-shrink-0 group"
                            >
                                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                    {category.icon}
                                </span>
                                <span className="text-sm font-medium text-bakery-1100 text-center font-body">
                                    {category.name}
                                </span>
                                <span className="text-xs text-bakery-1050 mt-1">
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Градиент для индикации скролла */}
                    <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    )
}

export default Categories