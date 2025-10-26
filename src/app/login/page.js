// src/app/login/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/ui/FadeIn'
import Button from '../components/ui/Button'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Имитация запроса на сервер
        setTimeout(() => {
            setIsLoading(false)
            console.log('Login attempt:', formData)
            // Здесь будет реальная логика входа
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-bakery-50 flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <FadeIn>
                    <div className="max-w-md w-full space-y-8">
                        {/* Заголовок */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-bakery-1150 font-display mb-2">
                                Войти в аккаунт
                            </h1>
                            <p className="text-bakery-1050 font-body">
                                Войдите, чтобы управлять заказами и избранным
                            </p>
                        </div>

                        {/* Форма */}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                        Пароль
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                        placeholder="Введите пароль"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-bakery-500 border-bakery-200 rounded focus:ring-bakery-400"
                                    />
                                    <span className="ml-2 text-sm text-bakery-1050 font-body">
                                        Запомнить меня
                                    </span>
                                </label>

                                <Link href="/forgot-password" className="text-sm text-bakery-500 hover:text-bakery-600 font-body">
                                    Забыли пароль?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Вход...' : 'Войти'}
                            </Button>

                            <div className="text-center">
                                <p className="text-bakery-1050 font-body">
                                    Еще нет аккаунта?{' '}
                                    <Link href="/register" className="text-bakery-500 hover:text-bakery-600 font-medium">
                                        Зарегистрироваться
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Разделитель */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-bakery-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-bakery-50 text-bakery-1050 font-body">Или</span>
                            </div>
                        </div>

                        {/* Социальные сети */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-3 px-4 border border-bakery-200 rounded-xl text-sm font-medium text-bakery-1100 bg-white hover:bg-bakery-50 transition-colors font-body"
                            >
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-3 px-4 border border-bakery-200 rounded-xl text-sm font-medium text-bakery-1100 bg-white hover:bg-bakery-50 transition-colors font-body"
                            >
                                <span>VK</span>
                            </button>
                        </div>
                    </div>
                </FadeIn>
            </div>

            <Footer />
        </div>
    )
}