// app/api/users/route.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Fetching users from database...')
    
    // Получаем только существующие поля
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        phone: true,
        createdAt: true
        // Убрали lastName, так как его нет в модели
      },
      orderBy: { id: 'asc' }
    })

    console.log(`Found ${users.length} users:`, users)

    return Response.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return Response.json({ 
      error: 'Не удалось получить пользователей',
      details: error.message 
    }, { status: 500 })
  }
}