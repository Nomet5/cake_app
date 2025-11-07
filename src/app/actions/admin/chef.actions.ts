// lib/actions/chef.actions.ts
'use server'

import { PrismaClient, NotificationType, NotificationPriority } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notification.actions'
import { createContextNotification,
  createSystemNotification } from './notification.actions'

const prisma = new PrismaClient()

// CREATE - Создание повара с уведомлением (создает пользователя и повара)
export async function createChef(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const specialty = formData.get('specialty') as string;
    const experience = formData.get('experience') as string;
    const status = formData.get('status') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const avatar = formData.get('avatar') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Валидация
    if (!name?.trim()) {
      return { success: false, error: 'Имя обязательно' };
    }

    if (!email?.trim()) {
      return { success: false, error: 'Email обязателен' };
    }

    if (!specialty?.trim()) {
      return { success: false, error: 'Специализация обязательна' };
    }

    if (!password?.trim()) {
      return { success: false, error: 'Пароль обязателен' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Пароль должен содержать минимум 6 символов' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Пароли не совпадают' };
    }

    // Проверяем существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        firstName: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: await hashPassword(password),
        phone: phone?.trim() || null,
        role: 'CHEF', // Устанавливаем роль повара
      }
    });

    // Преобразуем опыт работы в число
    const yearsOfExperience = getYearsOfExperience(experience);

    // Создаем повара
    const chef = await prisma.chef.create({
      data: {
        userId: user.id,
        businessName: `${name.trim()}'s Kitchen`,
        description: description || `Профессиональный повар ${name.trim()}, специализирующийся на ${specialty}`,
        specialty: specialty,
        yearsOfExperience: yearsOfExperience,
        isActive: status === 'active',
        isVerified: status === 'active',
        // address: address || null, // если есть в схеме
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Создаем уведомление о новом поваре
    await createChefNotification(chef, 'CREATED');

    revalidatePath('/admin/chefs');
    
    return { 
      success: true, 
      chef: {
        id: chef.id,
        name: chef.user.firstName,
        email: chef.user.email,
        specialty: chef.specialty,
        status: chef.isActive ? 'active' : 'inactive'
      }
    };
    
  } catch (error) {
    console.error('Error creating chef:', error);
    
    // Создаем системное уведомление об ошибке
    await createSystemNotification(
      'Ошибка создания повара',
      `Произошла ошибка при создании повара: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      'HIGH'
    );
    
    return { 
      success: false, 
      error: 'Ошибка при создании повара' 
    };
  }
}

// Функция для хеширования пароля
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}


// UPDATE - Обновление повара с уведомлением
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
      where: { id },
      include: {
        user: {
          select: {
            firstName: true
          }
        }
      }
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об обновлении повара
    await createNotification({
      type: NotificationType.USER,
      priority: NotificationPriority.MEDIUM,
      title: 'Профиль повара обновлен',
      message: `Профиль повара "${existingChef.businessName}" был обновлен`,
      data: {
        chefId: chef.id,
        businessName: chef.businessName,
        action: 'CHEF_UPDATED'
      },
      actionUrl: `/admin/chefs/${chef.id}`
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

// VERIFY - Верификация повара с уведомлением
export async function verifyChef(id: number) {
  try {
    const chef = await prisma.chef.findUnique({
      where: { id }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    if (chef.isVerified) {
      return { error: 'Повар уже верифицирован' }
    }

    const updatedChef = await prisma.chef.update({
      where: { id },
      data: {
        isVerified: true,
        updatedAt: new Date()
      }
    })

    // СОЗДАЕМ УВЕДОМЛЕНИЕ о верификации
    await createNotification({
      type: NotificationType.USER,
      priority: NotificationPriority.HIGH,
      title: 'Повар верифицирован',
      message: `Повар "${chef.businessName}" успешно верифицирован`,
      data: {
        chefId: chef.id,
        businessName: chef.businessName,
        action: 'CHEF_VERIFIED'
      },
      actionUrl: `/admin/chefs/${chef.id}`
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef: updatedChef }
  } catch (error) {
    console.error('Error verifying chef:', error)
    return { error: 'Ошибка при верификации повара' }
  }
}

// TOGGLE ACTIVE - Переключение активности повара с уведомлением
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об изменении статуса активности
    await createNotification({
      type: NotificationType.USER,
      priority: NotificationPriority.MEDIUM,
      title: 'Статус повара изменен',
      message: `Повар "${chef.businessName}" ${updatedChef.isActive ? 'активирован' : 'деактивирован'}`,
      data: {
        chefId: chef.id,
        businessName: chef.businessName,
        action: 'CHEF_STATUS_CHANGED',
        newStatus: updatedChef.isActive ? 'ACTIVE' : 'INACTIVE'
      },
      actionUrl: `/admin/chefs/${chef.id}`
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef: updatedChef }
  } catch (error) {
    console.error('Error toggling chef active:', error)
    return { error: 'Ошибка при изменении статуса повара' }
  }
}

// UPDATE STATUS - Обновление статуса повара с уведомлением
export async function updateChefStatus(id: number, isActive: boolean) {
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
        isActive,
        updatedAt: new Date()
      }
    })

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об изменении статуса
    if (chef.isActive !== isActive) {
      await createNotification({
        type: NotificationType.USER,
        priority: NotificationPriority.MEDIUM,
        title: 'Статус повара обновлен',
        message: `Повар "${chef.businessName}" ${isActive ? 'активирован' : 'деактивирован'}`,
        data: {
          chefId: chef.id,
          businessName: chef.businessName,
          action: 'CHEF_STATUS_UPDATED',
          newStatus: isActive ? 'ACTIVE' : 'INACTIVE'
        },
        actionUrl: `/admin/chefs/${chef.id}`
      })
    }

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, chef: updatedChef }
  } catch (error) {
    console.error('Error updating chef status:', error)
    return { error: 'Ошибка при обновлении статуса повара' }
  }
}

// BULK UPDATE CHEFS - Массовое обновление поваров с уведомлением
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ о массовом обновлении
    if (result.count > 0) {
      await createNotification({
        type: NotificationType.USER,
        priority: NotificationPriority.MEDIUM,
        title: 'Массовое обновление поваров',
        message: `${result.count} поваров ${isActive ? 'активированы' : 'деактивированы'}`,
        data: {
          chefIds,
          updatedCount: result.count,
          action: 'CHEF_BULK_UPDATE',
          newStatus: isActive ? 'ACTIVE' : 'INACTIVE'
        }
      })
    }

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating chefs:', error)
    return { error: 'Ошибка при массовом обновлении поваров' }
  }
}

// DELETE - Удаление повара с уведомлением
export async function deleteChef(id: number) {
  try {
    // Проверяем существует ли повар
    const chef = await prisma.chef.findUnique({
      where: { id },
      include: {
        products: true,
        orders: true,
        reviews: true,
        user: {
          select: {
            firstName: true
          }
        }
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

    // СОЗДАЕМ УВЕДОМЛЕНИЕ об удалении повара
    await createNotification({
      type: NotificationType.USER,
      priority: NotificationPriority.HIGH,
      title: 'Повар удален',
      message: `Повар "${chef.businessName}" был удален из системы`,
      data: {
        chefId: id,
        businessName: chef.businessName,
        action: 'CHEF_DELETED'
      }
    })

    revalidatePath('/admin/chefs')
    revalidatePath('/chefs')
    return { success: true, message: 'Повар успешно удален' }
  } catch (error) {
    console.error('Error deleting chef:', error)
    return { error: 'Ошибка при удалении повара' }
  }
}

// READ (List) - Получение списка поваров
export async function getChefs(options: {
  search?: string;
  status?: string;
  specialization?: string;
  sort?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const {
      search = '',
      status = '',
      specialization = '',
      sort = 'name',
      page = 1,
      limit = 10
    } = options

    const skip = (page - 1) * limit

    // Базовые условия для запроса
    const where: any = {}

    // Поиск по названию бизнеса, email или имени пользователя
    if (search) {
      const searchLower = search.toLowerCase()
      where.OR = [
        { 
          businessName: { 
            contains: searchLower
          } 
        },
        { 
          user: { 
            email: { 
              contains: searchLower
            } 
          } 
        },
        { 
          user: { 
            firstName: { 
              contains: searchLower
            } 
          } 
        }
      ]
    }

    // Фильтр по статусу - КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ
    if (status) {
      if (status === 'active') {
        where.isActive = true
      } else if (status === 'inactive') {
        where.isActive = false
      } else if (status === 'pending') {
        // "На проверке" - активные но не верифицированные
        where.isActive = true
        where.isVerified = false
      } else if (status === 'verified') {
        // Верифицированные - активные и верифицированные
        where.isActive = true
        where.isVerified = true
      }
    }

    // Фильтр по специализации
    if (specialization) {
      where.specialty = { 
        contains: specialization.toLowerCase()
      }
    }

    // Сортировка
    const orderBy: any = {}
    if (sort === 'name') {
      orderBy.businessName = 'asc'
    } else if (sort === 'name_desc') {
      orderBy.businessName = 'desc'
    } else if (sort === 'createdAt_desc') {
      orderBy.createdAt = 'desc'
    } else if (sort === 'createdAt') {
      orderBy.createdAt = 'asc'
    } else if (sort === 'products') {
      // Сортировка по количеству товаров
      orderBy.products = { _count: 'desc' }
    } else if (sort === 'products_desc') {
      orderBy.products = { _count: 'asc' }
    } else {
      // По умолчанию сортируем по имени
      orderBy.businessName = 'asc'
    }

    console.log('Where conditions:', JSON.stringify(where, null, 2))
    console.log('Order by:', JSON.stringify(orderBy, null, 2))

    const [chefs, totalCount] = await Promise.all([
      prisma.chef.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              email: true,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.chef.count({ where })
    ])

    console.log(`Found ${chefs.length} chefs with status: ${status}`)

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      chefs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  } catch (error) {
    console.error('Error fetching chefs:', error)
    return {
      success: false,
      error: 'Ошибка при загрузке поваров: ' + (error as Error).message,
      chefs: [],
      pagination: null
    }
  }
}

// READ (Single) - Получение повара по ID
export async function getChefById(id: string) { 
  try {
    const chef = await prisma.chef.findUnique({
      where: { id: parseInt(id) }, // Convert string to number
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
      return { error: 'Chef not found' }
    }

    return { success: true, chef }
  } catch (error) {
    console.error('Error fetching chef:', error)
    return { error: 'Ошибка при получении повара' }
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

export async function getChefStatusStats() {
  try {
    const [activeVerified, activeNotVerified, inactive] = await Promise.all([
      // Активные и верифицированные
      prisma.chef.count({
        where: {
          isActive: true,
          isVerified: true
        }
      }),
      // Активные но не верифицированные (на проверке)
      prisma.chef.count({
        where: {
          isActive: true,
          isVerified: false
        }
      }),
      // Неактивные
      prisma.chef.count({
        where: {
          isActive: false
        }
      })
    ])

    return {
      active: activeVerified + activeNotVerified,
      inactive: inactive,
      pending: activeNotVerified,
      verified: activeVerified,
      total: activeVerified + activeNotVerified + inactive
    }
  } catch (error) {
    console.error('Error fetching chef status stats:', error)
    return {
      active: 0,
      inactive: 0,
      pending: 0,
      verified: 0,
      total: 0
    }
  }
}

// SEARCH CHEFS - Поиск поваров
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

export async function createChefFromUser(formData: FormData) {
  try {
    const userId = formData.get('userId') as string;
    const specialty = formData.get('specialty') as string;
    const experience = formData.get('experience') as string;
    const status = formData.get('status') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const avatar = formData.get('avatar') as string;

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        chefProfile: true
      }
    });

    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }

    // Проверяем, не является ли пользователь уже поваром
    if (user.chefProfile) {
      return { success: false, error: 'Этот пользователь уже является поваром' };
    }

    // Преобразуем опыт работы в число
    const yearsOfExperience = getYearsOfExperience(experience);

    // Создаем повара с правильными полями из вашей схемы
    const chef = await prisma.chef.create({
      data: {
        userId: parseInt(userId),
        businessName: `${user.firstName}'s Kitchen`,
        description: description || `Профессиональный повар ${user.firstName}, специализирующийся на ${specialty}`,
        specialty: specialty,
        yearsOfExperience: yearsOfExperience,
        isActive: status === 'active',
        isVerified: status === 'active',
        // address: address || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // Обновляем роль пользователя
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role: 'CHEF' }
    });

    // Создаем уведомление о преобразовании пользователя в повара
    await createChefNotification(chef, 'FROM_USER');

    revalidatePath('/admin/chefs');
    
    return { 
      success: true, 
      chef: {
        id: chef.id,
        name: chef.user.firstName,
        email: chef.user.email,
        specialty: chef.specialty,
        status: chef.isActive ? 'active' : 'inactive'
      }
    };
    
  } catch (error) {
    console.error('Error creating chef from user:', error);
    
    // Создаем системное уведомление об ошибке
    await createSystemNotification(
      'Ошибка создания повара из пользователя',
      `Произошла ошибка при создании повара из пользователя: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      'HIGH'
    );
    
    return { 
      success: false, 
      error: 'Ошибка при создании повара из пользователя' 
    };
  }
}

// Вспомогательная функция для преобразования опыта работы
function getYearsOfExperience(experience: string | null): number {
  if (!experience) return 0;
  
  const experienceMap: { [key: string]: number } = {
    'Менее 1 года': 1,
    '1-3 года': 2,
    '3-5 лет': 4,
    '5-10 лет': 7,
    'Более 10 лет': 10
  };
  
  return experienceMap[experience] || 0;
}

// Функция для создания уведомлений о поварах
async function createChefNotification(chef: any, type: 'CREATED' | 'FROM_USER' | 'APPLICATION') {
  try {
    const messages = {
      CREATED: `Создан новый повар: ${chef.user.firstName} (${chef.businessName})`,
      FROM_USER: `Пользователь ${chef.user.firstName} преобразован в повара: ${chef.businessName}`,
      APPLICATION: `Новая заявка на роль повара от ${chef.user.firstName}: ${chef.businessName}`
    };

    const subContexts = {
      CREATED: 'NEW',
      FROM_USER: 'CONVERTED', 
      APPLICATION: 'CHEF_APPLICATION'
    };

    await createContextNotification(
      'USER',
      subContexts[type] as any,
      messages[type],
      chef.id,
      {
        chefId: chef.id,
        businessName: chef.businessName,
        userName: chef.user.firstName,
        userEmail: chef.user.email,
        specialty: chef.specialty,
        actionType: type
      }
    );
  } catch (error) {
    console.error('Error creating chef notification:', error);
  }
}



