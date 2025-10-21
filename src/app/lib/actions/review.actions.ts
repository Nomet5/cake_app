// lib/actions/review.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { reviewSchema, type ReviewFormData } from '../validations/schemas' // ← Теперь используется!

const prisma = new PrismaClient()

// CREATE - Создание отзыва
export async function createReview(formData: ReviewFormData) { // ← Используется ReviewFormData
  try {
    const validatedData = reviewSchema.parse(formData) // ← Используется reviewSchema
    
    // Проверяем существует ли заказ
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    // Проверяем не оставлен ли уже отзыв на этот заказ
    const existingReview = await prisma.review.findUnique({
      where: { orderId: validatedData.orderId }
    })

    if (existingReview) {
      return { error: 'Отзыв на этот заказ уже оставлен' }
    }

    const review = await prisma.review.create({
      data: validatedData
    })

    revalidatePath('/admin/reviews')
    return { success: true, review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { error: 'Ошибка при создании отзыва' }
  }
}

// READ (List) - Получение списка отзывов
export async function getReviews(page: number = 1, limit: number = 20, approved?: boolean) {
  try {
    const skip = (page - 1) * limit
    
    const where = approved !== undefined ? { isApproved: approved } : {}

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              email: true
            }
          },
          chef: {
            select: {
              businessName: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              orderNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    return {
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { error: 'Ошибка при получении отзывов' }
  }
}

// READ (Single) - Получение отзыва по ID
export async function getReviewById(id: number) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true,
            phone: true
          }
        },
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
        },
        product: {
          select: {
            name: true,
            price: true
          }
        },
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    return { success: true, review }
  } catch (error) {
    console.error('Error fetching review:', error)
    return { error: 'Ошибка при получении отзыва' }
  }
}

// UPDATE - Обновление отзыва
export async function updateReview(id: number, formData: Partial<ReviewFormData>) { // ← Используется ReviewFormData
  try {
    const validatedData = reviewSchema.partial().parse(formData) // ← Используется reviewSchema

    const review = await prisma.review.update({
      where: { id },
      data: validatedData
    })

    revalidatePath('/admin/reviews')
    revalidatePath(`/admin/reviews/${id}`)
    return { success: true, review }
  } catch (error) {
    console.error('Error updating review:', error)
    return { error: 'Ошибка при обновлении отзыва' }
  }
}

// APPROVE REVIEW - Одобрение отзыва
export async function approveReview(id: number) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved: true
      }
    })

    revalidatePath('/admin/reviews')
    return { success: true, review }
  } catch (error) {
    console.error('Error approving review:', error)
    return { error: 'Ошибка при одобрении отзыва' }
  }
}

// REJECT REVIEW - Отклонение отзыва
export async function rejectReview(id: number, reason: string) {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved: false
      }
    })

    revalidatePath('/admin/reviews')
    return { success: true, review }
  } catch (error) {
    console.error('Error rejecting review:', error)
    return { error: 'Ошибка при отклонении отзыва' }
  }
}

// DELETE REVIEW - Удаление отзыва
export async function deleteReview(id: number) {
  try {
    await prisma.review.delete({
      where: { id }
    })

    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { error: 'Ошибка при удалении отзыва' }
  }
}

// GET REVIEWS BY CHEF - Отзывы конкретного повара
export async function getReviewsByChef(chefId: number, page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { chefId },
        include: {
          user: {
            select: {
              firstName: true,
              email: true
            }
          },
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              orderNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where: { chefId } })
    ])

    return {
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching chef reviews:', error)
    return { error: 'Ошибка при получении отзывов повара' }
  }
}

// GET REVIEWS BY PRODUCT - Отзывы конкретного товара
export async function getReviewsByProduct(productId: number, page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              firstName: true,
              email: true
            }
          },
          order: {
            select: {
              orderNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.review.count({ where: { productId } })
    ])

    return {
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return { error: 'Ошибка при получении отзывов товара' }
  }
}