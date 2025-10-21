// lib/actions/category.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { categorySchema, type CategoryFormData } from '../validations/schemas'

const prisma = new PrismaClient()

// CREATE - Создание категории
export async function createCategory(formData: CategoryFormData) {
  try {
    const validatedData = categorySchema.parse(formData)
    
    // Проверяем уникальность названия
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: { 
          equals: validatedData.name,
          mode: 'insensitive'
        }
      }
    })

    if (existingCategory) {
      return { error: 'Категория с таким названием уже существует' }
    }

    const category = await prisma.category.create({
      data: validatedData
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { error: 'Ошибка при создании категории' }
  }
}

// READ (List) - Получение списка категорий
export async function getCategories(page: number = 1, limit: number = 20, search?: string, includeInactive: boolean = false) {
  try {
    const skip = (page - 1) * limit
    
    const where = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(!includeInactive ? { isActive: true } : {})
    }

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.category.count({ where })
    ])

    return {
      success: true,
      categories,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { error: 'Ошибка при получении категорий' }
  }
}

// READ (All Active) - Все активные категории для выпадающих списков
export async function getActiveCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sortOrder: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return { success: true, categories }
  } catch (error) {
    console.error('Error fetching active categories:', error)
    return { error: 'Ошибка при получении категорий' }
  }
}

// READ (Single) - Получение категории по ID
export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            chef: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    email: true
                  }
                }
              }
            },
            _count: {
              select: {
                orderItems: true,
                reviews: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return { error: 'Категория не найдена' }
    }

    return { success: true, category }
  } catch (error) {
    console.error('Error fetching category:', error)
    return { error: 'Ошибка при получении категории' }
  }
}

// UPDATE - Обновление категории
export async function updateCategory(id: number, formData: Partial<CategoryFormData>) {
  try {
    const validatedData = categorySchema.partial().parse(formData)

    // Если меняется название, проверяем уникальность
    if (validatedData.name) {
      const existingCategory = await prisma.category.findFirst({
        where: { 
          name: { 
            equals: validatedData.name,
            mode: 'insensitive'
          },
          id: { not: id }
        }
      })

      if (existingCategory) {
        return { error: 'Категория с таким названием уже существует' }
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData
    })

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    return { success: true, category }
  } catch (error) {
    console.error('Error updating category:', error)
    return { error: 'Ошибка при обновлении категории' }
  }
}

// TOGGLE ACTIVE - Переключение активности категории
export async function toggleCategoryActive(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return { error: 'Категория не найдена' }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive
      }
    })

    revalidatePath('/admin/categories')
    return { success: true, category: updatedCategory }
  } catch (error) {
    console.error('Error toggling category active:', error)
    return { error: 'Ошибка при изменении статуса категории' }
  }
}

// UPDATE SORT ORDER - Обновление порядка сортировки
export async function updateCategorySortOrder(id: number, sortOrder: number) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        sortOrder
      }
    })

    revalidatePath('/admin/categories')
    return { success: true, category }
  } catch (error) {
    console.error('Error updating category sort order:', error)
    return { error: 'Ошибка при обновлении порядка сортировки' }
  }
}

// DELETE - Удаление категории
export async function deleteCategory(id: number) {
  try {
    // Проверяем есть ли связанные товары
    const categoryData = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!categoryData) {
      return { error: 'Категория не найдена' }
    }

    if (categoryData._count.products > 0) {
      return { error: 'Нельзя удалить категорию с товарами. Сначала переместите или удалите товары.' }
    }

    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error: 'Ошибка при удалении категории' }
  }
}

// BULK UPDATE - Массовое обновление категорий (для сортировки)
export async function bulkUpdateCategories(categories: { id: number; sortOrder: number }[]) {
  try {
    await Promise.all(
      categories.map(cat =>
        prisma.category.update({
          where: { id: cat.id },
          data: { sortOrder: cat.sortOrder }
        })
      )
    )

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Error bulk updating categories:', error)
    return { error: 'Ошибка при массовом обновлении категорий' }
  }
}