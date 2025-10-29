// src/app/login/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FadeIn from '../components/common/FadeIn'
import Button from '../components/common/Button'

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

        setTimeout(() => {
            setIsLoading(false)
            console.log('Login attempt:', formData)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-bakery-700 flex flex-col relative overflow-hidden">

            {/* Фоновые элементы - тонкие */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-bakery-200 rounded-full opacity-30 animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-bakery-300 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                {/* Плавающая выпечка - более заметные */}
                <div className="absolute bottom-32 left-32 text-5xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🥖</div>
                <div className="absolute bottom-40 right-20 text-6xl opacity-15 animate-float" style={{ animationDelay: '4s' }}>🍪</div>
                <div className="absolute bottom-60 right-1/3 text-6xl opacity-15 animate-float" style={{ animationDelay: '5s' }}>🧁</div>

                {/* Декоративные линии */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bakery-300/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bakery-400/20 to-transparent"></div>
            </div>

            <Header />

            <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
                <FadeIn>
                    <div className="max-w-md w-full">
                        {/* Основная карточка */}
                        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/70">
                            {/* Акцентный бордер */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-bakery-100/80 via-white/50 to-bakery-200/80 border-2 border-white/90 shadow-inner"></div>
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-bakery-400/20 to-bakery-600/20 blur-sm opacity-50"></div>

                            <div className="relative z-10">
                                {/* Заголовок с иконкой */}
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-bakery-400 to-bakery-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-3xl text-white">👨‍🍳</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-bakery-1150 font-display mb-3 bg-gradient-to-br from-bakery-600 to-bakery-800 bg-clip-text text-transparent">
                                        С возвращением!
                                    </h1>
                                    <p className="text-bakery-1050 font-body text-lg">
                                        Войдите в свой аккаунт
                                    </p>
                                </div>

                                {/* Форма */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
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
                                                    className="w-full px-4 py-3 bg-white/80 border-2 border-bakery-200/60 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400 transition-all duration-300 font-body placeholder-bakery-400/60 backdrop-blur-sm"
                                                    placeholder="your@email.com"
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bakery-400">
                                                    ✉️
                                                </div>
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
                                                    className="w-full px-4 py-3 bg-white/80 border-2 border-bakery-200/60 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-bakery-400 transition-all duration-300 font-body placeholder-bakery-400/60 backdrop-blur-sm"
                                                    placeholder="••••••••"
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bakery-400">
                                                    🔒
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-bakery-500 border-2 border-bakery-200 rounded focus:ring-bakery-400 bg-white/80"
                                            />
                                            <span className="ml-2 text-sm text-bakery-1050 font-body">
                                                Запомнить меня
                                            </span>
                                        </label>

                                        <Link href="/forgot-password" className="text-sm text-bakery-500 hover:text-bakery-600 font-body transition-colors">
                                            Забыли пароль?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-bakery-500 to-bakery-600 hover:from-bakery-600 hover:to-bakery-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                                Вход...
                                            </div>
                                        ) : (
                                            'Войти в аккаунт'
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-bakery-1050 font-body">
                                            Еще нет аккаунта?{' '}
                                            <Link href="/register" className="text-bakery-500 hover:text-bakery-600 font-medium transition-colors">
                                                Зарегистрироваться
                                            </Link>
                                        </p>
                                    </div>
                                </form>

                                {/* Разделитель */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-bakery-200/60"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-white/90 text-bakery-1050 font-body backdrop-blur-sm">Или войдите с помощью</span>
                                    </div>
                                </div>

                                {/* Социальные сети */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-bakery-200/60 rounded-xl text-sm font-medium text-bakery-1100 bg-white/80 hover:bg-white hover:border-bakery-300 transition-all duration-300 backdrop-blur-sm font-body hover:shadow-md"
                                    >
                                        <span className="mr-2">🔍</span>
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-bakery-200/60 rounded-xl text-sm font-medium text-bakery-1100 bg-white/80 hover:bg-white hover:border-bakery-300 transition-all duration-300 backdrop-blur-sm font-body hover:shadow-md"
                                    >
                                        <span className="mr-2">🌐</span>
                                        VK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Декоративный нижний элемент */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bakery-300/10 to-transparent pointer-events-none"></div>

            
        </div>
    )
}