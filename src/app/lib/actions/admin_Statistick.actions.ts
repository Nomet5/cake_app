// lib/actions/admin_Statistick.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAdminDashboardStats() {
  try {
    // Основная статистика - убираем platform
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalChefs,
      totalReviews,
      totalAddresses
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.chef.count(),
      prisma.review.count(),
      prisma.address.count()
    ])

    // Статистика по статусам заказов
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Статистика по ценам
    const revenueStats = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
        subtotal: true,
        deliveryFee: true
      },
      _avg: {
        totalAmount: true,
        subtotal: true
      }
    })

    // Статистика по статусам платежей
    const paymentsByStatus = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: {
        id: true
      }
    })

    // Последние данные
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        createdAt: true
      }
    })

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        chef: {
          select: {
            user: {
              select: {
                firstName: true
              }
            }
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            name: true
          }
        }
        // Убираем platform, так как его нет в схеме
      }
    })

    // Популярные категории
    const popularCategories = await prisma.category.findMany({
      take: 5,
      include: {
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

    // Лучшие повара по количеству заказов
    const topChefs = await prisma.chef.findMany({
      take: 5,
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        orders: {
          _count: 'desc'
        }
      }
    })

    // Преобразуем ordersByStatus в обычный объект
    const ordersStatusObj = {}
    ordersByStatus.forEach(item => {
      ordersStatusObj[item.status] = item._count.id
    })

    // Преобразуем paymentsByStatus в обычный объект
    const paymentsStatusObj = {}
    paymentsByStatus.forEach(item => {
      paymentsStatusObj[item.paymentStatus] = item._count.id
    })

    return {
      success: true,
      stats: {
        // Основные счетчики
        totals: {
          users: totalUsers,
          products: totalProducts,
          orders: totalOrders,
          categories: totalCategories,
          chefs: totalChefs,
          reviews: totalReviews,
          addresses: totalAddresses
          // platforms убран, так как нет в схеме
        },
        // Финансовая статистика
        financial: {
          totalRevenue: revenueStats._sum.totalAmount || 0,
          totalSubtotal: revenueStats._sum.subtotal || 0,
          totalDeliveryFee: revenueStats._sum.deliveryFee || 0,
          averageOrderValue: revenueStats._avg.totalAmount || 0,
          averageSubtotal: revenueStats._avg.subtotal || 0
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
          topChefs
        }
      }
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error)
    return { error: 'Ошибка при получении статистики дашборда' }
  }
}