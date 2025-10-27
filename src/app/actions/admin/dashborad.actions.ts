// lib/actions/admin/dashboard.actions.js
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Основная статистика дашборда
export async function getAdminDashboardStats() {
  try {
    // Основные счетчики
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalChefs,
      totalReviews,
      todayOrders,
      yesterdayOrders,
      weeklyOrders,
      monthlyOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.chef.count(),
      prisma.review.count(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 1)),
            lt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      })
    ])

    // Статистика по статусам заказов
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Финансовая статистика
    const revenueStats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
        subtotal: true,
        deliveryFee: true
      },
      _avg: {
        totalAmount: true,
        subtotal: true
      },
      where: {
        paymentStatus: 'PAID'
      }
    })

    // Статистика по статусам платежей
    const paymentsByStatus = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: {
        id: true
      }
    })

    // Сегодняшняя выручка
    const todayRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        },
        paymentStatus: 'PAID'
      }
    })

    // Вчерашняя выручка
    const yesterdayRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
          lt: new Date(new Date().setHours(0, 0, 0, 0))
        },
        paymentStatus: 'PAID'
      }
    })

    // Последние пользователи - ИСПРАВЛЕННЫЙ ЗАПРОС (только firstName)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true, // Только firstName, без lastName
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    // Последние заказы - ИСПРАВЛЕННЫЙ ЗАПРОС
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        subtotal: true,
        deliveryFee: true,
        createdAt: true,
        user: {
          select: {
            firstName: true, // Только firstName
            email: true
          }
        },
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true // Только firstName
              }
            }
          }
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      }
    })

    // Последние товары
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        isAvailable: true,
        createdAt: true,
        category: {
          select: {
            name: true
          }
        },
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    // Популярные категории
    const popularCategories = await prisma.category.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      }
    })

    // Лучшие повара - ИСПРАВЛЕННЫЙ ЗАПРОС
    const topChefs = await prisma.chef.findMany({
      take: 5,
      select: {
        id: true,
        businessName: true,
        isVerified: true,
        user: {
          select: {
            firstName: true, // Только firstName
            email: true
          }
        },
        _count: {
          select: {
            orders: true,
            products: true
          }
        }
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      }
    })

    // Топ товары
    const topProducts = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        _count: {
          select: {
            orderItems: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      }
    })

    // Дополнительная статистика
    const activeProducts = await prisma.product.count({
      where: { isAvailable: true }
    })

    const activeChefs = await prisma.chef.count({
      where: { isActive: true }
    })

    const verifiedChefs = await prisma.chef.count({
      where: { isVerified: true }
    })

    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' }
    })

    // Преобразуем в объекты
    const ordersStatusObj = {}
    ordersByStatus.forEach(item => {
      ordersStatusObj[item.status] = item._count.id
    })

    const paymentsStatusObj = {}
    paymentsByStatus.forEach(item => {
      paymentsStatusObj[item.paymentStatus] = item._count.id
    })

    // Расчет роста
    const ordersGrowth = yesterdayOrders > 0 
      ? Number(((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1))
      : todayOrders > 0 ? 100 : 0

    const revenueGrowth = (yesterdayRevenue._sum.totalAmount || 0) > 0
      ? Number((((todayRevenue._sum.totalAmount || 0) - (yesterdayRevenue._sum.totalAmount || 0)) / (yesterdayRevenue._sum.totalAmount || 0) * 100).toFixed(1))
      : (todayRevenue._sum.totalAmount || 0) > 0 ? 100 : 0

    return {
      success: true,
      stats: {
        // Основные счетчики
        totals: {
          users: totalUsers,
          products: totalProducts,
          activeProducts,
          orders: totalOrders,
          categories: totalCategories,
          chefs: totalChefs,
          activeChefs,
          verifiedChefs,
          reviews: totalReviews,
          pendingOrders
        },
        // Периодическая статистика
        periodStats: {
          today: todayOrders,
          yesterday: yesterdayOrders,
          weekly: weeklyOrders,
          monthly: monthlyOrders,
          ordersGrowth: ordersGrowth, // Теперь это число, а не строка
          revenueGrowth: revenueGrowth // Теперь это число, а не строка
        },
        // Финансовая статистика
        financial: {
          totalRevenue: revenueStats._sum.totalAmount || 0,
          totalSubtotal: revenueStats._sum.subtotal || 0,
          totalDeliveryFee: revenueStats._sum.deliveryFee || 0,
          averageOrderValue: revenueStats._avg.totalAmount || 0,
          averageSubtotal: revenueStats._avg.subtotal || 0,
          todayRevenue: todayRevenue._sum.totalAmount || 0,
          yesterdayRevenue: yesterdayRevenue._sum.totalAmount || 0
        },
        // Статусы
        ordersByStatus: ordersStatusObj,
        paymentsByStatus: paymentsStatusObj,
        // Последние данные
        recent: {
          users: recentUsers,
          orders: recentOrders,
          products: recentProducts
        },
        // Аналитика
        analytics: {
          popularCategories,
          topChefs,
          topProducts
        }
      }
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return { 
      success: false,
      error: 'Ошибка при получении статистики дашборда',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Упрощенная версия для тестирования
export async function getSimpleDashboardStats() {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalChefs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.chef.count()
    ])

    return {
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          products: totalProducts,
          orders: totalOrders,
          chefs: totalChefs
        }
      }
    }
  } catch (error) {
    console.error('Error fetching simple dashboard stats:', error)
    return { 
      success: false,
      error: 'Ошибка при получении статистики'
    }
  }
}

// Быстрые действия
export async function updateOrderStatus(orderId, status) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/orders')

    return {
      success: true,
      message: `Статус заказа #${orderId} обновлен`,
      order: updatedOrder
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { 
      success: false,
      error: 'Ошибка при обновлении статуса заказа'
    }
  }
}

export async function toggleProductAvailability(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isAvailable: !product.isAvailable }
    })

    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/products')

    return {
      success: true,
      message: `Товар "${product.name}" ${updatedProduct.isAvailable ? 'активирован' : 'деактивирован'}`,
      product: updatedProduct
    }
  } catch (error) {
    console.error('Error toggling product availability:', error)
    return { 
      success: false,
      error: 'Ошибка при изменении статуса товара'
    }
  }
}