'use client'

import { useState } from 'react'
import Button from '../common/Button'

const FilterSidebar = ({
    onFiltersChange,
    selectedCategories = [],
    priceRange = [0, 5000],
    selectedDietary = []
}) => {
    const [localPriceRange, setLocalPriceRange] = useState(priceRange)
    const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories)
    const [localSelectedDietary, setLocalSelectedDietary] = useState(selectedDietary)

    const categories = [
        { name: 'Торты', count: 45 },
        { name: 'Пироги', count: 67 },
        { name: 'Хлеб', count: 34 },
        { name: 'Десерты', count: 89 },
        { name: 'Обеды и основные блюда', count: 23 },
        { name: 'Сладкая выпечка', count: 56 },
        { name: 'Утренняя выпечка', count: 41 }
    ]

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
        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200 2xl:p-8 2xl:rounded-3xl">
            <div className="flex items-center justify-between mb-6 2xl:mb-8">
                <h3 className="font-bold text-bakery-1150 text-lg font-display 2xl:text-xl">
                    Фильтры
                </h3>
                <button
                    className="text-bakery-500 hover:text-bakery-600 text-sm font-body 2xl:text-base"
                    onClick={resetFilters}
                >
                    Сбросить все
                </button>
            </div>

            {/* Категории товаров */}
            <div className="mb-6 2xl:mb-8">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body 2xl:text-lg 2xl:mb-4">Категории товаров</h4>
                <div className="space-y-2 2xl:space-y-3">
                    {categories.map((category) => (
                        <label key={category.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={localSelectedCategories.includes(category.name)}
                                    onChange={() => toggleCategory(category.name)}
                                    className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400 2xl:w-5 2xl:h-5"
                                />
                                <span className="ml-2 text-bakery-1050 text-sm group-hover:text-bakery-1100 transition-colors font-body 2xl:text-base 2xl:ml-3">
                                    {category.name}
                                </span>
                            </div>
                            <span className="text-bakery-400 text-xs bg-bakery-50 px-2 py-1 rounded-full 2xl:text-sm 2xl:px-3 2xl:py-1.5">
                                {category.count}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Диапазон цен */}
            <div className="mb-6 2xl:mb-8">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body 2xl:text-lg 2xl:mb-4">Диапазон цен</h4>
                <div className="space-y-4 2xl:space-y-5">
                    <div className="flex justify-between text-bakery-1050 text-sm 2xl:text-base">
                        <span>0₽</span>
                        <span>5000₽</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        value={localPriceRange[1]}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full h-2 bg-bakery-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bakery-500 2xl:h-3 2xl:[&::-webkit-slider-thumb]:h-5 2xl:[&::-webkit-slider-thumb]:w-5"
                    />
                    <div className="text-center text-bakery-500 font-semibold 2xl:text-lg">
                        до {localPriceRange[1]}₽
                    </div>
                </div>
            </div>

            {/* Особенности питания */}
            <div className="mb-6 2xl:mb-8">
                <h4 className="font-semibold text-bakery-1100 mb-3 font-body 2xl:text-lg 2xl:mb-4">Особенности питания</h4>
                <div className="space-y-2 2xl:space-y-3">
                    {dietaryFeatures.map((feature) => (
                        <label key={feature.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={localSelectedDietary.includes(feature.name)}
                                    onChange={() => toggleDietary(feature.name)}
                                    className="w-4 h-4 text-bakery-500 border-bakery-300 rounded focus:ring-bakery-400 2xl:w-5 2xl:h-5"
                                />
                                <span className="ml-2 text-bakery-1050 text-sm group-hover:text-bakery-1100 transition-colors font-body 2xl:text-base 2xl:ml-3">
                                    {feature.name}
                                </span>
                            </div>
                            <span className="text-bakery-400 text-xs bg-bakery-50 px-2 py-1 rounded-full 2xl:text-sm 2xl:px-3 2xl:py-1.5">
                                {feature.count}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Кнопка применения фильтров */}
            <Button className="w-full 2xl:py-4 2xl:text-lg" onClick={applyFilters}>
                Применить фильтры
            </Button>
        </div>
    )
}

export default FilterSidebar