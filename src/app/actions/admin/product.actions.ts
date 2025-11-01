// lib/actions/product.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { 
  createSystemNotification,
  createNewReviewNotification 
} from './notification.actions'

// Используем глобальный инстанс Prisma для лучшей производительности
const prisma = new PrismaClient()

// Типы для лучшей типобезопасности
interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  chefId: number;
  categoryId?: number;
  isAvailable?: boolean;
}

// Вспомогательная функция для валидации
function validateProductData(data: Partial<CreateProductData>) {
  const errors: string[] = [];
  
  if (!data.name?.trim()) errors.push('Название обязательно');
  if (!data.price || data.price <= 0) errors.push('Цена должна быть больше 0');
  if (!data.chefId) errors.push('Повар обязателен');
  
  return errors;
}

// CREATE - Создание продукта (улучшенная версия)
export async function createProduct(formData: FormData) {
  try {
    const productData: CreateProductData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      chefId: parseInt(formData.get("chefId") as string),
      categoryId: formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined,
      isAvailable: formData.get("isAvailable") === 'true'
    };

    // Валидация
    const validationErrors = validateProductData(productData);
    if (validationErrors.length > 0) {
      return { error: validationErrors.join(', ') };
    }

    // Проверяем существование повара
    const chef = await prisma.chef.findUnique({
      where: { id: productData.chefId },
      include: { user: { select: { firstName: true, email: true } } }
    });

    if (!chef) {
      return { error: 'Повар не найден' };
    }

    if (!chef.isActive) {
      return { error: 'Повар неактивен' };
    }

    // Проверяем категорию если указана
    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId }
      });
      if (!category) {
        return { error: 'Категория не найдена' };
      }
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        chef: {
          select: {
            businessName: true,
            user: { select: { firstName: true, email: true } }
          }
        },
        category: { select: { name: true } }
      }
    });

    // Уведомление
    await createSystemNotification(
      'Новый продукт',
      `Повар "${chef.businessName}" добавил новый продукт: "${productData.name}" за ${productData.price} ₽`,
      'MEDIUM'
    );

    // Ревалидация путей
    revalidatePath('/admin/products');
    revalidatePath(`/admin/chefs/${productData.chefId}`);
    revalidatePath('/products');
    
    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    await createSystemNotification(
      'Ошибка создания продукта',
      `Произошла ошибка при создании продукта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      'HIGH'
    );
    return { error: 'Ошибка при создании товара' };
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
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
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

    // Создаем уведомление об обновлении продукта
    if (name && name !== existingProduct.name) {
      await createSystemNotification(
        'Продукт обновлен',
        `Продукт "${existingProduct.name}" был переименован в "${name}"`,
        'LOW'
      )
    }

    if (price !== undefined && price !== existingProduct.price) {
      await createSystemNotification(
        'Изменение цены продукта',
        `Цена продукта "${product.name}" изменена с ${existingProduct.price} ₽ на ${price} ₽`,
        'MEDIUM'
      )
    }

    if (isAvailable !== undefined && isAvailable !== existingProduct.isAvailable) {
      await createSystemNotification(
        'Изменение доступности продукта',
        `Продукт "${product.name}" теперь ${isAvailable ? 'доступен' : 'недоступен'} для заказа`,
        'MEDIUM'
      )
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, product }
  } catch (error) {
    console.error('Error updating product:', error)
    await createSystemNotification(
      'Ошибка обновления продукта',
      `Произошла ошибка при обновлении продукта: ${error}`,
      'HIGH'
    )
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
        images: true,
        chef: {
          select: {
            businessName: true
          }
        }
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

    // Создаем уведомление об удалении продукта
    await createSystemNotification(
      'Продукт удален',
      `Продукт "${product.name}" от повара "${product.chef.businessName}" был удален`,
      'MEDIUM'
    )

    revalidatePath('/admin/products')
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, message: 'Товар успешно удален' }
  } catch (error) {
    console.error('Error deleting product:', error)
    await createSystemNotification(
      'Ошибка удаления продукта',
      `Произошла ошибка при удалении продукта: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при удалении товара' }
  }
}

// TOGGLE AVAILABLE - Переключение доступности продукта
export async function toggleProductAvailable(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
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

    // Создаем уведомление об изменении доступности
    await createSystemNotification(
      'Изменение доступности продукта',
      `Продукт "${product.name}" теперь ${updatedProduct.isAvailable ? 'доступен' : 'недоступен'} для заказа`,
      'MEDIUM'
    )

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${product.chefId}`)
    revalidatePath('/products')
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error('Error toggling product available:', error)
    await createSystemNotification(
      'Ошибка изменения доступности продукта',
      `Произошла ошибка при изменении доступности продукта: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при изменении доступности товара' }
  }
}

// UPDATE PRODUCT STATUS - Обновление статуса продукта
export async function updateProductStatus(id: number, isAvailable: boolean) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isAvailable,
        updatedAt: new Date()
      }
    })

    // Создаем уведомление об изменении статуса
    if (product.isAvailable !== isAvailable) {
      await createSystemNotification(
        'Изменение статуса продукта',
        `Продукт "${product.name}" теперь ${isAvailable ? 'доступен' : 'недоступен'} для заказа`,
        'MEDIUM'
      )
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/chefs/${updatedProduct.chefId}`)
    revalidatePath('/products')
    return { success: true, product: updatedProduct }
  } catch (error) {
    console.error('Error updating product status:', error)
    await createSystemNotification(
      'Ошибка обновления статуса продукта',
      `Произошла ошибка при обновлении статуса продукта: ${error}`,
      'HIGH'
    )
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
      where: { id: productId },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
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

    // Создаем уведомление о добавлении изображения
    if (isPrimary) {
      await createSystemNotification(
        'Добавлено основное изображение',
        `Для продукта "${product.name}" установлено новое основное изображение`,
        'LOW'
      )
    }

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
      where: { id: imageId },
      include: {
        product: {
          select: {
            name: true,
            chef: {
              select: {
                businessName: true
              }
            }
          }
        }
      }
    })

    if (!image) {
      return { error: 'Изображение не найдено' }
    }

    await prisma.productImage.delete({
      where: { id: imageId }
    })

    // Создаем уведомление об удалении изображения
    await createSystemNotification(
      'Удалено изображение продукта',
      `Удалено изображение продукта "${image.product.name}"`,
      'LOW'
    )

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
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true
      }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

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

    // Создаем уведомление об изменении основного изображения
    await createSystemNotification(
      'Изменено основное изображение',
      `Для продукта "${product.name}" изменено основное изображение`,
      'LOW'
    )

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

    // Создаем уведомление о массовом обновлении
    await createSystemNotification(
      'Массовое обновление продуктов',
      `Изменена доступность для ${result.count} продуктов: теперь они ${isAvailable ? 'доступны' : 'недоступны'} для заказа`,
      'MEDIUM'
    )

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true, updatedCount: result.count }
  } catch (error) {
    console.error('Error bulk updating products:', error)
    await createSystemNotification(
      'Ошибка массового обновления продуктов',
      `Произошла ошибка при массовом обновлении продуктов: ${error}`,
      'HIGH'
    )
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

// CREATE PRODUCT REVIEW - Создание отзыва для продукта (исправленная под вашу схему)
export async function createProductReview(
  productId: number, 
  userId: number, 
  orderId: number, 
  chefId: number, 
  rating: number, 
  comment?: string
) {
  try {
    // Проверяем существование продукта
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    if (!product) {
      return { error: 'Товар не найден' }
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем существование заказа
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return { error: 'Заказ не найден' }
    }

    // Проверяем существование повара
    const chef = await prisma.chef.findUnique({
      where: { id: chefId }
    })

    if (!chef) {
      return { error: 'Повар не найден' }
    }

    // Проверяем, оставлял ли пользователь уже отзыв на этот продукт в этом заказе
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
        orderId
      }
    })

    if (existingReview) {
      return { error: 'Вы уже оставляли отзыв на этот товар в данном заказе' }
    }

    // Создаем отзыв с учетом всех обязательных полей
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        orderId,
        userId,
        chefId,
        productId
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        product: {
          select: {
            name: true
          }
        },
        order: {
          select: {
            orderNumber: true
          }
        },
        chef: {
          select: {
            businessName: true
          }
        }
      }
    })

    // Создаем уведомление о новом отзыве
    await createNewReviewNotification(review)

    revalidatePath(`/products/${productId}`)
    revalidatePath('/admin/reviews')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true, review }
  } catch (error) {
    console.error('Error creating product review:', error)
    return { error: 'Ошибка при создании отзыва' }
  }
}

// GET PRODUCT REVIEWS - Получение отзывов для продукта
export async function getProductReviews(productId: number) {
  try {
    const reviews = await prisma.review.findMany({
      where: { 
        productId,
        isApproved: true 
      },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        order: {
          select: {
            orderNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return reviews || []
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return []
  }
}

// APPROVE REVIEW - Одобрение отзыва
export async function approveReview(reviewId: number) {
  try {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      }
    })

    // Создаем уведомление об одобрении отзыва
    await createSystemNotification(
      'Отзыв одобрен',
      `Отзыв пользователя ${review.user.firstName} на продукт "${review.product?.name}" был одобрен`,
      'LOW'
    )

    revalidatePath('/admin/reviews')
    revalidatePath(`/products/${review.productId}`)
    return { success: true, review }
  } catch (error) {
    console.error('Error approving review:', error)
    return { error: 'Ошибка при одобрении отзыва' }
  }
}

// REJECT REVIEW - Отклонение отзыва
export async function rejectReview(reviewId: number) {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            firstName: true,
            email: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      }
    })

    if (!review) {
      return { error: 'Отзыв не найден' }
    }

    await prisma.review.delete({
      where: { id: reviewId }
    })

    // Создаем уведомление об отклонении отзыва
    await createSystemNotification(
      'Отзыв отклонен',
      `Отзыв пользователя ${review.user.firstName} на продукт "${review.product?.name}" был отклонен и удален`,
      'LOW'
    )

    revalidatePath('/admin/reviews')
    revalidatePath(`/products/${review.productId}`)
    return { success: true, message: 'Отзыв отклонен и удален' }
  } catch (error) {
    console.error('Error rejecting review:', error)
    return { error: 'Ошибка при отклонении отзыва' }
  }
}

// GET REVIEW STATS - Статистика по отзывам
export async function getReviewStats() {
  try {
    const [
      totalReviews,
      approvedReviews,
      pendingReviews,
      averageRating
    ] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ 
        where: { 
          isApproved: true 
        } 
      }),
      prisma.review.count({ 
        where: { 
          isApproved: false 
        } 
      }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ])

    return {
      total: totalReviews,
      approved: approvedReviews,
      pending: pendingReviews,
      averageRating: averageRating._avg.rating || 0
    }
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return {
      total: 0,
      approved: 0,
      pending: 0,
      averageRating: 0
    }
  }
}