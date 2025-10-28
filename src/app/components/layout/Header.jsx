'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../ui/Button'
import SearchBar from '../ui/SearchBar'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { getCartItemsCount } = useCart()
    const { favoritesCount } = useFavorites()
    const cartItemsCount = getCartItemsCount()

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-50 bg-bakery-50/95 backdrop-blur-md border-b border-bakery-200">
            <div className="container mx-auto px-4 pt-4 pb-4">
                <div className="flex items-center justify-between h-16">
                    {/* Лого и бургер меню для мобильных */}
                    <div className="flex items-center gap-4">
                        {/* Бургер меню для мобильных */}
                        <button
                            className="md:hidden p-2 text-bakery-1050 hover:text-bakery-500 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            ☰
                        </button>

                        {/* Логотип */}
                        <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                            <div> <img src='/images/categories/logo.jpg' className="w-26 h-20" /> </div>
                        </Link>
                    </div>

                    {/* Навигация для десктопа */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/catalog" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Каталог
                        </Link>
                        <Link href="/bakers" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body">
                            Пекари
                        </Link>
                        <Link href="/favorites" className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body relative">
                            Избранное
                            {favoritesCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {favoritesCount}
                                </span>
                            )}
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
                        <Link href="/profile" className="p-2 text-bakery-1050 hover:text-bakery-500 transition-colors">
                            👤
                        </Link>
                    </div>
                </div>

                {/* Мобильный поиск */}
                {isSearchOpen && (
                    <div className="md:hidden pb-4">
                        <SearchBar autoFocus />
                    </div>
                )}

                {/* Мобильное меню */}
                {isMobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 bg-white border-b border-bakery-200 shadow-lg md:hidden">
                        <div className="container mx-auto px-4 py-4">
                            <nav className="flex flex-col gap-1">
                                <Link
                                    href="/"
                                    className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body py-3 px-4 rounded-lg hover:bg-bakery-50"
                                    onClick={closeMobileMenu}
                                >
                                    Главная
                                </Link>
                                <Link
                                    href="/catalog"
                                    className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body py-3 px-4 rounded-lg hover:bg-bakery-50"
                                    onClick={closeMobileMenu}
                                >
                                    Каталог
                                </Link>
                                <Link
                                    href="/bakers"
                                    className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body py-3 px-4 rounded-lg hover:bg-bakery-50"
                                    onClick={closeMobileMenu}
                                >
                                    Пекари
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="text-bakery-1100 hover:text-bakery-500 font-medium transition-colors font-body py-3 px-4 rounded-lg hover:bg-bakery-50 flex items-center justify-between"
                                    onClick={closeMobileMenu}
                                >
                                    <span>Избранное</span>
                                    {favoritesCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header