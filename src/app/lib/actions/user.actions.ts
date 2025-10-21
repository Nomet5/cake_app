// lib/actions/user.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { userSchema, type UserFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE
export async function createUser(formData: UserFormData) {
  try {
    const validatedData = userSchema.parse(formData)
    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' }
    }

    const user = await prisma.user.create({
      data: validatedData
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { error: 'Ошибка при создании пользователя' }
  }
}

// READ (List)
export async function getUsers(page: number = 1, limit: number = 20, search?: string) {
  try {
    const skip = (page - 1) * limit
    
    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    } : {}

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          phone: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
              addresses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return {
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { error: 'Ошибка при получении пользователей' }
  }
}

// READ (Single)
export async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
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
        chefProfile: {
          include: {
            products: { take: 5 },
            _count: { select: { products: true, orders: true } }
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true,
            cartItems: true
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

// UPDATE
export async function updateUser(id: number, formData: Partial<UserFormData>) {
  try {
    const validatedData = userSchema.partial().parse(formData)
    
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
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
        ...validatedData,
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

// DELETE
export async function deleteUser(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const userData = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            chefProfile: true,
            reviews: true
          }
        }
      }
    })

    if (!userData) {
      return { error: 'Пользователь не найден' }
    }

    if (userData._count.orders > 0 || userData._count.chefProfile > 0) {
      return { error: 'Нельзя удалить пользователя с активными заказами или профилем повара' }
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