// lib/actions/review.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { 
  createNewReviewNotification,
  createSystemNotification 
} from './notification.actions'

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
      },
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
      }
    })

    // Создаем уведомление о новом отзыве
    await createNewReviewNotification(review)

    revalidatePath('/admin/reviews')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, review }
  } catch (error) {
    console.error('Error creating review:', error)
    await createSystemNotification(
      'Ошибка создания отзыва',
      `Произошла ошибка при создании отзыва: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при создании отзыва' }
  }
}

// DELETE REVIEW - Удаление отзыва
export async function deleteReview(id: number) {
  try {
    // Проверяем существует ли отзыв
    const review = await prisma.review.findUnique({
      where: { id },
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
      }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id }
    })

    // Создаем уведомление об удалении отзыва
    await createSystemNotification(
      'Отзыв удален',
      `Отзыв пользователя ${review.user.firstName} с рейтингом ${review.rating}/5 был удален`,
      'MEDIUM'
    )

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Отзыв успешно удален' }
  } catch (error) {
    console.error('Error deleting review:', error)
    await createSystemNotification(
      'Ошибка удаления отзыва',
      `Произошла ошибка при удалении отзыва: ${error}`,
      'HIGH'
    )
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
export async function updateReview(id: number, formData: any) {
  try {
    const rating = formData.rating ? parseInt(formData.rating) : undefined
    const comment = formData.comment
    const isApproved = formData.isApproved

    if (rating && (rating < 1 || rating > 5)) {
      return { error: 'Рейтинг должен быть от 1 до 5' }
    }

    // Получаем текущий отзыв для сравнения
    const currentReview = await prisma.review.findUnique({
      where: { id },
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
        }
      }
    })

    if (!currentReview) {
      return { error: 'Отзыв не найден' }
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment && { comment }),
        ...(isApproved !== undefined && { isApproved: Boolean(isApproved) })
      }
    })

    // Создаем уведомления об изменениях
    if (rating && rating !== currentReview.rating) {
      await createSystemNotification(
        'Изменен рейтинг отзыва',
        `Рейтинг отзыва пользователя ${currentReview.user.firstName} изменен с ${currentReview.rating} на ${rating}`,
        'LOW'
      )
    }

    if (isApproved !== undefined && isApproved !== currentReview.isApproved) {
      await createSystemNotification(
        'Изменен статус отзыва',
        `Отзыв пользователя ${currentReview.user.firstName} теперь ${isApproved ? 'одобрен' : 'не одобрен'}`,
        'MEDIUM'
      )
    }

    revalidatePath('/admin/reviews')
    revalidatePath(`/admin/reviews/${id}`)
    return { success: true, review }
  } catch (error) {
    console.error('Error updating review:', error)
    await createSystemNotification(
      'Ошибка обновления отзыва',
      `Произошла ошибка при обновлении отзыва: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при обновлении отзыва' }
  }
}

// APPROVE REVIEW - Одобрение отзыва
export async function approveReview(id: number) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
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
      }
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

    // Создаем уведомление об одобрении отзыва
    await createSystemNotification(
      'Отзыв одобрен',
      `Отзыв пользователя ${review.user.firstName} с рейтингом ${review.rating}/5 был одобрен и опубликован`,
      'LOW'
    )

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    if (review.product) {
      revalidatePath(`/products/${review.product}`)
    }
    return { success: true, review: updatedReview }
  } catch (error) {
    console.error('Error approving review:', error)
    await createSystemNotification(
      'Ошибка одобрения отзыва',
      `Произошла ошибка при одобрении отзыва: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при одобрении отзыва' }
  }
}

// REJECT REVIEW - Отклонение отзыва
export async function rejectReview(id: number) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
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
      }
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

    // Создаем уведомление об отклонении отзыва
    await createSystemNotification(
      'Отзыв отклонен',
      `Отзыв пользователя ${review.user.firstName} с рейтингом ${review.rating}/5 был отклонен`,
      'MEDIUM'
    )

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
    return { success: true, review: updatedReview }
  } catch (error) {
    console.error('Error rejecting review:', error)
    await createSystemNotification(
      'Ошибка отклонения отзыва',
      `Произошла ошибка при отклонении отзыва: ${error}`,
      'HIGH'
    )
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

    // Создаем уведомление о статистике отзывов (если есть ожидающие модерации)
    if (pendingReviews > 0) {
      await createSystemNotification(
        'Отзывы ожидают модерации',
        `${pendingReviews} отзывов ожидают одобрения`,
        'LOW'
      )
    }

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

// BULK APPROVE REVIEWS - Массовое одобрение отзывов
export async function bulkApproveReviews(reviewIds: number[]) {
  try {
    const result = await prisma.review.updateMany({
      where: {
        id: {
          in: reviewIds
        }
      },
      data: {
        isApproved: true
      }
    })

    // Создаем уведомление о массовом одобрении
    await createSystemNotification(
      'Массовое одобрение отзывов',
      `Одобрено ${result.count} отзывов`,
      'MEDIUM'
    )

    revalidatePath('/admin/reviews')
    return { success: true, approvedCount: result.count }
  } catch (error) {
    console.error('Error bulk approving reviews:', error)
    await createSystemNotification(
      'Ошибка массового одобрения отзывов',
      `Произошла ошибка при массовом одобрении отзывов: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при массовом одобрении отзывов' }
  }
}

// BULK DELETE REVIEWS - Массовое удаление отзывов
export async function bulkDeleteReviews(reviewIds: number[]) {
  try {
    const result = await prisma.review.deleteMany({
      where: {
        id: {
          in: reviewIds
        }
      }
    })

    // Создаем уведомление о массовом удалении
    await createSystemNotification(
      'Массовое удаление отзывов',
      `Удалено ${result.count} отзывов`,
      'MEDIUM'
    )

    revalidatePath('/admin/reviews')
    return { success: true, deletedCount: result.count }
  } catch (error) {
    console.error('Error bulk deleting reviews:', error)
    await createSystemNotification(
      'Ошибка массового удаления отзывов',
      `Произошла ошибка при массовом удалении отзывов: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при массовом удалении отзывов' }
  }
}