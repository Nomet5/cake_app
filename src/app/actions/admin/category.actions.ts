'use server'

import { PrismaClient, NotificationType, NotificationPriority } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notification.actions'

const prisma = new PrismaClient()

// CREATE - Создание категории с уведомлением
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sortOrder = formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : 0
    const isActive = formData.get("isActive") === 'true'

    if (!name) {
      return { error: 'Название категории обязательно' }
    }

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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ для администраторов
    await createNotification({
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      title: 'Новая категория создана',
      message: `Категория "${name}" была успешно создана`,
      data: { 
        categoryId: category.id, 
        categoryName: name,
        action: 'CATEGORY_CREATED'
      },
      actionUrl: `/admin/categories/${category.id}`
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { error: 'Ошибка при создании категории' }
  }
}

// UPDATE - Обновление категории с уведомлением
export async function updateCategory(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const sortOrder = formData.get("sortOrder") ? parseInt(formData.get("sortOrder") as string) : undefined
    const isActive = formData.get("isActive") ? formData.get("isActive") === 'true' : undefined

    if (!name) {
      return { error: 'Название категории обязательно' }
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return { error: 'Категория не найдена' }
    }

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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об обновлении
    await createNotification({
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      title: 'Категория обновлена',
      message: `Категория "${existingCategory.name}" была обновлена`,
      data: { 
        categoryId: category.id, 
        categoryName: category.name,
        action: 'CATEGORY_UPDATED'
      },
      actionUrl: `/admin/categories/${category.id}`
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

// TOGGLE ACTIVE - Переключение активности категории с уведомлением
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об изменении статуса
    await createNotification({
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      title: 'Статус категории изменен',
      message: `Категория "${category.name}" ${updatedCategory.isActive ? 'активирована' : 'деактивирована'}`,
      data: { 
        categoryId: category.id, 
        categoryName: category.name,
        action: 'CATEGORY_STATUS_CHANGED',
        newStatus: updatedCategory.isActive ? 'ACTIVE' : 'INACTIVE'
      },
      actionUrl: `/admin/categories/${category.id}`
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, category: updatedCategory }
  } catch (error) {
    console.error('Error toggling category active:', error)
    return { error: 'Ошибка при изменении статуса категории' }
  }
}

// DELETE - Удаление категории с уведомлением
export async function deleteCategory(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true
      }
    })

    if (!category) {
      return { error: 'Категория не найдена' }
    }

    const hasProducts = category.products.length > 0

    if (hasProducts) {
      return { error: 'Нельзя удалить категорию с товарами. Сначала переместите или удалите товары.' }
    }

    await prisma.category.delete({
      where: { id }
    })

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об удалении
    await createNotification({
      type: NotificationType.SYSTEM,
      priority: NotificationPriority.MEDIUM,
      title: 'Категория удалена',
      message: `Категория "${category.name}" была удалена из системы`,
      data: { 
        categoryId: id, 
        categoryName: category.name,
        action: 'CATEGORY_DELETED'
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, message: 'Категория успешно удалена' }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { error: 'Ошибка при удалении категории' }
  }
}

// BULK UPDATE CATEGORIES - Массовое обновление категорий с уведомлением
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ о массовом обновлении
    if (result.count > 0) {
      await createNotification({
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        title: 'Массовое обновление категорий',
        message: `${result.count} категорий ${isActive ? 'активированы' : 'деактивированы'}`,
        data: { 
          categoryIds, 
          updatedCount: result.count,
          action: 'CATEGORY_BULK_UPDATE',
          newStatus: isActive ? 'ACTIVE' : 'INACTIVE'
        }
      })
    }

    revalidatePath('/admin/categories')
    revalidatePath('/products')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating categories:', error)
    return { error: 'Ошибка при массовом обновлении категорий' }
  }
}

// READ (List) - Получение списка категорий
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
            isAvailable: true
          },
          where: {
            isAvailable: true // только доступные товары
          }
        },
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