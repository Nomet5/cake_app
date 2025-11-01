// lib/actions/order.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { 
  createNewOrderNotification, 
  createOrderStatusNotification, 
  createPaymentNotification,
  createSystemNotification 
} from './notification.actions'

const prisma = new PrismaClient()

// Типы для данных формы
interface OrderFormData {
  status?: string
  paymentStatus?: string
  deliveryAddress?: string
  totalAmount?: string
  deliveryFee?: string
  userId?: string
  chefId?: string
  subtotal?: string
}

// READ (List) - возвращает массив заказов
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
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
        reviews: {
          take: 1
        },
        _count: {
          select: {
            items: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders || []
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// CREATE - Создание заказа
export async function createOrder(formData: FormData) {
  try {
    const userId = parseInt(formData.get("userId") as string)
    const chefId = parseInt(formData.get("chefId") as string)
    const totalAmount = parseFloat(formData.get("totalAmount") as string)
    const subtotal = parseFloat(formData.get("subtotal") as string)
    const deliveryFee = parseFloat(formData.get("deliveryFee") as string) || 0
    const deliveryAddress = formData.get("deliveryAddress") as string
    const status = formData.get("status") as string || 'PENDING'
    const paymentStatus = formData.get("paymentStatus") as string || 'PENDING'

    // Валидация данных
    if (!userId || !chefId || !totalAmount || !deliveryAddress) {
      return { error: 'Пользователь, повар, сумма и адрес доставки обязательны' }
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем существование повара
    const chef = await prisma.chef.findUnique({
      where: { id: chefId }
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
        userId,
        chefId,
        totalAmount,
        subtotal: subtotal || totalAmount - deliveryFee,
        deliveryFee,
        deliveryAddress,
        status: status as any,
        paymentStatus: paymentStatus as any,
        orderNumber: `ORD-${Date.now()}`
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

    // Создаем уведомление о новом заказе
    await createNewOrderNotification(order)

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath(`/admin/chefs/${chefId}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error creating order:', error)
    await createSystemNotification(
      'Ошибка создания заказа',
      `Произошла ошибка при создании заказа: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при создании заказа' }
  }
}

// DELETE ORDER - Удаление заказа
export async function deleteOrder(id: number) {
  try {
    // Проверяем существует ли заказ
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        reviews: true,
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    // Нельзя удалить заказ с товарами или отзывами
    const hasItems = order.items.length > 0
    const hasReviews = order.reviews.length > 0

    if (hasItems || hasReviews) {
      let errorMessage = 'Нельзя удалить заказ с '
      const reasons = []
      if (hasItems) reasons.push('товарами')
      if (hasReviews) reasons.push('отзывами')
      errorMessage += reasons.join(' или ')
      
      return { error: errorMessage }
    }

    // Удаляем заказ
    await prisma.order.delete({
      where: { id }
    })

    // Создаем системное уведомление об удалении заказа
    await createSystemNotification(
      'Заказ удален',
      `Заказ #${order.orderNumber} от пользователя ${order.user.firstName} был удален`,
      'MEDIUM'
    )

    revalidatePath('/admin/orders')
    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Заказ успешно удален' }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { error: 'Ошибка при удалении заказа' }
  }
}

// GET ORDER BY ID
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
        reviews: {
          take: 1
        }
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

// UPDATE ORDER - Обновление заказа
export async function updateOrder(id: number, formData: OrderFormData) {
  try {
    const status = formData.status
    const paymentStatus = formData.paymentStatus
    const deliveryAddress = formData.deliveryAddress
    const totalAmount = formData.totalAmount ? parseFloat(formData.totalAmount) : undefined
    const deliveryFee = formData.deliveryFee ? parseFloat(formData.deliveryFee) : undefined

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
    const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']

    if (status && !validStatuses.includes(status)) {
      return { error: 'Неверный статус заказа' }
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return { error: 'Неверный статус оплаты' }
    }

    // Получаем текущий заказ для сравнения статусов
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    if (!currentOrder) {
      return { error: 'Заказ не найден' }
    }

    const updateData = {
      ...(status && { status: status as any }),
      ...(paymentStatus && { paymentStatus: paymentStatus as any }),
      ...(deliveryAddress && { deliveryAddress }),
      ...(totalAmount && { totalAmount }),
      ...(deliveryFee && { deliveryFee }),
      updatedAt: new Date()
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
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

    // Создаем уведомления об изменении статусов
    if (status && status !== currentOrder.status) {
      await createOrderStatusNotification(order, currentOrder.status, status)
    }

    if (paymentStatus && paymentStatus !== currentOrder.paymentStatus) {
      await createPaymentNotification(order, paymentStatus)
    }

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

// UPDATE ORDER STATUS - Обновление статуса заказа
export async function updateOrderStatus(id: number, status: string) {
  try {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
    
    if (!validStatuses.includes(status)) {
      return { error: 'Неверный статус заказа' }
    }

    // Получаем текущий заказ для сравнения статусов
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    if (!currentOrder) {
      return { error: 'Заказ не найден' }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date()
      }
    })

    // Создаем уведомление об изменении статуса
    if (status !== currentOrder.status) {
      await createOrderStatusNotification(order, currentOrder.status, status)
    }

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

    // Получаем текущий заказ для сравнения статусов
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    if (!currentOrder) {
      return { error: 'Заказ не найден' }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: paymentStatus as any,
        updatedAt: new Date()
      }
    })

    // Создаем уведомление об изменении статуса оплаты
    if (paymentStatus !== currentOrder.paymentStatus) {
      await createPaymentNotification(order, paymentStatus)
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error updating order payment status:', error)
    return { error: 'Ошибка при обновлении статуса оплаты' }
  }
}

// CANCEL ORDER - Отмена заказа (ИСПРАВЛЕННАЯ ФУНКЦИЯ)
export async function cancelOrder(id: number, reason?: string) {
  try {
    // Получаем текущий заказ
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    if (!currentOrder) {
      return { error: 'Заказ не найден' }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED' as any,
        updatedAt: new Date()
      }
    })

    // Создаем уведомление об отмене заказа
    await createOrderStatusNotification(
      order, 
      currentOrder.status, 
      'CANCELLED'
    )

    // Логируем причину отмены, если она есть
    if (reason) {
      console.log(`Заказ ${id} отменен с причиной: ${reason}`)
      // Здесь можно добавить логику для сохранения причины в отдельной таблице
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    return { success: true, order }
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { error: 'Ошибка при отмене заказа' }
  }
}

// GET ORDERS BY USER - Заказы конкретного пользователя
export async function getOrdersByUser(userId: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
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
        reviews: {
          take: 1
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders || []
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

// GET ORDERS BY CHEF - Заказы конкретного повара
export async function getOrdersByChef(chefId: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { chefId },
      include: {
        user: {
          select: {
            firstName: true,
            email: true,
            phone: true
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
        reviews: {
          take: 1
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders || []
  } catch (error) {
    console.error('Error fetching chef orders:', error)
    return []
  }
}

// GET PENDING ORDERS - Заказы ожидающие обработки
export async function getPendingOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        status: { 
          in: ['PENDING', 'CONFIRMED', 'PREPARING'] as any
        } 
      },
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
            businessName: true
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
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return orders || []
  } catch (error) {
    console.error('Error fetching pending orders:', error)
    return []
  }
}

// GET ORDER STATS - Статистика по заказам
export async function getOrderStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ 
        where: { 
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] as any } 
        } 
      }),
      prisma.order.count({ 
        where: { 
          status: 'DELIVERED' as any,
          paymentStatus: 'PAID' as any
        } 
      }),
      prisma.order.count({ 
        where: { 
          status: 'CANCELLED' as any
        } 
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID' as any
        },
        _sum: {
          totalAmount: true
        }
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID' as any
        },
        _avg: {
          totalAmount: true
        }
      })
    ])

    return {
      total: totalOrders,
      pending: pendingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      averageOrderValue: averageOrderValue._avg.totalAmount || 0
    }
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    }
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