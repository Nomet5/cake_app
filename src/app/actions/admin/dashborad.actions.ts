// lib/actions/admin/dashboard.actions.js - ПОЛНАЯ ВЕРСИЯ СО ВСЕМИ ФУНКЦИЯМИ
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

    // === НОВЫЕ ФУНКЦИИ ДЛЯ ГРАФИКОВ ===

    // Выручка по дням за последние 30 дней
    const revenueByDay = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        },
        paymentStatus: 'PAID'
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Заказы по дням за последние 30 дней
    const ordersByDay = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Статистика по пользователям за последние 30 дней
    const usersByDay = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Топ товаров по выручке
    const topProductsByRevenue = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        totalPrice: true,
        quantity: true
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: 10
    })

    // Детальная информация о топ товарах
    const topProductsDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductsByRevenue.map(item => item.productId)
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      }
    })

    // === КОНЕЦ НОВЫХ ФУНКЦИЙ ===

    // Последние пользователи - ИСПРАВЛЕННЫЙ ЗАПРОС (только firstName)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
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
            firstName: true,
            email: true
          }
        },
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true
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
            firstName: true,
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

    // Топ товары по количеству заказов
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

    // Подготовка данных для графиков
    const chartData = {
      revenueByDay: revenueByDay.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        revenue: item._sum.totalAmount || 0
      })),
      ordersByDay: ordersByDay.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        orders: item._count.id
      })),
      usersByDay: usersByDay.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        users: item._count.id
      })),
      topProductsByRevenue: topProductsByRevenue.map(item => {
        const productDetails = topProductsDetails.find(p => p.id === item.productId)
        return {
          productId: item.productId,
          productName: productDetails?.name || 'Неизвестный товар',
          category: productDetails?.category?.name || 'Без категории',
          totalRevenue: item._sum.totalPrice || 0,
          totalQuantity: item._sum.quantity || 0,
          price: productDetails?.price || 0
        }
      }).sort((a, b) => b.totalRevenue - a.totalRevenue)
    }

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
          ordersGrowth: ordersGrowth,
          revenueGrowth: revenueGrowth
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
        // Данные для графиков
        charts: chartData,
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

// === НОВЫЕ ФУНКЦИИ ДЛЯ ГРАФИКОВ ===

// Получить детальную статистику по выручке
export async function getRevenueStats(timeRange = '30d') {
  try {
    let dateFilter = {}
    const now = new Date()
    
    switch (timeRange) {
      case '7d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 7)) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 90)) }
        break
      default:
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
    }

    const revenueStats = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: dateFilter,
        paymentStatus: 'PAID'
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return {
      success: true,
      data: revenueStats.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        revenue: item._sum.totalAmount || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching revenue stats:', error)
    return {
      success: false,
      error: 'Ошибка при получении статистики выручки'
    }
  }
}

// Получить статистику по заказам
export async function getOrdersStats(timeRange = '30d') {
  try {
    let dateFilter = {}
    const now = new Date()
    
    switch (timeRange) {
      case '7d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 7)) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 90)) }
        break
      default:
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
    }

    const ordersStats = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: dateFilter
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return {
      success: true,
      data: ordersStats.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        orders: item._count.id
      }))
    }
  } catch (error) {
    console.error('Error fetching orders stats:', error)
    return {
      success: false,
      error: 'Ошибка при получении статистики заказов'
    }
  }
}

// Получить статистику по пользователям
export async function getUsersStats(timeRange = '30d') {
  try {
    let dateFilter = {}
    const now = new Date()
    
    switch (timeRange) {
      case '7d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 7)) }
        break
      case '30d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
        break
      case '90d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 90)) }
        break
      default:
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) }
    }

    const usersStats = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: dateFilter
      },
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return {
      success: true,
      data: usersStats.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        users: item._count.id
      }))
    }
  } catch (error) {
    console.error('Error fetching users stats:', error)
    return {
      success: false,
      error: 'Ошибка при получении статистики пользователей'
    }
  }
}

// Получить топ товаров по выручке
export async function getTopProductsByRevenue(limit = 10) {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        totalPrice: true,
        quantity: true
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: limit
    })

    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProducts.map(item => item.productId)
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
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

    const result = topProducts.map(item => {
      const product = productDetails.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || 'Неизвестный товар',
        category: product?.category?.name || 'Без категории',
        chef: product?.chef?.businessName || 'Неизвестный повар',
        totalRevenue: item._sum.totalPrice || 0,
        totalQuantity: item._sum.quantity || 0,
        price: product?.price || 0
      }
    })

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error fetching top products:', error)
    return {
      success: false,
      error: 'Ошибка при получении топа товаров'
    }
  }
}

// === СУЩЕСТВУЮЩИЕ ФУНКЦИИ ===

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