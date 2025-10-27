// lib/actions/category.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// CREATE - Создание категории
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sortOrder = formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : 0
    const isActive = formData.get("isActive") === 'true'

    // Валидация данных
    if (!name) {
      return { error: 'Название категории обязательно' }
    }

    // Проверяем уникальность названия
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: name
      }
    })

    if (existingCategory) {
      return { error: 'Категория с таким названием уже существует' }
    }

    const category = await prisma.category.create({
      data: {
        name,
        sortOrder,
        isActive
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { error: 'Ошибка при создании категории' }
  }
}

// READ (List) - Получение списка категорий
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
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
      ]
    })

    return categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
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

    return categories || []
  } catch (error) {
    console.error('Error fetching active categories:', error)
    return []
  }
}



// READ (Single) - Получение категории по ID
export async function getCategoryById(id: number) {
  try {
    // Добавляем проверку на валидность ID
    if (!id || isNaN(id)) {
      return { error: 'Неверный ID категории' }
    }

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
export async function updateCategory(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sortOrder = formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : undefined
    const isActive = formData.get("isActive") ? formData.get("isActive") === 'true' : undefined

    // Валидация
    if (!name) {
      return { error: 'Название категории обязательно' }
    }

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return { error: 'Категория не найдена' }
    }

    // Если меняется название, проверяем уникальность
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: { 
          name: name,
          id: { not: id }
        }
      })

      if (duplicateCategory) {
        return { error: 'Категория с таким названием уже существует' }
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive })
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    })

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    revalidatePath('/products')
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
    revalidatePath('/products')
    return { success: true, category: updatedCategory }
  } catch (error) {
    console.error('Error toggling category active:', error)
    return { error: 'Ошибка при изменении статуса категории' }
  }
}

// UPDATE STATUS - Обновление статуса категории
export async function updateCategoryStatus(id: number, isActive: boolean) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        isActive
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, category }
  } catch (error) {
    console.error('Error updating category status:', error)
    return { error: 'Ошибка при обновлении статуса категории' }
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
    revalidatePath('/products')
    return { success: true, category }
  } catch (error) {
    console.error('Error updating category sort order:', error)
    return { error: 'Ошибка при обновлении порядка сортировки' }
  }
}

// DELETE - Удаление категории
export async function deleteCategory(id: number) {
  try {
    // Проверяем существует ли категория
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    })

    if (!category) {
      return { error: 'Категория не найдена' }
    }

    // Нельзя удалить категорию с товарами
    const hasProducts = category.products.length > 0

    if (hasProducts) {
      return { error: 'Нельзя удалить категорию с товарами. Сначала переместите или удалите товары.' }
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, message: 'Категория успешно удалена' }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error: 'Ошибка при удалении категории' }
  }
}

// GET CATEGORIES WITH PRODUCTS - Категории с товарами
export async function getCategoriesWithProducts() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isAvailable: true },
          include: {
            images: {
              take: 1,
              where: { isPrimary: true }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          },
          take: 8,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            }
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return categories || []
  } catch (error) {
    console.error('Error fetching categories with products:', error)
    return []
  }
}

// GET POPULAR CATEGORIES - Популярные категории
export async function getPopularCategories(limit: number = 6) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            }
          }
        }
      },
      orderBy: [
        {
          products: {
            _count: 'desc'
          }
        },
        { sortOrder: 'asc' }
      ],
      take: limit
    })

    return categories || []
  } catch (error) {
    console.error('Error fetching popular categories:', error)
    return []
  }
}

// GET CATEGORY STATS - Статистика по категориям
export async function getCategoryStats() {
  try {
    const [
      totalCategories,
      activeCategories,
      inactiveCategories,
      categoriesWithProducts
    ] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ 
        where: { 
          isActive: true 
        } 
      }),
      prisma.category.count({ 
        where: { 
          isActive: false 
        } 
      }),
      prisma.category.count({
        where: {
          products: {
            some: {}
          }
        }
      })
    ])

    // Получаем среднее количество продуктов через отдельный запрос
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    const totalProducts = categoriesWithCounts.reduce((sum, cat) => sum + cat._count.products, 0)
    const averageProducts = categoriesWithCounts.length > 0 ? totalProducts / categoriesWithCounts.length : 0

    return {
      total: totalCategories,
      active: activeCategories,
      inactive: inactiveCategories,
      withProducts: categoriesWithProducts,
      averageProducts: Math.round(averageProducts * 100) / 100
    }
  } catch (error) {
    console.error('Error fetching category stats:', error)
    return {
      total: 0,
      active: 0,
      inactive: 0,
      withProducts: 0,
      averageProducts: 0
    }
  }
}

// BULK UPDATE CATEGORIES - Массовое обновление категорий
export async function bulkUpdateCategories(categoryIds: number[], isActive: boolean) {
  try {
    const result = await prisma.category.updateMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      data: {
        isActive
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating categories:', error)
    return { error: 'Ошибка при массовом обновлении категорий' }
  }
}

// REORDER CATEGORIES - Изменение порядка категорий
export async function reorderCategories(categories: { id: number; sortOrder: number }[]) {
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
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    console.error('Error reordering categories:', error)
    return { error: 'Ошибка при изменении порядка категорий' }
  }
}

// SEARCH CATEGORIES - Поиск категорий
export async function searchCategories(query: string, includeInactive: boolean = false) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } }
            ]
          },
          ...(includeInactive ? [] : [{ isActive: true }])
        ]
      },
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
      ]
    })

    return categories || []
  } catch (error) {
    console.error('Error searching categories:', error)
    return []
  }
}