// lib/actions/chef.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { chefSchema, type ChefFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE
export async function createChef(formData: ChefFormData) {
  try {
    const validatedData = chefSchema.parse(formData)
    
    // Проверяем существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем не является ли пользователь уже поваром
    const existingChef = await prisma.chef.findUnique({
      where: { userId: validatedData.userId }
    })

    if (existingChef) {
      return { error: 'Этот пользователь уже является поваром' }
    }

    const chef = await prisma.chef.create({
      data: validatedData
    })

    revalidatePath('/admin/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error creating chef:', error)
    return { error: 'Ошибка при создании повара' }
  }
}

// READ (List)
export async function getChefs(page: number = 1, limit: number = 20, search?: string) {
  try {
    const skip = (page - 1) * limit
    
    const where = search ? {
      OR: [
        { businessName: { contains: search, mode: 'insensitive' } },
        { user: { 
          email: { contains: search, mode: 'insensitive' },
          firstName: { contains: search, mode: 'insensitive' }
        } }
      ]
    } : {}

    const [chefs, totalCount] = await Promise.all([
      prisma.chef.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              phone: true
            }
          },
          _count: {
            select: {
              products: true,
              orders: true,
              reviews: true,
              promotions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.chef.count({ where })
    ])

    return {
      success: true,
      chefs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching chefs:', error)
    return { error: 'Ошибка при получении поваров' }
  }
}

// READ (Single)
export async function getChefById(id: number) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        user: true,
        products: {
          include: {
            category: true,
            _count: { select: { orderItems: true, reviews: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          include: {
            user: true,
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        promotions: {
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: {
            user: true,
            product: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true,
            promotions: true
          }
        }
      }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    return { success: true, chef }
  } catch (error) {
    console.error('Error fetching chef:', error)
    return { error: 'Ошибка при получении повара' }
  }
}

// UPDATE
export async function updateChef(id: number, formData: Partial<ChefFormData>) {
  try {
    const validatedData = chefSchema.partial().parse(formData)

    const chef = await prisma.chef.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath(`/admin/chefs/${id}`)
    return { success: true, chef }
  } catch (error) {
    console.error('Error updating chef:', error)
    return { error: 'Ошибка при обновлении повара' }
  }
}

// VERIFY
export async function verifyChef(id: number) {
  try {
    const chef = await prisma.chef.update({
      where: { id },
      data: {
        isVerified: true,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error verifying chef:', error)
    return { error: 'Ошибка при верификации повара' }
  }
}

// TOGGLE ACTIVE
export async function toggleChefActive(id: number) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    const updatedChef = await prisma.chef.update({
      where: { id },
      data: {
        isActive: !chef.isActive,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    return { success: true, chef: updatedChef }
  } catch (error) {
    console.error('Error toggling chef active:', error)
    return { error: 'Ошибка при изменении статуса повара' }
  }
}

// DELETE
export async function deleteChef(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const chefData = await prisma.chef.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true
          }
        }
      }
    })

    if (!chefData) {
      return { error: 'Повар не найден' }
    }

    if (chefData._count.products > 0 || chefData._count.orders > 0) {
      return { error: 'Нельзя удалить повара с товарами или заказами' }
    }

    await prisma.chef.delete({
      where: { id }
    })

    revalidatePath('/admin/chefs')
    return { success: true }
  } catch (error) {
    console.error('Error deleting chef:', error)
    return { error: 'Ошибка при удалении повара' }
  }
}