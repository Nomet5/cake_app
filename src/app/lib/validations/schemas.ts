// lib/validations/schemas.ts
import { z } from 'zod'

// User
export const userSchema = z.object({
  email: z.string().email('Некорректный email'),
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().optional(),
  passwordHash: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

// Chef
export const chefSchema = z.object({
  userId: z.number(),
  businessName: z.string().min(2, 'Название бизнеса обязательно'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
})

// Product
export const productSchema = z.object({
  chefId: z.number(),
  categoryId: z.number().optional(),
  name: z.string().min(2, 'Название товара обязательно'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  isAvailable: z.boolean().default(true),
})

// Category
export const categorySchema = z.object({
  name: z.string().min(2, 'Название категории обязательно'),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
})

// Order
export const orderSchema = z.object({
  userId: z.number(),
  chefId: z.number(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']),
  totalAmount: z.number().min(0),
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0),
  deliveryAddress: z.string().min(5, 'Адрес доставки обязателен'),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  paymentMethod: z.enum(['CARD', 'CASH', 'ONLINE']).optional(),
})

// Review
export const reviewSchema = z.object({
  orderId: z.number(),
  userId: z.number(),
  chefId: z.number(),
  productId: z.number().optional(),
  rating: z.number().min(1).max(5, 'Рейтинг должен быть от 1 до 5'),
  comment: z.string().optional(),
  isApproved: z.boolean().default(true),
})

// Promotion
export const promotionSchema = z.object({
  chefId: z.number(),
  title: z.string().min(2, 'Название акции обязательно'),
  discountType: z.enum(['PERCENTAGE', 'FIXED', 'FREE_DELIVERY']),
  discountValue: z.number().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  isActive: z.boolean().default(true),
})

export type UserFormData = z.infer<typeof userSchema>
export type ChefFormData = z.infer<typeof chefSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type OrderFormData = z.infer<typeof orderSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type PromotionFormData = z.infer<typeof promotionSchema>