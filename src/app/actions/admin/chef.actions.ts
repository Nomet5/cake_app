// lib/actions/chef.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// CREATE - Создание повара
export async function createChef(formData) {
  try {
    const businessName = formData.get("businessName")
    const description = formData.get("description")
    const specialty = formData.get("specialty")
    const yearsOfExperience = formData.get("yearsOfExperience") ? parseInt(formData.get("yearsOfExperience")) : undefined
    const userId = parseInt(formData.get("userId"))
    const isActive = formData.get("isActive") === 'true'
    const isVerified = formData.get("isVerified") === 'true'

    console.log('Creating chef with data:', {
      businessName,
      description,
      specialty,
      yearsOfExperience,
      userId,
      isActive,
      isVerified
    })

    // Валидация данных
    if (!businessName || !userId) {
      return { error: 'Название бизнеса и пользователь обязательны' }
    }

    // Проверяем существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем не является ли пользователь уже поваром
    const existingChef = await prisma.chef.findUnique({
      where: { userId }
    })

    if (existingChef) {
      return { error: 'Этот пользователь уже является поваром' }
    }

    const chefData = {
      businessName,
      description,
      yearsOfExperience,
      userId,
      isActive,
      isVerified
    }

    // Добавляем specialty только если поле существует в базе
    // Раскомментируйте когда добавите поле в базу:
    // if (specialty) {
    //   chefData.specialty = specialty
    // }

    const chef = await prisma.chef.create({
      data: chefData,
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    console.log('Chef created successfully:', chef)

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error creating chef:', error)
    return { error: 'Ошибка при создании повара: ' + error.message }
  }
}

// READ (List) - Получение списка поваров
export async function getChefs() {
  try {
    const chefs = await prisma.chef.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            phone: true
          }
        },
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return chefs || []
  } catch (error) {
    console.error('Error fetching chefs:', error)
    return []
  }
}

// READ (Single) - Получение повара по ID
export async function getChefById(id: number) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        user: true,
        products: {
          include: {
            category: true,
            _count: { 
              select: { 
                orderItems: true, 
                reviews: true 
              } 
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          include: {
            user: true,
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        reviews: {
          include: {
            user: true,
            product: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: true,
            orders: true,
            reviews: true
          }
        }
      }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    return { success: true, chef }
  } catch (error) {
    console.error('Error fetching chef:', error)
    return { error: 'Ошибка при получении повара' }
  }
}

// UPDATE - Обновление повара
export async function updateChef(id: number, formData: FormData) {
  try {
    const businessName = formData.get("businessName") as string
    const description = formData.get("description") as string
    const specialty = formData.get("specialty") as string
    const yearsOfExperience = formData.get("yearsOfExperience") ? parseInt(formData.get("yearsOfExperience") as string) : undefined
    const userId = formData.get("userId") ? parseInt(formData.get("userId") as string) : undefined
    const isActive = formData.get("isActive") ? formData.get("isActive") === 'true' : undefined
    const isVerified = formData.get("isVerified") ? formData.get("isVerified") === 'true' : undefined

    // Валидация
    if (!businessName) {
      return { error: 'Название бизнеса обязательно' }
    }

    // Проверяем существование повара
    const existingChef = await prisma.chef.findUnique({
      where: { id }
    })

    if (!existingChef) {
      return { error: 'Повар не найден' }
    }

    // Проверяем пользователя если указан
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return { error: 'Пользователь не найден' }
      }

      // Проверяем не занят ли пользователь другим поваром
      const chefWithSameUser = await prisma.chef.findFirst({
        where: { 
          userId,
          id: { not: id }
        }
      })

      if (chefWithSameUser) {
        return { error: 'Этот пользователь уже привязан к другому повару' }
      }
    }

    const updateData = {
      ...(businessName && { businessName }),
      ...(description && { description }),
      ...(specialty && { specialty }),
      ...(yearsOfExperience !== undefined && { yearsOfExperience }),
      ...(userId && { userId }),
      ...(isActive !== undefined && { isActive }),
      ...(isVerified !== undefined && { isVerified }),
      updatedAt: new Date()
    }

    const chef = await prisma.chef.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        }
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath(`/admin/chefs/${id}`)
    revalidatePath('/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error updating chef:', error)
    return { error: 'Ошибка при обновлении повара' }
  }
}

// VERIFY - Верификация повара
export async function verifyChef(id: number) {
  try {
    const chef = await prisma.chef.update({
      where: { id },
      data: {
        isVerified: true,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error verifying chef:', error)
    return { error: 'Ошибка при верификации повара' }
  }
}

// TOGGLE ACTIVE - Переключение активности повара
export async function toggleChefActive(id: number) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    const updatedChef = await prisma.chef.update({
      where: { id },
      data: {
        isActive: !chef.isActive,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef: updatedChef }
  } catch (error) {
    console.error('Error toggling chef active:', error)
    return { error: 'Ошибка при изменении статуса повара' }
  }
}

// UPDATE STATUS - Обновление статуса повара
export async function updateChefStatus(id: number, isActive: boolean) {
  try {
    const chef = await prisma.chef.update({
      where: { id },
      data: {
        isActive,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef }
  } catch (error) {
    console.error('Error updating chef status:', error)
    return { error: 'Ошибка при обновлении статуса повара' }
  }
}

// DELETE - Удаление повара
export async function deleteChef(id: number) {
  try {
    // Проверяем существует ли повар
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        products: true,
        orders: true,
        reviews: true
      }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    // Нельзя удалить повара с товарами или заказами
    const hasProducts = chef.products.length > 0
    const hasOrders = chef.orders.length > 0
    const hasReviews = chef.reviews.length > 0

    if (hasProducts || hasOrders || hasReviews) {
      let errorMessage = 'Нельзя удалить повара с '
      const reasons = []
      if (hasProducts) reasons.push('товарами')
      if (hasOrders) reasons.push('заказами')
      if (hasReviews) reasons.push('отзывами')
      errorMessage += reasons.join(', ')
      
      return { error: errorMessage }
    }

    // Удаляем повара
    await prisma.chef.delete({
      where: { id }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, message: 'Повар успешно удален' }
  } catch (error) {
    console.error('Error deleting chef:', error)
    return { error: 'Ошибка при удалении повара' }
  }
}

// GET ACTIVE CHEFS - Активные повары
export async function getActiveChefs() {
  try {
    const chefs = await prisma.chef.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return chefs || []
  } catch (error) {
    console.error('Error fetching active chefs:', error)
    return []
  }
}

// GET VERIFIED CHEFS - Верифицированные повары
export async function getVerifiedChefs() {
  try {
    const chefs = await prisma.chef.findMany({
      where: { 
        isVerified: true,
        isActive: true 
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            },
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return chefs || []
  } catch (error) {
    console.error('Error fetching verified chefs:', error)
    return []
  }
}

// GET CHEFS WITH PRODUCTS - Повары с товарами
export async function getChefsWithProducts() {
  try {
    const chefs = await prisma.chef.findMany({
      where: { 
        isActive: true,
        products: {
          some: {
            isAvailable: true
          }
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
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
          take: 4,
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
      orderBy: { createdAt: 'desc' }
    })

    return chefs || []
  } catch (error) {
    console.error('Error fetching chefs with products:', error)
    return []
  }
}

// GET POPULAR CHEFS - Популярные повары
export async function getPopularChefs(limit: number = 6) {
  try {
    const chefs = await prisma.chef.findMany({
      where: { 
        isActive: true,
        isVerified: true
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        _count: {
          select: {
            products: {
              where: { isAvailable: true }
            },
            orders: true,
            reviews: true
          }
        }
      },
      orderBy: [
        {
          orders: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ],
      take: limit
    })

    return chefs || []
  } catch (error) {
    console.error('Error fetching popular chefs:', error)
    return []
  }
}

// GET CHEF STATS - Статистика по поварам
export async function getChefStats() {
  try {
    const [
      totalChefs,
      activeChefs,
      inactiveChefs,
      verifiedChefs,
      chefsWithProducts,
      totalProducts
    ] = await Promise.all([
      prisma.chef.count(),
      prisma.chef.count({ 
        where: { 
          isActive: true 
        } 
      }),
      prisma.chef.count({ 
        where: { 
          isActive: false 
        } 
      }),
      prisma.chef.count({ 
        where: { 
          isVerified: true 
        } 
      }),
      prisma.chef.count({
        where: {
          products: {
            some: {}
          }
        }
      }),
      prisma.product.count({
        where: {
          isAvailable: true
        }
      })
    ])

    // Рассчитываем среднее количество продуктов на повара
    const chefsWithProductsCount = await prisma.chef.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    const averageProducts = chefsWithProductsCount.length > 0 
      ? chefsWithProductsCount.reduce((sum, chef) => sum + chef._count.products, 0) / chefsWithProductsCount.length
      : 0

    return {
      total: totalChefs,
      active: activeChefs,
      inactive: inactiveChefs,
      verified: verifiedChefs,
      withProducts: chefsWithProducts,
      totalProducts,
      averageProducts: Math.round(averageProducts * 100) / 100
    }
  } catch (error) {
    console.error('Error fetching chef stats:', error)
    return {
      total: 0,
      active: 0,
      inactive: 0,
      verified: 0,
      withProducts: 0,
      totalProducts: 0,
      averageProducts: 0
    }
  }
}

// SEARCH CHEFS - Поиск поваров
// SEARCH CHEFS - Простой поиск поваров
export async function searchChefs(query: string, includeInactive: boolean = false) {
  try {
    const chefs = await prisma.chef.findMany({
      where: {
        AND: [
          {
            OR: [
              { businessName: { contains: query } },
              { description: { contains: query } },
              { specialty: { contains: query } },
              { user: { 
                OR: [
                  { firstName: { contains: query } },
                  { email: { contains: query } }
                ]
              } }
            ]
          },
          ...(includeInactive ? [] : [{ isActive: true }])
        ]
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        _count: {
          select: {
            products: true,
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return chefs || [];
  } catch (error) {
    console.error('Error searching chefs:', error);
    return [];
  }
}
// BULK UPDATE CHEFS - Массовое обновление поваров
export async function bulkUpdateChefs(chefIds: number[], isActive: boolean) {
  try {
    const result = await prisma.chef.updateMany({
      where: {
        id: {
          in: chefIds
        }
      },
      data: {
        isActive,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating chefs:', error)
    return { error: 'Ошибка при массовом обновлении поваров' }
  }
}