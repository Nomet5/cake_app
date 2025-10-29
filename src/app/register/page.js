// src/app/register/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/common/FadeIn'
import Button from '../components/common/Button'

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

        setTimeout(() => {
            setIsLoading(false)
            console.log('Registration attempt:', formData)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-bakery-700 flex flex-col relative overflow-hidden">
            <Header />

            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <FadeIn>
                    <div className="max-w-md w-full">
                        {/* Декоративные элементы */}
                        <div className="relative">
                            <div className="absolute -top-8 -left-8 w-16 h-16 bg-bakery-300 rounded-full opacity-20"></div>
                            <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-bakery-400 rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 -left-10 w-8 h-8 bg-bakery-500 rounded-full opacity-40"></div>

                            {/* Основная карточка */}
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-bakery-soft border border-white/60">
                                {/* Декоративный бордер */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-bakery-100/50 to-bakery-300/30 border-2 border-white/80 shadow-inner"></div>

                                <div className="relative z-10">
                                    {/* Заголовок */}
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-bakery-400 to-bakery-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-bakery-soft">
                                            <span className="text-2xl text-white">🎂</span>
                                        </div>
                                        <h1 className="text-3xl font-bold text-bakery-1150 font-display mb-2">
                                            Присоединяйтесь!
                                        </h1>
                                        <p className="text-bakery-1050 font-body">
                                            Создайте аккаунт и откройте мир домашней еды
                                        </p>
                                    </div>

                                    {/* Форма */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                    Имя
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-white/50 border-2 border-bakery-200/50 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400/50 transition-all duration-300 font-body placeholder-bakery-400/50 backdrop-blur-sm"
                                                        placeholder="Ваше имя"
                                                    />
                                                  
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                    Email
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-white/50 border-2 border-bakery-200/50 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400/50 transition-all duration-300 font-body placeholder-bakery-400/50 backdrop-blur-sm"
                                                        placeholder="your@email.com"
                                                    />
                                                    
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                    Пароль
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-white/50 border-2 border-bakery-200/50 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400/50 transition-all duration-300 font-body placeholder-bakery-400/50 backdrop-blur-sm"
                                                        placeholder="Не менее 6 символов"
                                                    />
                                                    
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-bakery-1100 mb-2 font-body">
                                                    Подтвердите пароль
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        type="password"
                                                        required
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 bg-white/50 border-2 border-bakery-200/50 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400/50 transition-all duration-300 font-body placeholder-bakery-400/50 backdrop-blur-sm"
                                                        placeholder="Повторите пароль"
                                                    />
                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="agree-terms"
                                                name="agree-terms"
                                                type="checkbox"
                                                required
                                                className="w-4 h-4 text-bakery-500 border-2 border-bakery-200 rounded focus:ring-bakery-400 bg-white/50"
                                            />
                                            <label htmlFor="agree-terms" className="ml-2 block text-sm text-bakery-1050 font-body">
                                                Я соглашаюсь с{' '}
                                                <Link href="/terms" className="text-bakery-500 hover:text-bakery-600 transition-colors">
                                                    условиями использования
                                                </Link>
                                            </label>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-bakery-500 to-bakery-600 hover:from-bakery-600 hover:to-bakery-700 shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 transform hover:scale-105"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                    Регистрация...
                                                </div>
                                            ) : (
                                                'Создать аккаунт'
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <p className="text-bakery-1050 font-body">
                                                Уже есть аккаунт?{' '}
                                                <Link href="/login" className="text-bakery-500 hover:text-bakery-600 font-medium transition-colors">
                                                    Войти
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                
            </div>

            <Footer />
        </div>
    )
}