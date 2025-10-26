// src/app/register/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/ui/FadeIn'
import Button from '../components/ui/Button'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            alert('Пароли не совпадают')
            return
        }

        setIsLoading(true)

        // Имитация запроса на сервер
        setTimeout(() => {
            setIsLoading(false)
            console.log('Registration attempt:', formData)
            // Здесь будет реальная логика регистрации
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
                                Создать аккаунт
                            </h1>
                            <p className="text-bakery-1050 font-body">
                                Присоединяйтесь к сообществу пекарей и любителей домашней еды
                            </p>
                        </div>

                        {/* Форма */}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                        Имя
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                        placeholder="Ваше имя"
                                    />
                                </div>

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
                                        placeholder="Не менее 6 символов"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                        Подтвердите пароль
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-colors font-body"
                                        placeholder="Повторите пароль"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="agree-terms"
                                    name="agree-terms"
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 text-bakery-500 border-bakery-200 rounded focus:ring-bakery-400"
                                />
                                <label htmlFor="agree-terms" className="ml-2 block text-sm text-bakery-1050 font-body">
                                    Я соглашаюсь с{' '}
                                    <Link href="/terms" className="text-bakery-500 hover:text-bakery-600">
                                        условиями использования
                                    </Link>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                            </Button>

                            <div className="text-center">
                                <p className="text-bakery-1050 font-body">
                                    Уже есть аккаунт?{' '}
                                    <Link href="/login" className="text-bakery-500 hover:text-bakery-600 font-medium">
                                        Войти
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </FadeIn>
            </div>

            <Footer />
        </div>
    )
}