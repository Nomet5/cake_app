// lib/actions/product.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { productSchema, type ProductFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE
export async function createProduct(formData: ProductFormData) {
  try {
    const validatedData = productSchema.parse(formData)
    
    // Проверяем существует ли повар
    const chef = await prisma.chef.findUnique({
      where: { id: validatedData.chefId }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    const product = await prisma.product.create({
      data: validatedData
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${validatedData.chefId}`)
    return { success: true, product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: 'Ошибка при создании товара' }
  }
}

// READ (List)
export async function getProducts(page: number = 1, limit: number = 20, search?: string, chefId?: number) {
  try {
    const skip = (page - 1) * limit
    
    const where = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(chefId ? { chefId } : {})
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          chef: {
            select: {
              businessName: true,
              user: { select: { firstName: true, email: true } }
            }
          },
          category: {
            select: { name: true }
          },
          _count: {
            select: {
              orderItems: true,
              reviews: true,
              cartItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return {
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { error: 'Ошибка при получении товаров' }
  }
}

// READ (Single)
export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        chef: {
          include: {
            user: true
          }
        },
        category: true,
        images: true,
        reviews: {
          include: {
            user: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true
          }
        }
      }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    return { success: true, product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { error: 'Ошибка при получении товара' }
  }
}

// UPDATE
export async function updateProduct(id: number, formData: Partial<ProductFormData>) {
  try {
    const validatedData = productSchema.partial().parse(formData)

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: 'Ошибка при обновлении товара' }
  }
}

// TOGGLE AVAILABLE
export async function toggleProductAvailable(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isAvailable: !product.isAvailable,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${product.chefId}`)
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error('Error toggling product available:', error)
    return { error: 'Ошибка при изменении доступности товара' }
  }
}

// DELETE
export async function deleteProduct(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const productData = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true
          }
        }
      }
    })

    if (!productData) {
      return { error: 'Товар не найден' }
    }

    if (productData._count.orderItems > 0) {
      return { error: 'Нельзя удалить товар с историей заказов' }
    }

    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${productData.chefId}`)
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Ошибка при удалении товара' }
  }
}