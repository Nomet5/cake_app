// lib/actions/user.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// READ (List) - возвращает массив пользователей
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        chefProfile: { // Включаем сам профиль повара вместо подсчета
          select: {
            id: true
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// CREATE
export async function createUser(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string

    // Валидация данных
    if (!firstName || !email || !password) {
      return { error: 'Имя, email и пароль обязательны для заполнения' }
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' }
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        email,
        passwordHash: password,
        phone: phone || null
      }
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { error: 'Ошибка при создании пользователя' }
  }
}

// DELETE
export async function deleteUser(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const userData = await prisma.user.findUnique({
      where: { id },
      include: {
        chefProfile: true, // Включаем профиль повара напрямую
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    if (!userData) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем есть ли заказы или профиль повара
    const hasOrders = userData._count.orders > 0
    const hasChefProfile = userData.chefProfile !== null // Проверяем наличие профиля

    if (hasOrders || hasChefProfile) {
      let errorMessage = 'Нельзя удалить пользователя с '
      const reasons = []
      if (hasOrders) reasons.push('активными заказами')
      if (hasChefProfile) reasons.push('профилем повара')
      errorMessage += reasons.join(' или ')
      
      return { error: errorMessage }
    }

    await prisma.user.delete({
      where: { id }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: 'Ошибка при удалении пользователя' }
  }
}

// GET USER BY ID
export async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        chefProfile: true,
        orders: {
          include: {
            chef: true,
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { error: 'Ошибка при получении пользователя' }
  }
}

// UPDATE USER
export async function updateUser(id, formData) {
  try {
    const firstName = formData.firstName
    const email = formData.email
    const phone = formData.phone

    // Проверяем email на уникальность
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: id }
        }
      })

      if (existingUser) {
        return { error: 'Пользователь с таким email уже существует' }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(email && { email }),
        ...(phone && { phone }),
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${id}`)
    return { success: true, user }
  } catch (error) {
    console.error('Error updating user:', error)
    return { error: 'Ошибка при обновлении пользователя' }
  }
}