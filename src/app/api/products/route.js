import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/products - Получение списка товаров для клиентской части
export async function GET(request) {
    try {
        // Получаем параметры из URL
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const category = searchParams.get('category') || ''
        const categories = searchParams.get('categories') || '' // Множественные категории
        const limit = parseInt(searchParams.get('limit')) || 50

        // Базовые условия для запроса
        const where = {
            isAvailable: true // Только доступные товары
        }

        // Поиск по названию или описанию
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Фильтрация по одной категории (для обратной совместимости)
        if (category) {
            where.category = {
                name: category
            }
        }

        // Фильтрация по множественным категориям
        if (categories) {
            const categoryNames = categories.split(',')
            where.category = {
                name: {
                    in: categoryNames
                }
            }
        }

        // Получаем товары из базы данных
        const products = await prisma.product.findMany({
            where,
            include: {
                chef: {
                    select: {
                        businessName: true,
                        user: {
                            select: {
                                firstName: true
                            }
                        }
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                },
                images: {
                    where: { isPrimary: true },
                    take: 1
                },
                reviews: {
                    select: {
                        rating: true
                    }
                },
                _count: {
                    select: {
                        reviews: true,
                        orderItems: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        // Преобразуем данные для фронтенда
        const formattedProducts = products.map(product => {
            // Вычисляем средний рейтинг
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 4.5 // Дефолтный рейтинг если отзывов нет

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                rating: Math.round(avgRating * 10) / 10, // Округляем до 1 знака
                reviews: product._count.reviews,
                baker: product.chef.businessName,
                weight: '1.5 кг', // Пока статическое значение
                servings: '8-10 порций', // Пока статическое значение
                category: product.category?.name || 'Без категории',
                dietary: [], // Пока пустой массив
                description: product.description || 'Вкусный и свежий продукт от опытного пекаря.',
                image: product.images[0]?.imageUrl || null,
                isPopular: product._count.orderItems > 5, // Популярный если больше 5 заказов
                isNew: new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Новый если создан менее недели назад
            }
        })

        return NextResponse.json({
            success: true,
            data: formattedProducts,
            count: formattedProducts.length
        })

    } catch (error) {
        console.error('API Error fetching products:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Ошибка при загрузке товаров'
            },
            { status: 500 }
        )
    }
}