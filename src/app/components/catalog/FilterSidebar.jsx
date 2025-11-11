'use client'

import { useState, useEffect } from 'react'
import Button from '../common/Button'

const FilterSidebar = ({
    onFiltersChange,
    selectedCategories = [],
    priceRange = [0, 5000],
    selectedDietary = [],
    availableCategories = [] // Добавляем пропс с реальными категориями из API
}) => {
    const [localPriceRange, setLocalPriceRange] = useState(priceRange)
    const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories)
    const [localSelectedDietary, setLocalSelectedDietary] = useState(selectedDietary)

    // Синхронизируем локальное состояние с пропсами
    useEffect(() => {
        setLocalSelectedCategories(selectedCategories)
    }, [selectedCategories])

    useEffect(() => {
        setLocalPriceRange(priceRange)
    }, [priceRange])

    useEffect(() => {
        setLocalSelectedDietary(selectedDietary)
    }, [selectedDietary])

    // Статические данные для диетических особенностей
    const dietaryFeatures = [
        { name: 'Веганское', count: 34 },
        { name: 'Без глютена', count: 28 },
        { name: 'Без сахара', count: 19 },
        { name: 'Без лактозы', count: 15 },
        { name: 'Без яиц', count: 12 },
        { name: 'Низкоуглеводное', count: 22 },
        { name: 'Органическое', count: 31 }
    ]

    const toggleCategory = (categoryName) => {
        const newCategories = localSelectedCategories.includes(categoryName)
            ? localSelectedCategories.filter(cat => cat !== categoryName)
            : [...localSelectedCategories, categoryName]

        setLocalSelectedCategories(newCategories)
    }

    const toggleDietary = (dietaryName) => {
        const newDietary = localSelectedDietary.includes(dietaryName)
            ? localSelectedDietary.filter(item => item !== dietaryName)
            : [...localSelectedDietary, dietaryName]

        setLocalSelectedDietary(newDietary)
    }

    const handlePriceChange = (value) => {
        const newPriceRange = [0, parseInt(value)]
        setLocalPriceRange(newPriceRange)
    }

    const applyFilters = () => {
        onFiltersChange({
            categories: localSelectedCategories,
            priceRange: localPriceRange,
            dietary: localSelectedDietary
        })
    }

    const resetFilters = () => {
        setLocalSelectedCategories([])
        setLocalSelectedDietary([])
        setLocalPriceRange([0, 5000])
        onFiltersChange({
            categories: [],
            priceRange: [0, 5000],
            dietary: []
        })
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-bakery-1150 text-lg font-display">
                    Фильтры
                </h3>
                <button
                    className="text-bakery-500 hover:text-bakery-600 text-sm font-body"
                    onClick={resetFilters}
                >
                    Сбросить все
                </button>
            </div>

            {/* Категории товаров - теперь с реальными данными из API */}
            <div className="mb-6">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body">Категории товаров</h4>

                {availableCategories.length === 0 ? (
                    // Сообщение когда категорий нет или загружаются
                    <div className="text-center py-4">
                        <div className="text-3xl mb-2">📁</div>
                        <p className="text-bakery-1050 text-sm font-body">
                            Категории загружаются...
                        </p>
                    </div>
                ) : (
                    // Список реальных категорий из API
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableCategories.map((category) => (
                            <label
                                key={category.id}
                                className="flex items-center justify-between group cursor-pointer hover:bg-bakery-50 px-2 py-1 rounded transition-colors"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={localSelectedCategories.includes(category.name)}
                                        onChange={() => toggleCategory(category.name)}
                                        className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400"
                                    />
                                    <span className="ml-2 text-bakery-1050 text-sm group-hover:text-bakery-1100 transition-colors font-body">
                                        {category.name}
                                    </span>
                                </div>
                                <span className="text-bakery-400 text-xs bg-bakery-50 px-2 py-1 rounded-full">
                                    {category.productCount}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Диапазон цен */}
            <div className="mb-6">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body">Диапазон цен</h4>
                <div className="space-y-4">
                    <div className="flex justify-between text-bakery-1050 text-sm">
                        <span>0₽</span>
                        <span>5000₽</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        value={localPriceRange[1]}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full h-2 bg-bakery-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bakery-500"
                    />
                    <div className="text-center text-bakery-500 font-semibold">
                        до {localPriceRange[1]}₽
                    </div>
                </div>
            </div>

            {/* Особенности питания */}
            <div className="mb-6">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body">Особенности питания</h4>
                <div className="space-y-2">
                    {dietaryFeatures.map((feature) => (
                        <label key={feature.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={localSelectedDietary.includes(feature.name)}
                                    onChange={() => toggleDietary(feature.name)}
                                    className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400"
                                />
                                <span className="ml-2 text-bakery-1050 text-sm group-hover:text-bakery-1100 transition-colors font-body">
                                    {feature.name}
                                </span>
                            </div>
                            <span className="text-bakery-400 text-xs bg-bakery-50 px-2 py-1 rounded-full">
                                {feature.count}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Индикатор активных фильтров */}
            {(localSelectedCategories.length > 0 || localSelectedDietary.length > 0 || localPriceRange[1] < 5000) && (
                <div className="mb-4 p-3 bg-bakery-50 rounded-lg border border-bakery-200">
                    <p className="text-bakery-1100 text-sm font-body font-semibold mb-2">
                        Активные фильтры:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {localSelectedCategories.map(category => (
                            <span
                                key={category}
                                className="bg-bakery-500 text-white text-xs px-2 py-1 rounded-full font-body"
                            >
                                {category}
                            </span>
                        ))}
                        {localSelectedDietary.map(dietary => (
                            <span
                                key={dietary}
                                className="bg-bakery-300 text-bakery-1100 text-xs px-2 py-1 rounded-full font-body"
                            >
                                {dietary}
                            </span>
                        ))}
                        {localPriceRange[1] < 5000 && (
                            <span className="bg-bakery-400 text-white text-xs px-2 py-1 rounded-full font-body">
                                до {localPriceRange[1]}₽
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Кнопка применения фильтров */}
            <Button
                className="w-full"
                onClick={applyFilters}
                disabled={availableCategories.length === 0}
            >
                {availableCategories.length === 0 ? 'Загрузка...' : 'Применить фильтры'}
            </Button>
        </div>
    )
}

export default FilterSidebar