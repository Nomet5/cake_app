// lib/actions/order.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { orderSchema, type OrderFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE - Создание заказа
export async function createOrder(formData: OrderFormData) {
  try {
    const validatedData = orderSchema.parse(formData)
    
    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем существование повара
    const chef = await prisma.chef.findUnique({
      where: { id: validatedData.chefId }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    // Проверяем активен ли повар
    if (!chef.isActive) {
      return { error: 'Повар неактивен' }
    }

    const order = await prisma.order.create({
      data: {
        ...validatedData,
        orderNumber: `ORD-${Date.now()}` // Генерируем номер заказа
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
        }
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/users/${validatedData.userId}`)
    revalidatePath(`/admin/chefs/${validatedData.chefId}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error creating order:', error)
    return { error: 'Ошибка при создании заказа' }
  }
}

// READ (List) - Получение списка заказов
export async function getOrders(
  page: number = 1, 
  limit: number = 20, 
  status?: string, 
  paymentStatus?: string,
  chefId?: number,
  userId?: number
) {
  try {
    const skip = (page - 1) * limit
    
    const where = {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(chefId ? { chefId } : {}),
      ...(userId ? { userId } : {})
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
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
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true
                }
              }
            }
          },
          delivery: true,
          review: true,
          _count: {
            select: {
              items: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return {
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { error: 'Ошибка при получении заказов' }
  }
}

// READ (Single) - Получение заказа по ID
export async function getOrderById(id: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true,
            phone: true,
            addresses: true
          }
        },
        chef: {
          include: {
            user: {
              select: {
                firstName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        items: {
          include: {
            product: {
              include: {
                chef: true,
                images: { 
                  take: 1,
                  where: { isPrimary: true }
                }
              }
            }
          }
        },
        delivery: true,
        review: true
      }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    return { success: true, order }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { error: 'Ошибка при получении заказа' }
  }
}

// READ (By Order Number) - Получение заказа по номеру
export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
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
                phone: true
              }
            }
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        },
        delivery: true
      }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    return { success: true, order }
  } catch (error) {
    console.error('Error fetching order by number:', error)
    return { error: 'Ошибка при получении заказа' }
  }
}

// UPDATE - Обновление заказа
export async function updateOrder(id: number, formData: Partial<OrderFormData>) {
  try {
    const validatedData = orderSchema.partial().parse(formData)

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
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
        }
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath(`/admin/users/${order.userId}`)
    revalidatePath(`/admin/chefs/${order.chefId}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error updating order:', error)
    return { error: 'Ошибка при обновлении заказа' }
  }
}

// UPDATE STATUS - Обновление статуса заказа
export async function updateOrderStatus(id: number, status: string) {
  try {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
    
    if (!validStatuses.includes(status)) {
      return { error: 'Неверный статус заказа' }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date(),
        // Если заказ доставлен, обновляем время доставки
        ...(status === 'DELIVERED' && { 
          actualDeliveryTime: new Date() 
        }),
        // Если заказ отменен, устанавливаем время отмены
        ...(status === 'CANCELLED' && { 
          cancelledAt: new Date() 
        })
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { error: 'Ошибка при обновлении статуса заказа' }
  }
}

// UPDATE PAYMENT STATUS - Обновление статуса оплаты
export async function updateOrderPaymentStatus(id: number, paymentStatus: string) {
  try {
    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
    
    if (!validStatuses.includes(paymentStatus)) {
      return { error: 'Неверный статус оплаты' }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: paymentStatus as any,
        updatedAt: new Date(),
        // Если оплата прошла, можно добавить логику начисления баллов и т.д.
        ...(paymentStatus === 'PAID' && {
          // Дополнительная логика для успешной оплаты
        })
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error updating order payment status:', error)
    return { error: 'Ошибка при обновлении статуса оплаты' }
  }
}

// CANCEL ORDER - Отмена заказа
export async function cancelOrder(id: number, reason?: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: reason,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { error: 'Ошибка при отмене заказа' }
  }
}

// ADD ORDER ITEM - Добавление товара в заказ
export async function addOrderItem(orderId: number, productId: number, quantity: number = 1) {
  try {
    // Проверяем существование заказа
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    // Проверяем существование товара
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    if (!product.isAvailable) {
      return { error: 'Товар недоступен' }
    }

    // Проверяем не добавлен ли уже товар в заказ
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId,
        productId
      }
    })

    if (existingItem) {
      // Если товар уже есть, обновляем количество
      const updatedItem = await prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          totalPrice: product.price * (existingItem.quantity + quantity)
        }
      })

      // Пересчитываем общую сумму заказа
      await recalculateOrderTotal(orderId)

      revalidatePath(`/admin/orders/${orderId}`)
      return { success: true, item: updatedItem }
    }

    // Добавляем новый товар
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity
      }
    })

    // Пересчитываем общую сумму заказа
    await recalculateOrderTotal(orderId)

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, item: orderItem }
  } catch (error) {
    console.error('Error adding order item:', error)
    return { error: 'Ошибка при добавлении товара в заказ' }
  }
}

// UPDATE ORDER ITEM - Обновление товара в заказе
export async function updateOrderItem(itemId: number, quantity: number) {
  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        product: true
      }
    })

    if (!orderItem) {
      return { error: 'Позиция заказа не найдена' }
    }

    if (quantity <= 0) {
      // Если количество 0 или меньше, удаляем позицию
      await prisma.orderItem.delete({
        where: { id: itemId }
      })
    } else {
      // Обновляем количество и цену
      const updatedItem = await prisma.orderItem.update({
        where: { id: itemId },
        data: {
          quantity,
          totalPrice: orderItem.unitPrice * quantity
        }
      })
    }

    // Пересчитываем общую сумму заказа
    await recalculateOrderTotal(orderItem.orderId)

    revalidatePath(`/admin/orders/${orderItem.orderId}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating order item:', error)
    return { error: 'Ошибка при обновлении позиции заказа' }
  }
}

// REMOVE ORDER ITEM - Удаление товара из заказа
export async function removeOrderItem(itemId: number) {
  try {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId }
    })

    if (!orderItem) {
      return { error: 'Позиция заказа не найдена' }
    }

    await prisma.orderItem.delete({
      where: { id: itemId }
    })

    // Пересчитываем общую сумму заказа
    await recalculateOrderTotal(orderItem.orderId)

    revalidatePath(`/admin/orders/${orderItem.orderId}`)
    return { success: true }
  } catch (error) {
    console.error('Error removing order item:', error)
    return { error: 'Ошибка при удалении позиции заказа' }
  }
}

// DELETE ORDER - Удаление заказа
export async function deleteOrder(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const orderData = await prisma.order.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
            review: true
          }
        }
      }
    })

    if (!orderData) {
      return { error: 'Заказ не найден' }
    }

    // Нельзя удалить заказ с товарами или отзывом
    if (orderData._count.items > 0 || orderData._count.review > 0) {
      return { error: 'Нельзя удалить заказ с товарами или отзывом' }
    }

    await prisma.order.delete({
      where: { id }
    })

    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { error: 'Ошибка при удалении заказа' }
  }
}

// GET STATISTICS - Статистика по заказам
export async function getOrderStatistics(timeframe: 'today' | 'week' | 'month' | 'year' = 'month') {
  try {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue
    ] = await Promise.all([
      // Общее количество заказов
      prisma.order.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      // Общая выручка
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: 'PAID'
        },
        _sum: {
          totalAmount: true
        }
      }),
      // Ожидающие заказы
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] }
        }
      }),
      // Завершенные заказы
      prisma.order.count({
        where: {
          createdAt: { gte: startDate },
          status: 'DELIVERED'
        }
      }),
      // Средний чек
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: 'PAID'
        },
        _avg: {
          totalAmount: true
        }
      })
    ])

    return {
      success: true,
      statistics: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        completedOrders,
        averageOrderValue: averageOrderValue._avg.totalAmount || 0,
        timeframe
      }
    }
  } catch (error) {
    console.error('Error fetching order statistics:', error)
    return { error: 'Ошибка при получении статистики заказов' }
  }
}

// Вспомогательная функция для пересчета общей суммы заказа
async function recalculateOrderTotal(orderId: number) {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId }
  })

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
  
  // Получаем заказ чтобы узнать стоимость доставки
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { deliveryFee: true }
  })

  const totalAmount = subtotal + (order?.deliveryFee || 0)

  await prisma.order.update({
    where: { id: orderId },
    data: {
      subtotal,
      totalAmount,
      updatedAt: new Date()
    }
  })
}