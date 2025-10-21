// lib/actions/promotion.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { promotionSchema, type PromotionFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE - Создание акции
export async function createPromotion(formData: PromotionFormData) {
  try {
    const validatedData = promotionSchema.parse(formData)
    
    // Проверяем существует ли повар
    const chef = await prisma.chef.findUnique({
      where: { id: validatedData.chefId }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    // Проверяем даты
    if (validatedData.startDate >= validatedData.endDate) {
      return { error: 'Дата окончания должна быть позже даты начала' }
    }

    // Проверяем значение скидки в зависимости от типа
    if (validatedData.discountType === 'PERCENTAGE' && (!validatedData.discountValue || validatedData.discountValue > 100)) {
      return { error: 'Процентная скидка должна быть от 1 до 100%' }
    }

    if (validatedData.discountType === 'FIXED' && (!validatedData.discountValue || validatedData.discountValue <= 0)) {
      return { error: 'Фиксированная скидка должна быть больше 0' }
    }

    const promotion = await prisma.promotion.create({
      data: validatedData
    })

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${validatedData.chefId}`)
    return { success: true, promotion }
  } catch (error) {
    console.error('Error creating promotion:', error)
    return { error: 'Ошибка при создании акции' }
  }
}

// READ (List) - Получение списка акций
export async function getPromotions(page: number = 1, limit: number = 20, search?: string, chefId?: number, activeOnly: boolean = false) {
  try {
    const skip = (page - 1) * limit
    
    const where = {
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { chef: { 
            businessName: { contains: search, mode: 'insensitive' }
          } }
        ]
      } : {}),
      ...(chefId ? { chefId } : {}),
      ...(activeOnly ? { 
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      } : {})
    }

    const [promotions, totalCount] = await Promise.all([
      prisma.promotion.findMany({
        where,
        include: {
          chef: {
            select: {
              businessName: true,
              user: { 
                select: { 
                  firstName: true, 
                  email: true 
                } 
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.promotion.count({ where })
    ])

    return {
      success: true,
      promotions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return { error: 'Ошибка при получении акций' }
  }
}

// READ (Active by Chef) - Активные акции повара
export async function getActivePromotionsByChef(chefId: number) {
  try {
    const promotions = await prisma.promotion.findMany({
      where: {
        chefId,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, promotions }
  } catch (error) {
    console.error('Error fetching chef promotions:', error)
    return { error: 'Ошибка при получении акций повара' }
  }
}

// READ (Single) - Получение акции по ID
export async function getPromotionById(id: number) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        chef: {
          include: {
            user: true
          }
        }
      }
    })

    if (!promotion) {
      return { error: 'Акция не найдена' }
    }

    return { success: true, promotion }
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return { error: 'Ошибка при получении акции' }
  }
}

// UPDATE - Обновление акции
export async function updatePromotion(id: number, formData: Partial<PromotionFormData>) {
  try {
    const validatedData = promotionSchema.partial().parse(formData)

    // Если переданы даты, проверяем их
    if (validatedData.startDate && validatedData.endDate) {
      if (validatedData.startDate >= validatedData.endDate) {
        return { error: 'Дата окончания должна быть позже даты начала' }
      }
    }

    // Проверяем значение скидки
    if (validatedData.discountType === 'PERCENTAGE' && validatedData.discountValue && validatedData.discountValue > 100) {
      return { error: 'Процентная скидка не может превышать 100%' }
    }

    if (validatedData.discountType === 'FIXED' && validatedData.discountValue && validatedData.discountValue <= 0) {
      return { error: 'Фиксированная скидка должна быть больше 0' }
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: validatedData
    })

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/promotions/${id}`)
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true, promotion }
  } catch (error) {
    console.error('Error updating promotion:', error)
    return { error: 'Ошибка при обновлении акции' }
  }
}

// TOGGLE ACTIVE - Переключение активности акции
export async function togglePromotionActive(id: number) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return { error: 'Акция не найдена' }
    }

    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        isActive: !promotion.isActive
      }
    })

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true, promotion: updatedPromotion }
  } catch (error) {
    console.error('Error toggling promotion active:', error)
    return { error: 'Ошибка при изменении статуса акции' }
  }
}

// DELETE - Удаление акции
export async function deletePromotion(id: number) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return { error: 'Акция не найдена' }
    }

    await prisma.promotion.delete({
      where: { id }
    })

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return { error: 'Ошибка при удалении акции' }
  }
}

// GET EXPIRING SOON - Акции, которые скоро истекают
export async function getExpiringPromotions(days: number = 3) {
  try {
    const date = new Date()
    date.setDate(date.getDate() + days)

    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        endDate: {
          lte: date,
          gte: new Date()
        }
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                email: true
              }
            }
          }
        }
      },
      orderBy: { endDate: 'asc' }
    })

    return { success: true, promotions }
  } catch (error) {
    console.error('Error fetching expiring promotions:', error)
    return { error: 'Ошибка при получении истекающих акций' }
  }
}

// BULK DEACTIVATE EXPIRED - Массовая деактивация истекших акций
export async function deactivateExpiredPromotions() {
  try {
    const result = await prisma.promotion.updateMany({
      where: {
        isActive: true,
        endDate: { lt: new Date() }
      },
      data: {
        isActive: false
      }
    })

    revalidatePath('/admin/promotions')
    return { 
      success: true, 
      message: `Деактивировано ${result.count} истекших акций` 
    }
  } catch (error) {
    console.error('Error deactivating expired promotions:', error)
    return { error: 'Ошибка при деактивации истекших акций' }
  }
}