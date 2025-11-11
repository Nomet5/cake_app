import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/categories - Получение списка категорий для клиентской части
export async function GET() {
    try {
        // Получаем категории из базы данных
        const categories = await prisma.category.findMany({
            where: {
                isActive: true // Только активные категории
            },
            include: {
                _count: {
                    select: {
                        products: {
                            where: {
                                isAvailable: true // Только товары с доступными продуктами
                            }
                        }
                    }
                }
            },
            orderBy: {
                sortOrder: 'asc'
            }
        })

        // Преобразуем данные для фронтенда
        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            productCount: category._count.products
        }))

        return NextResponse.json({
            success: true,
            data: formattedCategories,
            count: formattedCategories.length
        })

    } catch (error) {
        console.error('API Error fetching categories:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Ошибка при загрузке категорий'
            },
            { status: 500 }
        )
    }
}