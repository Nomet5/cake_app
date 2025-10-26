// src/app/profile/page.js
'use client'

import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/ui/FadeIn'
import Button from '../components/ui/Button'
import Link from 'next/link'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile')

    // Mock данные пользователя
    const [userData, setUserData] = useState({
        name: 'Анна Петрова',
        email: 'anna@example.com',
        phone: '+7 (912) 345-67-89',
        avatar: '/api/placeholder/100/100',
        joinDate: '15 января 2024'
    })

    const [orders, setOrders] = useState([
        {
            id: 'ORD-001',
            date: '2024-01-20',
            total: 3200,
            status: 'delivered',
            items: ['Шоколадный торт', 'Круассаны x2']
        },
        {
            id: 'ORD-002',
            date: '2024-01-18',
            total: 1800,
            status: 'processing',
            items: ['Медовик классический']
        }
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'text-green-600 bg-green-100'
            case 'processing': return 'text-blue-600 bg-blue-100'
            case 'cancelled': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'delivered': return 'Доставлен'
            case 'processing': return 'В обработке'
            case 'cancelled': return 'Отменен'
            default: return 'Неизвестно'
        }
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
                                        👩‍🍳
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
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-body ${activeTab === 'settings'
                                                ? 'bg-bakery-500 text-white'
                                                : 'text-bakery-1100 hover:bg-bakery-100'
                                            }`}
                                    >
                                        ⚙️ Настройки
                                    </button>
                                </nav>
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

                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-bakery-200 rounded-xl p-4 hover:shadow-bakery-soft transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-semibold text-bakery-1150 font-body">
                                                            Заказ #{order.id}
                                                        </h3>
                                                        <p className="text-bakery-1050 text-sm font-body">
                                                            {new Date(order.date).toLocaleDateString('ru-RU')}
                                                        </p>
                                                        <p className="text-bakery-1050 text-sm font-body">
                                                            {order.items.join(', ')}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className="text-lg font-bold text-bakery-500 font-body">
                                                            {order.total}₽
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} font-body`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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

                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
                                    <h1 className="text-2xl font-bold text-bakery-1150 mb-6 font-display">
                                        Настройки аккаунта
                                    </h1>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-bakery-1150 mb-4 font-body">Уведомления</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="w-4 h-4 text-bakery-500 border-bakery-200 rounded focus:ring-bakery-400" defaultChecked />
                                                    <span className="ml-2 text-bakery-1100 font-body">Уведомления о заказах</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="w-4 h-4 text-bakery-500 border-bakery-200 rounded focus:ring-bakery-400" defaultChecked />
                                                    <span className="ml-2 text-bakery-1100 font-body">Специальные предложения</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="w-4 h-4 text-bakery-500 border-bakery-200 rounded focus:ring-bakery-400" />
                                                    <span className="ml-2 text-bakery-1100 font-body">Новости от пекарей</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-bakery-200">
                                            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                                                Выйти из аккаунта
                                            </Button>
                                        </div>
                                    </div>
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