import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/chefs - Получение списка поваров для клиентской части
export async function GET(request) {
    try {
        // Получаем параметры из URL (если есть)
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit')) || 50

        // Получаем поваров из базы данных
        const chefs = await prisma.chef.findMany({
            where: {
                isActive: true, // Только активные повары
                isVerified: true // Только верифицированные
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        email: true,
                        phone: true
                    }
                },
                _count: {
                    select: {
                        products: true,
                        reviews: true
                    }
                }
            },
            orderBy: {
                businessName: 'asc'
            },
            take: limit
        })

        // Преобразуем данные для фронтенда
        const formattedChefs = chefs.map(chef => ({
            id: chef.id,
            name: chef.businessName,
            rating: 4.5, // Пока статический рейтинг, потом добавим расчет
            reviews: chef._count.reviews || 0,
            specialties: chef.specialty ? [chef.specialty] : ['Выпечка'],
            deliveryTime: '25-40 мин', // Пока статическое значение
            minPrice: 500, // Пока статическое значение
            distance: '2 км от вас', // Пока статическое значение
            description: chef.description || 'Опытный пекарь с любовью к своему делу.',
            image: '👩‍🍳' // Пока эмодзи, потом заменим на реальные фото
        }))

        return NextResponse.json({
            success: true,
            data: formattedChefs,
            count: formattedChefs.length
        })

    } catch (error) {
        console.error('API Error fetching chefs:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Ошибка при загрузке поваров'
            },
            { status: 500 }
        )
    }
}