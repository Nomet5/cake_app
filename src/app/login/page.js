// src/app/login/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import FadeIn from '../components/common/FadeIn'
import Button from '../components/common/Button'
import { loginUser } from '../actions/client/auth.actions.ts'

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // Очищаем ошибки при изменении формы
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setIsLoading(true)

        try {
            const result = await loginUser({
                email: formData.email,
                password: formData.password
            })

            if (result.success) {
                setSuccess('Вход выполнен успешно!')

                // Сохраняем пользователя в localStorage
                localStorage.setItem('auth_token', 'user_' + result.user.id)
                localStorage.setItem('user', JSON.stringify(result.user))

                // Перенаправляем на главную страницу через 1 секунду
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
            } else {
                setError(result.error || 'Ошибка при входе')
            }
        } catch (error) {
            setError('Произошла ошибка. Попробуйте еще раз.')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen auth-background flex flex-col relative overflow-hidden">
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
                                        <div className="w-20 h-20 bg-bakery-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-bakery-soft">
                                            <img
                                                src="/images/auth/icon_profile.png"
                                                alt="Вход"
                                            />
                                        </div>
                                        <h1 className="text-3xl font-bold text-bakery-1150 font-display mb-2">
                                            С возвращением!
                                        </h1>
                                        <p className="text-bakery-1050 font-body">
                                            Войдите в свой аккаунт
                                        </p>
                                    </div>

                                    {/* Сообщения об ошибках/успехе */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm font-body">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-xl text-sm font-body">
                                            {success}
                                        </div>
                                    )}

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
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-bakery-500 border-2 border-bakery-200 rounded focus:ring-bakery-400 bg-white/50"
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
                                            className="w-full shadow-bakery-soft hover:shadow-bakery-medium transition-all duration-300 transform hover:scale-105"
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
                                    {/* <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-bakery-200/50"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-3 bg-white/80 text-bakery-1050 font-body backdrop-blur-sm">Или войдите с помощью</span>
                                        </div>
                                    </div> */}

                                    {/* Социальные сети */}
                                    {/* <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-bakery-200/50 rounded-xl text-sm font-medium text-bakery-1100 bg-white/50 hover:bg-white hover:border-bakery-300 transition-all duration-300 backdrop-blur-sm font-body hover:shadow-md"
                                        >
                                            <span className="mr-2">🔍</span>
                                            Google
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-bakery-200/50 rounded-xl text-sm font-medium text-bakery-1100 bg-white/50 hover:bg-white hover:border-bakery-300 transition-all duration-300 backdrop-blur-sm font-body hover:shadow-md"
                                        >
                                            <span className="mr-2">🌐</span>
                                            VK
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}