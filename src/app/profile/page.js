// src/app/profile/page.js
'use client'

import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/common/FadeIn'
import Button from '../components/common/Button'
import Link from 'next/link'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Загружаем данные пользователя при загрузке страницы
    useEffect(() => {
        loadUserData()
    }, [])

    const loadUserData = () => {
        try {
            const user = localStorage.getItem('user')
            if (user) {
                const userData = JSON.parse(user)
                setUserData({
                    name: userData.firstName || 'Пользователь',
                    email: userData.email,
                    phone: userData.phone || '',
                    joinDate: new Date(userData.createdAt).toLocaleDateString('ru-RU') || 'Неизвестно'
                })
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bakery-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-bakery-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-bakery-1050 font-body">Загрузка...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-bakery-50 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-bakery-1150 mb-4 font-display">
                            Доступ запрещен
                        </h2>
                        <p className="text-bakery-1050 mb-6 font-body">
                            Для просмотра профиля необходимо войти в систему
                        </p>
                        <Link href="/login">
                            <Button>Войти в аккаунт</Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bakery-50 flex flex-col">
            <Header />

            <div className="flex-1 container mx-auto px-4 py-8">
                <FadeIn>
                    {/* Хлебные крошки */}
                    <div className="flex items-center gap-2 text-bakery-1050 text-sm mb-8 font-body">
                        <Link href="/" className="hover:text-bakery-500 transition-colors">Главная</Link>
                        <span>•</span>
                        <span className="text-bakery-500">Личный кабинет</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Боковая панель */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                {/* Аватар и имя */}
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-bakery-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                                        {userData.name ? userData.name.charAt(0).toUpperCase() : '👤'}
                                    </div>
                                    <h2 className="font-semibold text-bakery-1150 font-body">{userData.name}</h2>
                                    <p className="text-bakery-1050 text-sm font-body">{userData.email}</p>
                                </div>

                                {/* Навигация */}
                                <nav className="space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-body ${activeTab === 'profile'
                                            ? 'bg-bakery-500 text-white'
                                            : 'text-bakery-1100 hover:bg-bakery-100'
                                            }`}
                                    >
                                        📝 Профиль
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-body ${activeTab === 'orders'
                                            ? 'bg-bakery-500 text-white'
                                            : 'text-bakery-1100 hover:bg-bakery-100'
                                            }`}
                                    >
                                        📦 Заказы
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('favorites')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-body ${activeTab === 'favorites'
                                            ? 'bg-bakery-500 text-white'
                                            : 'text-bakery-1100 hover:bg-bakery-100'
                                            }`}
                                    >
                                        ❤️ Избранное
                                    </button>
                                </nav>

                                {/* Кнопка выхода */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-6 text-left px-4 py-3 rounded-xl transition-colors font-body text-red-600 hover:bg-red-50"
                                >
                                    🚪 Выйти
                                </button>
                            </div>
                        </aside>

                        {/* Основной контент */}
                        <main className="lg:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                    <h1 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">
                                        Личные данные
                                    </h1>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                Имя
                                            </label>
                                            <input
                                                type="text"
                                                value={userData.name}
                                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                Телефон
                                            </label>
                                            <input
                                                type="tel"
                                                value={userData.phone}
                                                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                                placeholder="+7 (XXX) XXX-XX-XX"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                Дата регистрации
                                            </label>
                                            <input
                                                type="text"
                                                value={userData.joinDate}
                                                disabled
                                                className="w-full px-4 py-3 border border-bakery-200 rounded-xl bg-bakery-50 text-bakery-1050 font-body"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-4">
                                        <Button>Сохранить изменения</Button>
                                        <Button variant="outline">Отмена</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                    <h1 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">
                                        История заказов
                                    </h1>
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📦</div>
                                        <h3 className="text-xl font-semibold text-bakery-1100 mb-2">
                                            Заказов пока нет
                                        </h3>
                                        <p className="text-bakery-1050 mb-6">
                                            Сделайте свой первый заказ и он появится здесь
                                        </p>
                                        <Link href="/catalog">
                                            <Button>Перейти в каталог</Button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                    <h1 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">
                                        Избранные товары
                                    </h1>
                                    <p className="text-bakery-1050 font-body">
                                        Перейдите на страницу <Link href="/favorites" className="text-bakery-500 hover:text-bakery-600">Избранное</Link> чтобы просмотреть все понравившиеся товары.
                                    </p>
                                </div>
                            )}
                        </main>
                    </div>
                </FadeIn>
            </div>

            <Footer />
        </div>
    )
}