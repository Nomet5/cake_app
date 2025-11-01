// lib/actions/notification.actions.ts
'use server'

import { PrismaClient, NotificationType, NotificationPriority } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NotificationContext } from '../../lib/constants/notification-context'
import { 
  CreateNotificationData,
  ContextType,
  SubContextType
} from '../../lib/types/notification-tupe'

const prisma = new PrismaClient()

// CREATE - Создание уведомления с контекстом
export async function createNotification(notificationData: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        ...notificationData,
        expiresAt: notificationData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней по умолчанию
      }
    })

    // Ревалидация путей
    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/notifications')
    
    return { success: true, notification }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { error: 'Ошибка при создании уведомления' }
  }
}

// Создание уведомления с контекстом
export async function createContextNotification<T extends ContextType>(
  context: T,
  subContext: SubContextType<T>,
  message: string,
  entityId?: number,
  additionalData?: any,
  userId?: number
) {
  try {
    const contextConfig = (NotificationContext[context] as any)[subContext];
    
    if (!contextConfig) {
      console.warn(`Unknown notification context: ${context}.${String(subContext)}`);
      return { error: 'Неизвестный контекст уведомления' };
    }

    const actionUrl = entityId ? `${contextConfig.baseUrl}/${entityId}` : contextConfig.baseUrl;

    const notificationData: CreateNotificationData = {
      type: context as NotificationType,
      priority: contextConfig.priority,
      title: contextConfig.title,
      message,
      data: {
        context,
        subContext: String(subContext),
        entityId,
        ...additionalData
      },
      actionUrl,
      userId,
      expiresAt: getExpirationDate(context, String(subContext))
    }

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error creating context notification:', error);
    return { error: 'Ошибка при создании контекстного уведомления' };
  }
}

// Вспомогательная функция для определения времени истечения уведомления
function getExpirationDate(context: string, subContext: string): Date {
  const now = new Date();
  
  switch (context) {
    case 'PROMOTION':
      if (subContext === 'EXPIRING') {
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 часа
      }
      break;
    case 'ANALYTICS':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 часа
    case 'SYSTEM':
      if (subContext === 'ERROR') {
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 дня
      }
      break;
  }
  
  // По умолчанию 7 дней
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

// READ (List) - Получение уведомлений пользователя
export async function getUserNotifications(userId?: number, limit: number = 50) {
  try {
    const where = userId ? { userId } : {}
    
    const notifications = await prisma.notification.findMany({
      where: {
        ...where,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return { success: true, notifications }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { error: 'Ошибка при получении уведомлений' }
  }
}

// READ (Unread Count) - Количество непрочитанных уведомлений
export async function getUnreadNotificationsCount(userId?: number) {
  try {
    const where = userId ? { userId } : {}
    
    const count = await prisma.notification.count({
      where: {
        ...where,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    })

    return { success: true, count }
  } catch (error) {
    console.error('Error fetching unread notifications count:', error)
    return { error: 'Ошибка при получении количества уведомлений' }
  }
}

// UPDATE - Отметить как прочитанное
export async function markNotificationAsRead(id: number) {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/notifications')
    
    return { success: true, notification }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { error: 'Ошибка при обновлении уведомления' }
  }
}

// UPDATE - Отметить все как прочитанные
export async function markAllNotificationsAsRead(userId?: number) {
  try {
    const where = userId ? { userId } : {}
    
    await prisma.notification.updateMany({
      where: {
        ...where,
        isRead: false
      },
      data: { isRead: true }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { error: 'Ошибка при обновлении уведомлений' }
  }
}

// DELETE - Удаление уведомления
export async function deleteNotification(id: number) {
  try {
    await prisma.notification.delete({
      where: { id }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { error: 'Ошибка при удалении уведомления' }
  }
}

// DELETE - Удаление всех прочитанных уведомлений
export async function deleteAllReadNotifications(userId?: number) {
  try {
    const where = userId ? { userId } : {}
    
    await prisma.notification.deleteMany({
      where: {
        ...where,
        isRead: true
      }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/notifications')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting read notifications:', error)
    return { error: 'Ошибка при удалении уведомлений' }
  }
}

// ==================== СПЕЦИАЛИЗИРОВАННЫЕ ФУНКЦИИ ДЛЯ АДМИНКИ ====================

// Уведомление о новом заказе
export async function createNewOrderNotification(order: any) {
  return createContextNotification(
    'ORDER',
    'NEW',
    `Пользователь ${order.user.firstName} оформил заказ #${order.orderNumber} на сумму ${order.totalAmount} ₽`,
    order.id,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user.firstName,
      amount: order.totalAmount
    }
  )
}

// Уведомление об изменении статуса заказа
export async function createOrderStatusNotification(order: any, oldStatus: string, newStatus: string) {
  return createContextNotification(
    'ORDER',
    'STATUS_CHANGED',
    `Заказ #${order.orderNumber} переведен из "${oldStatus}" в "${newStatus}"`,
    order.id,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      oldStatus,
      newStatus
    }
  )
}

// Уведомление о новом пользователе
export async function createNewUserNotification(user: any) {
  return createContextNotification(
    'USER',
    'NEW',
    `Зарегистрирован новый пользователь: ${user.email}`,
    user.id,
    {
      userId: user.id,
      email: user.email,
      firstName: user.firstName
    }
  )
}

// Уведомление о заявке повара
export async function createChefApplicationNotification(chef: any) {
  return createContextNotification(
    'USER',
    'CHEF_APPLICATION',
    `Пользователь ${chef.user.firstName} подал заявку на роль повара: "${chef.businessName}"`,
    chef.id,
    {
      chefId: chef.id,
      businessName: chef.businessName,
      userName: chef.user.firstName
    }
  )
}

// Уведомление о новом отзыве
export async function createNewReviewNotification(review: any) {
  return createContextNotification(
    'REVIEW',
    'NEW',
    `Пользователь ${review.user.firstName} оставил отзыв с рейтингом ${review.rating}/5`,
    review.id,
    {
      reviewId: review.id,
      rating: review.rating,
      userName: review.user.firstName,
      productName: review.product?.name
    }
  )
}

// Уведомление о платеже
export async function createPaymentNotification(order: any, status: string) {
  const subContext = status === 'PAID' ? 'PAYMENT' : 'CANCELLED';
  const message = status === 'PAID' 
    ? `Оплата заказа #${order.orderNumber} на сумму ${order.totalAmount} ₽ прошла успешно`
    : `Не удалось обработать платеж для заказа #${order.orderNumber}`;

  return createContextNotification(
    'ORDER',
    subContext as any,
    message,
    order.id,
    {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      status
    }
  )
}

// Системное уведомление
export async function createSystemNotification(title: string, message: string, priority: NotificationPriority = NotificationPriority.MEDIUM) {
  const subContext = priority === 'HIGH' ? 'ERROR' : priority === 'MEDIUM' ? 'WARNING' : 'INFO';
  
  return createContextNotification(
    'SYSTEM',
    subContext as any,
    message,
    undefined,
    { systemEvent: true, customTitle: title },
    undefined
  )
}

// Аналитическое уведомление (ежедневный отчет)
export async function createAnalyticsNotification(stats: any) {
  return createContextNotification(
    'ANALYTICS',
    'DAILY_REPORT',
    `За сегодня: ${stats.todayOrders} заказов на ${stats.todayRevenue} ₽, ${stats.newUsers} новых пользователей`,
    undefined,
    stats
  )
}

// Уведомление о новом продукте
export async function createNewProductNotification(product: any) {
  return createContextNotification(
    'PRODUCT',
    'NEW',
    `Повар "${product.chef.businessName}" добавил новый продукт: "${product.name}" за ${product.price} ₽`,
    product.id,
    {
      productId: product.id,
      productName: product.name,
      price: product.price,
      chefName: product.chef.businessName
    }
  )
}

// Уведомление о промо-акции
export async function createPromotionNotification(promotion: any, context: 'NEW' | 'EXPIRING' | 'EXPIRED') {
  const messages = {
    NEW: `Создана новая акция: "${promotion.title}" со скидкой ${promotion.discountValue}${promotion.discountType === 'PERCENTAGE' ? '%' : '₽'}`,
    EXPIRING: `Акция "${promotion.title}" истекает через 3 дня`,
    EXPIRED: `Акция "${promotion.title}" истекла`
  };

  return createContextNotification(
    'PROMOTION',
    context,
    messages[context],
    promotion.id,
    {
      promotionId: promotion.id,
      title: promotion.title,
      discountValue: promotion.discountValue,
      discountType: promotion.discountType,
      endDate: promotion.endDate
    }
  )
}

// Группировка уведомлений по контексту
export async function getGroupedNotifications(userId?: number) {
  try {
    const result = await getUserNotifications(userId);
    
    if (!result.success) {
      return result;
    }

    const grouped = result.notifications.reduce((acc, notification) => {
      // Безопасное извлечение контекста из данных
      const data = notification.data as any;
      const context = data?.context || 'SYSTEM';
      if (!acc[context]) {
        acc[context] = [];
      }
      acc[context].push(notification);
      return acc;
    }, {} as Record<string, any[]>);

    return { success: true, grouped };
  } catch (error) {
    console.error('Error grouping notifications:', error);
    return { error: 'Ошибка при группировке уведомлений' };
  }
}

// Получение уведомлений по контексту
export async function getNotificationsByContext(context: ContextType, userId?: number) {
  try {
    const where: any = {
      type: context as NotificationType
    };

    if (userId) {
      where.userId = userId;
    }

    const notifications = await prisma.notification.findMany({
      where: {
        ...where,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications by context:', error);
    return { error: 'Ошибка при получении уведомлений по контексту' };
  }
}