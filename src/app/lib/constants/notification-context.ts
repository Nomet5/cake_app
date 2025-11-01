// lib/constants/notification-contexts.ts
import { NotificationPriority } from '@prisma/client'
import { NotificationContexts } from '../types/notification-tupe'

export const NotificationContext: NotificationContexts = {
  // Контекст заказов
  ORDER: {
    NEW: {
      title: 'Новый заказ',
      priority: 'HIGH' as NotificationPriority,
      baseUrl: '/admin/orders'
    },
    STATUS_CHANGED: {
      title: 'Статус заказа изменен',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/orders'
    },
    PAYMENT: {
      title: 'Статус оплаты изменен',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/orders'
    },
    CANCELLED: {
      title: 'Заказ отменен',
      priority: 'HIGH' as NotificationPriority,
      baseUrl: '/admin/orders'
    }
  },

  // Контекст пользователей
  USER: {
    NEW: {
      title: 'Новый пользователь',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/users'
    },
    UPDATED: {
      title: 'Пользователь обновлен',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/users'
    },
    CHEF_APPLICATION: {
      title: 'Новая заявка повара',
      priority: 'HIGH' as NotificationPriority,
      baseUrl: '/admin/chefs'
    }
  },

  // Контекст продуктов
  PRODUCT: {
    NEW: {
      title: 'Новый продукт',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/products'
    },
    UPDATED: {
      title: 'Продукт обновлен',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/products'
    },
    LOW_STOCK: {
      title: 'Низкий запас продукта',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/products'
    }
  },

  // Контекст отзывов
  REVIEW: {
    NEW: {
      title: 'Новый отзыв',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/reviews'
    },
    APPROVED: {
      title: 'Отзыв одобрен',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/reviews'
    },
    REJECTED: {
      title: 'Отзыв отклонен',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/reviews'
    }
  },

  // Контекст промо-акций
  PROMOTION: {
    NEW: {
      title: 'Новая акция',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/promotions'
    },
    EXPIRING: {
      title: 'Акция скоро истекает',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/promotions'
    },
    EXPIRED: {
      title: 'Акция истекла',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/promotions'
    }
  },

  // Системный контекст
  SYSTEM: {
    ERROR: {
      title: 'Системная ошибка',
      priority: 'HIGH' as NotificationPriority,
      baseUrl: '/admin/dashboard'
    },
    WARNING: {
      title: 'Системное предупреждение',
      priority: 'MEDIUM' as NotificationPriority,
      baseUrl: '/admin/dashboard'
    },
    INFO: {
      title: 'Системное уведомление',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/dashboard'
    }
  },

  // Аналитический контекст
  ANALYTICS: {
    DAILY_REPORT: {
      title: 'Ежедневный отчет',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/analytics'
    },
    WEEKLY_REPORT: {
      title: 'Еженедельный отчет',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/analytics'
    },
    MONTHLY_REPORT: {
      title: 'Ежемесячный отчет',
      priority: 'LOW' as NotificationPriority,
      baseUrl: '/admin/analytics'
    }
  }
}