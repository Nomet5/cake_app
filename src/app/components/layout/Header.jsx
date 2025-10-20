'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../ui/Button'
import SearchBar from '../ui/SearchBar'
import { useCart } from '../../context/CartContext'

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { getCartItemsCount } = useCart()
    const cartItemsCount = getCartItemsCount()

    return (
        <header className="sticky top-0 z-50 bg-bakery-50/95 backdrop-blur-md border-b border-bakery-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Лого с ссылкой на главную */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-bakery-400 to-bakery-600 rounded-xl" />
                        <span className="text-xl font-bold text-bakery-1150 font-display">BakeHub</span>
                    </Link>

                    {/* Навигация с Link */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Главная
                        </Link>
                        <Link href="/catalog" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Каталог
                        </Link>
                        <Link href="/bakers" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Пекари
                        </Link>
                        <Link href="/favorites" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Избранное
                        </Link>
                    </nav>

                    {/* Поиск и действия */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>

                        <button
                            className="md:hidden p-2 text-bakery-1050 hover:text-bakery-500 transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            🔍
                        </button>

                        {/* Ссылка на корзину с количеством товаров */}
                        <Link href="/cart" className="relative">
                            <Button variant="outline" size="sm">
                                Корзина
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-bakery-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Мобильный поиск */}
                {isSearchOpen && (
                    <div className="md:hidden pb-4">
                        <SearchBar autoFocus />
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header