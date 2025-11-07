'use server'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Регистрация нового пользователя
export async function registerUser(formData: {
    name: string
    email: string
    password: string
}) {
    try {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await prisma.user.findUnique({
            where: { email: formData.email }
        })

        if (existingUser) {
            return {
                success: false,
                error: 'Пользователь с таким email уже существует'
            }
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(formData.password, 12)

        // Создаем пользователя
        const user = await prisma.user.create({
            data: {
                firstName: formData.name,
                email: formData.email,
                passwordHash: hashedPassword,
                role: 'CUSTOMER' // По умолчанию обычный пользователь
            }
        })

        // Возвращаем данные без пароля
        const { passwordHash, ...userWithoutPassword } = user

        return {
            success: true,
            user: userWithoutPassword,
            message: 'Регистрация прошла успешно!'
        }

    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            error: 'Ошибка при регистрации. Попробуйте еще раз.'
        }
    }
}

// Вход пользователя
export async function loginUser(formData: {
    email: string
    password: string
}) {
    try {
        // Ищем пользователя по email
        const user = await prisma.user.findUnique({
            where: { email: formData.email }
        })

        if (!user) {
            return {
                success: false,
                error: 'Пользователь с таким email не найден'
            }
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(formData.password, user.passwordHash)

        if (!isPasswordValid) {
            return {
                success: false,
                error: 'Неверный пароль'
            }
        }

        // Возвращаем данные без пароля
        const { passwordHash, ...userWithoutPassword } = user

        return {
            success: true,
            user: userWithoutPassword,
            message: 'Вход выполнен успешно!'
        }

    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            error: 'Ошибка при входе. Попробуйте еще раз.'
        }
    }
}

// Получение текущего пользователя (для проверки авторизации)
export async function getCurrentUser(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true
            }
        })

        return user
    } catch (error) {
        console.error('Get current user error:', error)
        return null
    }
}