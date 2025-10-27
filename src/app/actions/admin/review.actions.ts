// lib/actions/review.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// READ (List) - возвращает массив отзывов
export async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

// CREATE - Создание отзыва
export async function createReview(formData: FormData) {
  try {
    const rating = parseInt(formData.get("rating") as string)
    const comment = formData.get("comment") as string
    const userId = parseInt(formData.get("userId") as string)
    const chefId = formData.get("chefId") ? parseInt(formData.get("chefId") as string) : null
    const productId = formData.get("productId") ? parseInt(formData.get("productId") as string) : null
    const orderId = parseInt(formData.get("orderId") as string)

    // Валидация данных
    if (!rating || !comment || !userId || !orderId) {
      return { error: 'Рейтинг, комментарий, пользователь и заказ обязательны' }
    }

    if (rating < 1 || rating > 5) {
      return { error: 'Рейтинг должен быть от 1 до 5' }
    }

    // Проверяем существует ли заказ
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    // Проверяем не оставлен ли уже отзыв на этот заказ
    const existingReview = await prisma.review.findUnique({
      where: { orderId }
    })

    if (existingReview) {
      return { error: 'Отзыв на этот заказ уже оставлен' }
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        chefId,
        productId,
        orderId,
        isApproved: false // По умолчанию не одобрен
      }
    })

    revalidatePath('/admin/reviews')
    return { success: true, review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { error: 'Ошибка при создании отзыва' }
  }
}

// DELETE REVIEW - Удаление отзыва
export async function deleteReview(id: number) {
  try {
    // Проверяем существует ли отзыв
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id }
    })

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Отзыв успешно удален' }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { error: 'Ошибка при удалении отзыва' }
  }
}

// GET REVIEW BY ID
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

// UPDATE REVIEW - Обновление отзыва
export async function updateReview(id, formData) {
  try {
    const rating = formData.rating ? parseInt(formData.rating) : undefined
    const comment = formData.comment
    const isApproved = formData.isApproved

    if (rating && (rating < 1 || rating > 5)) {
      return { error: 'Рейтинг должен быть от 1 до 5' }
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment && { comment }),
        ...(isApproved !== undefined && { isApproved: Boolean(isApproved) })
      }
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
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isApproved: true
      }
    })

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    return { success: true, review: updatedReview }
  } catch (error) {
    console.error('Error approving review:', error)
    return { error: 'Ошибка при одобрении отзыва' }
  }
}

// REJECT REVIEW - Отклонение отзыва
export async function rejectReview(id: number) {
  try {
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isApproved: false
      }
    })

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    return { success: true, review: updatedReview }
  } catch (error) {
    console.error('Error rejecting review:', error)
    return { error: 'Ошибка при отклонении отзыва' }
  }
}

// GET REVIEWS BY CHEF - Отзывы конкретного повара
export async function getReviewsByChef(chefId: number) {
  try {
    const reviews = await prisma.review.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching chef reviews:', error)
    return []
  }
}

// GET REVIEWS BY PRODUCT - Отзывы конкретного товара
export async function getReviewsByProduct(productId: number) {
  try {
    const reviews = await prisma.review.findMany({
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
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return []
  }
}

// GET APPROVED REVIEWS - Только одобренные отзывы
export async function getApprovedReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching approved reviews:', error)
    return []
  }
}

// GET PENDING REVIEWS - Отзывы ожидающие модерации
export async function getPendingReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
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
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching pending reviews:', error)
    return []
  }
}

// GET REVIEW STATS - Статистика по отзывам
export async function getReviewStats() {
  try {
    const [totalReviews, approvedReviews, pendingReviews, averageRating] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { isApproved: true } }),
      prisma.review.count({ where: { isApproved: false } }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ])

    return {
      total: totalReviews,
      approved: approvedReviews,
      pending: pendingReviews,
      averageRating: averageRating._avg.rating || 0
    }
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return {
      total: 0,
      approved: 0,
      pending: 0,
      averageRating: 0
    }
  }
}