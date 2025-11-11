import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/home - Получение всех данных для главной страницы
export async function GET() {
    try {
        // Параллельно загружаем все данные для главной
        const [popularBakers, newProducts, categories] = await Promise.all([
            // Популярные пекари (по количеству заказов)
            prisma.chef.findMany({
                where: {
                    isActive: true,
                    isVerified: true
                },
                include: {
                    user: {
                        select: {
                            firstName: true
                        }
                    },
                    _count: {
                        select: {
                            orders: true,
                            reviews: true,
                            products: {
                                where: {
                                    isAvailable: true
                                }
                            }
                        }
                    },
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                },
                orderBy: {
                    orders: {
                        _count: 'desc'
                    }
                },
                take: 3
            }),

            // Новинки недели (товары за последние 7 дней)
            prisma.product.findMany({
                where: {
                    isAvailable: true,
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Последние 7 дней
                    }
                },
                include: {
                    chef: {
                        select: {
                            businessName: true
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
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 4
            }),

            // Категории для главной
            prisma.category.findMany({
                where: {
                    isActive: true
                },
                include: {
                    _count: {
                        select: {
                            products: {
                                where: {
                                    isAvailable: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    sortOrder: 'asc'
                },
                take: 8
            })
        ])

        // Форматируем данные для фронтенда

        // Популярные пекари
        const formattedBakers = popularBakers.map(baker => {
            const avgRating = baker.reviews.length > 0
                ? baker.reviews.reduce((sum, review) => sum + review.rating, 0) / baker.reviews.length
                : 4.5

            return {
                id: baker.id,
                name: baker.businessName,
                rating: Math.round(avgRating * 10) / 10,
                reviews: baker._count.reviews,
                specialties: baker.specialty ? [baker.specialty] : ['Выпечка'],
                deliveryTime: '25-40 мин', // Пока статическое значение
                minPrice: 500, // Пока статическое значение
                productCount: baker._count.products
            }
        })

        // Новинки недели
        const formattedProducts = newProducts.map(product => {
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 4.5

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                rating: Math.round(avgRating * 10) / 10,
                baker: product.chef.businessName,
                image: product.images[0]?.imageUrl || null
            }
        })

        // Категории
        const formattedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            count: category._count.products,
            image: `/images/categories/${category.name.toLowerCase()}.png` // Путь к изображениям
        }))

        return NextResponse.json({
            success: true,
            data: {
                popularBakers: formattedBakers,
                newProducts: formattedProducts,
                categories: formattedCategories
            }
        })

    } catch (error) {
        console.error('API Error fetching home data:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Ошибка при загрузке данных для главной страницы'
            },
            { status: 500 }
        )
    }
}