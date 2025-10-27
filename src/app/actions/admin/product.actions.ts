// lib/actions/product.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// CREATE - Создание продукта
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const chefId = parseInt(formData.get("chefId") as string)
    const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined
    const isAvailable = formData.get("isAvailable") === 'true'

    // Валидация данных
    if (!name || !price || !chefId) {
      return { error: 'Название, цена и повар обязательны' }
    }

    if (price <= 0) {
      return { error: 'Цена должна быть больше 0' }
    }

    // Проверяем существование повара
    const chef = await prisma.chef.findUnique({
      where: { id: chefId }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    // Проверяем активен ли повар
    if (!chef.isActive) {
      return { error: 'Повар неактивен' }
    }

    // Проверяем категорию если указана
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })
      if (!category) {
        return { error: 'Категория не найдена' }
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        chefId,
        categoryId,
        isAvailable
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${chefId}`)
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: 'Ошибка при создании товара' }
  }
}

// READ (List) - Получение списка продуктов
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        chef: {
          select: {
            businessName: true,
            user: { 
              select: { 
                firstName: true,
                email: true 
              } 
            }
          }
        },
        category: {
          select: {
            name: true
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        reviews: {
          take: 1
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// READ (Single) - Получение продукта по ID
export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        chef: {
          include: {
            user: {
              select: {
                firstName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
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

// UPDATE - Обновление продукта
export async function updateProduct(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") ? parseFloat(formData.get("price") as string) : undefined
    const chefId = formData.get("chefId") ? parseInt(formData.get("chefId") as string) : undefined
    const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined
    const isAvailable = formData.get("isAvailable") ? formData.get("isAvailable") === 'true' : undefined

    // Валидация цены
    if (price !== undefined && price <= 0) {
      return { error: 'Цена должна быть больше 0' }
    }

    // Проверяем существование продукта
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return { error: 'Товар не найден' }
    }

    // Проверяем повара если указан
    if (chefId) {
      const chef = await prisma.chef.findUnique({
        where: { id: chefId }
      })
      if (!chef) {
        return { error: 'Повар не найден' }
      }
      if (!chef.isActive) {
        return { error: 'Повар неактивен' }
      }
    }

    // Проверяем категорию если указана
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })
      if (!category) {
        return { error: 'Категория не найдена' }
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price }),
      ...(chefId && { chefId }),
      ...(categoryId && { categoryId }),
      ...(isAvailable !== undefined && { isAvailable }),
      updatedAt: new Date()
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        chef: {
          select: {
            businessName: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: 'Ошибка при обновлении товара' }
  }
}

// DELETE - Удаление продукта
export async function deleteProduct(id: number) {
  try {
    // Проверяем существует ли продукт
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        reviews: true,
        cartItems: true,
        images: true
      }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    // Нельзя удалить продукт с заказами, отзывами или в корзинах
    const hasOrderItems = product.orderItems.length > 0
    const hasReviews = product.reviews.length > 0
    const hasCartItems = product.cartItems.length > 0
    const hasImages = product.images.length > 0

    if (hasOrderItems || hasReviews || hasCartItems || hasImages) {
      let errorMessage = 'Нельзя удалить товар с '
      const reasons = []
      if (hasOrderItems) reasons.push('историей заказов')
      if (hasReviews) reasons.push('отзывами')
      if (hasCartItems) reasons.push('товарами в корзинах')
      if (hasImages) reasons.push('изображениями')
      errorMessage += reasons.join(', ')
      
      return { error: errorMessage }
    }

    // Удаляем продукт
    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, message: 'Товар успешно удален' }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Ошибка при удалении товара' }
  }
}

// TOGGLE AVAILABLE - Переключение доступности продукта
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
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error('Error toggling product available:', error)
    return { error: 'Ошибка при изменении доступности товара' }
  }
}

// UPDATE PRODUCT STATUS - Обновление статуса продукта
export async function updateProductStatus(id: number, isAvailable: boolean) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        isAvailable,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product status:', error)
    return { error: 'Ошибка при обновлении статуса товара' }
  }
}

// GET PRODUCTS BY CHEF - Продукты конкретного повара
export async function getProductsByChef(chefId: number) {
  try {
    const products = await prisma.product.findMany({
      where: { chefId },
      include: {
        category: {
          select: {
            name: true
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        reviews: {
          take: 1
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products || []
  } catch (error) {
    console.error('Error fetching chef products:', error)
    return []
  }
}

// GET PRODUCTS BY CATEGORY - Продукты по категории
export async function getProductsByCategory(categoryId: number) {
  try {
    const products = await prisma.product.findMany({
      where: { 
        categoryId,
        isAvailable: true 
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        reviews: {
          take: 1
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products || []
  } catch (error) {
    console.error('Error fetching category products:', error)
    return []
  }
}

// GET AVAILABLE PRODUCTS - Доступные продукты
export async function getAvailableProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isAvailable: true 
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        },
        category: {
          select: {
            name: true
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        reviews: {
          take: 1
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products || []
  } catch (error) {
    console.error('Error fetching available products:', error)
    return []
  }
}

// GET POPULAR PRODUCTS - Популярные продукты
export async function getPopularProducts(limit: number = 10) {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isAvailable: true 
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true
          }
        }
      },
      orderBy: [
        {
          orderItems: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ],
      take: limit
    })

    return products || []
  } catch (error) {
    console.error('Error fetching popular products:', error)
    return []
  }
}

// GET PRODUCT STATS - Статистика по продуктам
export async function getProductStats() {
  try {
    const [
      totalProducts,
      availableProducts,
      unavailableProducts,
      productsWithOrders,
      averagePrice,
      totalRevenue
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ 
        where: { 
          isAvailable: true 
        } 
      }),
      prisma.product.count({ 
        where: { 
          isAvailable: false 
        } 
      }),
      prisma.product.count({
        where: {
          orderItems: {
            some: {}
          }
        }
      }),
      prisma.product.aggregate({
        _avg: {
          price: true
        }
      }),
      prisma.orderItem.aggregate({
        _sum: {
          totalPrice: true
        }
      })
    ])

    return {
      total: totalProducts,
      available: availableProducts,
      unavailable: unavailableProducts,
      withOrders: productsWithOrders,
      averagePrice: averagePrice._avg.price || 0,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    }
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return {
      total: 0,
      available: 0,
      unavailable: 0,
      withOrders: 0,
      averagePrice: 0,
      totalRevenue: 0
    }
  }
}

// SEARCH PRODUCTS - Поиск продуктов
export async function searchProducts(query: string, categoryId?: number, chefId?: number) {
  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } }
            ]
          },
          { isAvailable: true },
          ...(categoryId ? [{ categoryId }] : []),
          ...(chefId ? [{ chefId }] : [])
        ]
      },
      include: {
        chef: {
          select: {
            businessName: true,
            user: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        },
        category: {
          select: {
            name: true
          }
        },
        images: {
          take: 1,
          where: { isPrimary: true }
        },
        reviews: {
          take: 1
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return products || []
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// ADD PRODUCT IMAGE - Добавление изображения продукта
export async function addProductImage(productId: number, imageUrl: string, isPrimary: boolean = false) {
  try {
    // Проверяем существование продукта
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    // Если это основное изображение, снимаем флаг с других
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false }
      })
    }

    const productImage = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary
      }
    })

    revalidatePath(`/admin/products/${productId}`)
    revalidatePath('/products')
    return { success: true, image: productImage }
  } catch (error) {
    console.error('Error adding product image:', error)
    return { error: 'Ошибка при добавлении изображения товара' }
  }
}

// REMOVE PRODUCT IMAGE - Удаление изображения продукта
export async function removeProductImage(imageId: number) {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId }
    })

    if (!image) {
      return { error: 'Изображение не найдено' }
    }

    await prisma.productImage.delete({
      where: { id: imageId }
    })

    revalidatePath(`/admin/products/${image.productId}`)
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    console.error('Error removing product image:', error)
    return { error: 'Ошибка при удалении изображения товара' }
  }
}

// SET PRIMARY IMAGE - Установка основного изображения
export async function setPrimaryProductImage(productId: number, imageId: number) {
  try {
    // Снимаем флаг со всех изображений продукта
    await prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false }
    })

    // Устанавливаем флаг для выбранного изображения
    const primaryImage = await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true }
    })

    revalidatePath(`/admin/products/${productId}`)
    revalidatePath('/products')
    return { success: true, image: primaryImage }
  } catch (error) {
    console.error('Error setting primary product image:', error)
    return { error: 'Ошибка при установке основного изображения' }
  }
}

// BULK UPDATE PRODUCTS - Массовое обновление продуктов
export async function bulkUpdateProducts(productIds: number[], isAvailable: boolean) {
  try {
    const result = await prisma.product.updateMany({
      where: {
        id: {
          in: productIds
        }
      },
      data: {
        isAvailable,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating products:', error)
    return { error: 'Ошибка при массовом обновлении товаров' }
  }
}

// GET PRODUCTS WITH LOW STOCK - Продукты с низкой доступностью (для будущего использования)
export async function getProductsWithLowStock(threshold: number = 5) {
  try {
    // Эта функция может быть полезна когда добавите поле stockQuantity
    const products = await prisma.product.findMany({
      where: { 
        isAvailable: true
        // Добавьте условие когда появится поле stockQuantity:
        // stockQuantity: { lte: threshold }
      },
      include: {
        chef: {
          select: {
            businessName: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { 
        // stockQuantity: 'asc' 
        createdAt: 'desc'
      }
    })

    return products || []
  } catch (error) {
    console.error('Error fetching products with low stock:', error)
    return []
  }
}