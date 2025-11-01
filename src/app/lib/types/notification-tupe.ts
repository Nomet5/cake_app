// lib/types/notification.types.ts
import { NotificationType, NotificationPriority } from '@prisma/client'

export interface CreateNotificationData {
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  data?: any
  actionUrl?: string
  userId?: number
  expiresAt?: Date
}

export interface NotificationContextConfig {
  title: string
  priority: NotificationPriority
  baseUrl: string
}

export interface NotificationContexts {
  ORDER: {
    NEW: NotificationContextConfig
    STATUS_CHANGED: NotificationContextConfig
    PAYMENT: NotificationContextConfig
    CANCELLED: NotificationContextConfig
  }
  USER: {
    NEW: NotificationContextConfig
    UPDATED: NotificationContextConfig
    CHEF_APPLICATION: NotificationContextConfig
  }
  PRODUCT: {
    NEW: NotificationContextConfig
    UPDATED: NotificationContextConfig
    LOW_STOCK: NotificationContextConfig
  }
  REVIEW: {
    NEW: NotificationContextConfig
    APPROVED: NotificationContextConfig
    REJECTED: NotificationContextConfig
  }
  PROMOTION: {
    NEW: NotificationContextConfig
    EXPIRING: NotificationContextConfig
    EXPIRED: NotificationContextConfig
  }
  SYSTEM: {
    ERROR: NotificationContextConfig
    WARNING: NotificationContextConfig
    INFO: NotificationContextConfig
  }
  ANALYTICS: {
    DAILY_REPORT: NotificationContextConfig
    WEEKLY_REPORT: NotificationContextConfig
    MONTHLY_REPORT: NotificationContextConfig
  }
}

export type ContextType = keyof NotificationContexts
export type SubContextType<T extends ContextType> = keyof NotificationContexts[T]