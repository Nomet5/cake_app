// lib/actions/promotion.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { promotionSchema, type PromotionFormData } from '../../lib/validations/schemas'
import { 
  createSystemNotification 
} from './notification.actions'

const prisma = new PrismaClient()

// CREATE - Создание акции
export async function createPromotion(formData: PromotionFormData) {
  try {
    const validatedData = promotionSchema.parse(formData)

    // Проверяем существует ли повар
    const chef = await prisma.chef.findUnique({
      where: { id: validatedData.chefId },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
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

    // Создаем акцию с правильной структурой данных
    const promotion = await prisma.promotion.create({
      data: {
        title: validatedData.title,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        isActive: validatedData.isActive,
        chef: {
          connect: { id: validatedData.chefId }
        }
      },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    // Создаем уведомление о новой акции
    await createSystemNotification(
      'Создана новая акция',
      `Повар "${chef.businessName}" создал новую акцию: "${validatedData.title}" со скидкой ${validatedData.discountValue}${validatedData.discountType === 'PERCENTAGE' ? '%' : '₽'}`,
      'MEDIUM'
    )

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${validatedData.chefId}`)
    return { success: true, promotion }
  } catch (error) {
    console.error('Error creating promotion:', error)
    await createSystemNotification(
      'Ошибка создания акции',
      `Произошла ошибка при создании акции: ${error}`,
      'HIGH'
    )
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
          {
            chef: {
              businessName: { contains: search, mode: 'insensitive' }
            }
          }
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

    // Получаем текущую акцию для сравнения
    const currentPromotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    if (!currentPromotion) {
      return { error: 'Акция не найдена' }
    }

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

    // Подготавливаем данные для обновления
    const updateData: any = {}
    if (validatedData.title) updateData.title = validatedData.title
    if (validatedData.discountType) updateData.discountType = validatedData.discountType
    if (validatedData.discountValue !== undefined) updateData.discountValue = validatedData.discountValue
    if (validatedData.startDate) updateData.startDate = validatedData.startDate
    if (validatedData.endDate) updateData.endDate = validatedData.endDate
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive
    if (validatedData.chefId) updateData.chefId = validatedData.chefId

    const promotion = await prisma.promotion.update({
      where: { id },
      data: updateData
    })

    // Создаем уведомления об изменениях
    if (validatedData.title && validatedData.title !== currentPromotion.title) {
      await createSystemNotification(
        'Акция обновлена',
        `Акция "${currentPromotion.title}" переименована в "${validatedData.title}"`,
        'LOW'
      )
    }

    if (validatedData.discountValue && validatedData.discountValue !== currentPromotion.discountValue) {
      await createSystemNotification(
        'Изменение скидки в акции',
        `Скидка в акции "${promotion.title}" изменена с ${currentPromotion.discountValue} на ${validatedData.discountValue}${currentPromotion.discountType === 'PERCENTAGE' ? '%' : '₽'}`,
        'MEDIUM'
      )
    }

    if (validatedData.isActive !== undefined && validatedData.isActive !== currentPromotion.isActive) {
      await createSystemNotification(
        'Изменение статуса акции',
        `Акция "${promotion.title}" теперь ${validatedData.isActive ? 'активна' : 'неактивна'}`,
        'MEDIUM'
      )
    }

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/promotions/${id}`)
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true, promotion }
  } catch (error) {
    console.error('Error updating promotion:', error)
    await createSystemNotification(
      'Ошибка обновления акции',
      `Произошла ошибка при обновлении акции: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при обновлении акции' }
  }
}

// TOGGLE ACTIVE - Переключение активности акции
export async function togglePromotionActive(id: number) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
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

    // Создаем уведомление об изменении статуса
    await createSystemNotification(
      'Изменение статуса акции',
      `Акция "${promotion.title}" теперь ${updatedPromotion.isActive ? 'активна' : 'неактивна'}`,
      'MEDIUM'
    )

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true, promotion: updatedPromotion }
  } catch (error) {
    console.error('Error toggling promotion active:', error)
    await createSystemNotification(
      'Ошибка изменения статуса акции',
      `Произошла ошибка при изменении статуса акции: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при изменении статуса акции' }
  }
}

// DELETE - Удаление акции
export async function deletePromotion(id: number) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    if (!promotion) {
      return { error: 'Акция не найдена' }
    }

    await prisma.promotion.delete({
      where: { id }
    })

    // Создаем уведомление об удалении акции
    await createSystemNotification(
      'Акция удалена',
      `Акция "${promotion.title}" от повара "${promotion.chef.businessName}" была удалена`,
      'MEDIUM'
    )

    revalidatePath('/admin/promotions')
    revalidatePath(`/admin/chefs/${promotion.chefId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting promotion:', error)
    await createSystemNotification(
      'Ошибка удаления акции',
      `Произошла ошибка при удалении акции: ${error}`,
      'HIGH'
    )
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

    // Создаем уведомление о скором истечении акций (если есть такие)
    if (promotions.length > 0) {
      await createSystemNotification(
        'Акции скоро истекают',
        `${promotions.length} акций истекают в течение ${days} дней`,
        'LOW'
      )
    }

    return { success: true, promotions }
  } catch (error) {
    console.error('Error fetching expiring promotions:', error)
    return { error: 'Ошибка при получении истекающих акций' }
  }
}

// BULK DEACTIVATE EXPIRED - Массовая деактивация истекших акций
export async function deactivateExpiredPromotions() {
  try {
    const expiredPromotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        endDate: { lt: new Date() }
      },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    const result = await prisma.promotion.updateMany({
      where: {
        isActive: true,
        endDate: { lt: new Date() }
      },
      data: {
        isActive: false
      }
    })

    // Создаем уведомление о массовой деактивации
    if (result.count > 0) {
      await createSystemNotification(
        'Истекшие акции деактивированы',
        `Автоматически деактивировано ${result.count} истекших акций`,
        'MEDIUM'
      )
    }

    revalidatePath('/admin/promotions')
    return {
      success: true,
      message: `Деактивировано ${result.count} истекших акций`
    }
  } catch (error) {
    console.error('Error deactivating expired promotions:', error)
    await createSystemNotification(
      'Ошибка деактивации акций',
      `Произошла ошибка при деактивации истекших акций: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при деактивации истекших акций' }
  }
}

// APPLY PROMOTION TO ORDER - Применение акции к заказу (упрощенная версия)
export async function applyPromotionToOrder(orderId: number, promotionId: number) {
  try {
    const [order, promotion] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              firstName: true,
              email: true
            }
          }
        }
      }),
      prisma.promotion.findUnique({
        where: { id: promotionId },
        include: {
          chef: {
            select: {
              businessName: true
            }
          }
        }
      })
    ])

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    if (!promotion) {
      return { error: 'Акция не найдена' }
    }

    if (!promotion.isActive) {
      return { error: 'Акция не активна' }
    }

    if (promotion.startDate > new Date() || promotion.endDate < new Date()) {
      return { error: 'Срок действия акции истек или еще не начался' }
    }

    // Применяем скидку к заказу
    let discountAmount = 0
    if (promotion.discountType === 'PERCENTAGE') {
      discountAmount = order.totalAmount * (promotion.discountValue / 100)
    } else {
      discountAmount = promotion.discountValue
    }

    const finalAmount = order.totalAmount - discountAmount

    // Обновляем заказ (без поля discountAmount, если его нет в модели)
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: finalAmount
        // Если нужно сохранить ID акции, добавьте promotionId в модель Order
      }
    })

    // Создаем уведомление о применении акции
    await createSystemNotification(
      'Акция применена к заказу',
      `Акция "${promotion.title}" применена к заказу #${order.orderNumber}. Скидка: ${discountAmount} ₽, итоговая сумма: ${finalAmount} ₽`,
      'LOW'
    )

    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/orders')
    return { 
      success: true, 
      order: updatedOrder, 
      discountAmount,
      promotion: promotion.title
    }
  } catch (error) {
    console.error('Error applying promotion to order:', error)
    return { error: 'Ошибка при применении акции к заказу' }
  }
}