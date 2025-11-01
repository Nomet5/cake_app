// lib/types/chef.types.ts
export interface Chef {
  id: number
  businessName: string
  description?: string
  specialty?: string
  yearsOfExperience?: number
  userId: number
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
  user?: {
    firstName: string
    email: string
    phone?: string
  }
  _count?: {
    products: number
    orders: number
    reviews: number
  }
  adminStats?: {
    totalRevenue: number
    averageRating: number
    completionRate: number
    responseTime: number
  }
}

export interface ChefFilters {
  search?: string
  status?: string
  specialization?: string
  sort?: string
  page?: number
  limit?: number
}

export interface ChefsResponse {
  success: boolean
  chefs: Chef[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNext: boolean
    hasPrev: boolean
  }
  error?: string
}

export interface ChefStats {
  total: number
  active: number
  inactive: number
  verified: number
  withProducts: number
  totalProducts: number
  averageProducts: number
  newChefsThisMonth: number
  chefsWithOrders: number
  activeChefsWithProducts: number
  orderCompletionRate: number
}