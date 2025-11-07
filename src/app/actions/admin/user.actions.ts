// lib/actions/user.actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { 
  createNewUserNotification,
  createSystemNotification 
} from './notification.actions'

interface ActionState {
  success: boolean;
  error?: string;
  message?: string;
  userId?: number;
}

const prisma = new PrismaClient()

// READ (List) - возвращает массив пользователей
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        chefProfile: { // Включаем сам профиль повара вместо подсчета
          select: {
            id: true
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// CREATE - исправленная версия
export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    console.log('🔧 Creating user with:', { 
      firstName: firstName?.substring(0, 10) + '...', 
      email: email?.substring(0, 10) + '...',
      phone: phone || 'не указан' 
    });

    // Валидация данных
    if (!firstName?.trim()) {
      const error = 'Имя обязательно для заполнения';
      console.error('❌ Validation error:', error);
      return { 
        success: false, 
        error 
      };
    }

    if (!email?.trim()) {
      const error = 'Email обязателен для заполнения';
      console.error('❌ Validation error:', error);
      return { 
        success: false, 
        error 
      };
    }

    if (!password?.trim()) {
      const error = 'Пароль обязателен для заполнения';
      console.error('❌ Validation error:', error);
      return { 
        success: false, 
        error 
      };
    }

    if (password.length < 6) {
      const error = 'Пароль должен содержать минимум 6 символов';
      console.error('❌ Validation error:', error);
      return { 
        success: false, 
        error 
      };
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      const error = 'Пользователь с таким email уже существует';
      console.error('❌ User exists error:', error, { email: email.trim().toLowerCase() });
      return { 
        success: false, 
        error 
      };
    }

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: await hashPassword(password),
        phone: phone?.trim() || null
      }
    });

    // Создаем уведомление о новом пользователе
    await createNewUserNotification(user);

    revalidatePath('/admin/users');
    
    console.log('✅ User created successfully:', { 
      userId: user.id,
      email: user.email 
    });
    
    // Возвращаем успешный результат
    return { 
      success: true, 
      message: 'Пользователь успешно создан',
      userId: user.id 
    };
    
  } catch (error: unknown) {
    // Правильно обрабатываем ошибку
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Неизвестная ошибка при создании пользователя';
    
    console.error('❌ Database error creating user:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Создаем системное уведомление об ошибке
    await createSystemNotification(
      'Ошибка создания пользователя',
      `Произошла ошибка при создании пользователя: ${errorMessage}`,
      'HIGH'
    );
    
    return { 
      success: false, 
      error: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
      message: errorMessage
    };
  }
}

// Функция для хеширования пароля (добавьте эту функцию)
async function hashPassword(password: string): Promise<string> {
  // В реальном приложении используйте bcrypt или аналогичную библиотеку
  // Это временное решение для демонстрации
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// DELETE
export async function deleteUser(id: number) {
  try {
    // Проверяем есть ли связанные данные
    const userData = await prisma.user.findUnique({
      where: { id },
      include: {
        chefProfile: true, // Включаем профиль повара напрямую
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    if (!userData) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем есть ли заказы или профиль повара
    const hasOrders = userData._count.orders > 0
    const hasChefProfile = userData.chefProfile !== null // Проверяем наличие профиля

    if (hasOrders || hasChefProfile) {
      let errorMessage = 'Нельзя удалить пользователя с '
      const reasons = []
      if (hasOrders) reasons.push('активными заказами')
      if (hasChefProfile) reasons.push('профилем повара')
      errorMessage += reasons.join(' или ')
      
      return { error: errorMessage }
    }

    await prisma.user.delete({
      where: { id }
    })

    // Создаем уведомление об удалении пользователя
    await createSystemNotification(
      'Пользователь удален',
      `Пользователь ${userData.firstName} (${userData.email}) был удален из системы`,
      'MEDIUM'
    )

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    await createSystemNotification(
      'Ошибка удаления пользователя',
      `Произошла ошибка при удалении пользователя: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при удалении пользователя' }
  }
}

// GET USER BY ID - ИСПРАВЛЕННАЯ ВЕРСИЯ
export async function getUserById(id: number | string) {
  try {
    // Конвертируем id в число
    const userId = typeof id === 'string' ? parseInt(id) : id
    
    // Проверяем валидность ID
    if (isNaN(userId) || userId <= 0) {
      return { error: 'Неверный идентификатор пользователя' }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        chefProfile: true,
        orders: {
          include: {
            chef: true,
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { error: 'Ошибка при получении пользователя' }
  }
}

// UPDATE USER
export async function updateUser(id: number, data: { firstName: string; email: string; phone?: string }) {
  try {
    const { firstName, email, phone } = data;

    // Валидация
    if (!firstName?.trim()) {
      return { error: 'Имя обязательно для заполнения' }
    }

    if (!email?.trim()) {
      return { error: 'Email обязателен для заполнения' }
    }

    // Получаем текущего пользователя для сравнения
    const currentUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!currentUser) {
      return { error: 'Пользователь не найден' }
    }

    // Проверяем email на уникальность
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        id: { not: id }
      }
    })

    if (existingUser) {
      return { error: 'Пользователь с таким email уже существует' }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        updatedAt: new Date()
      }
    })

    // Создаем уведомления об изменениях
    if (firstName !== currentUser.firstName) {
      await createSystemNotification(
        'Изменено имя пользователя',
        `Пользователь ${currentUser.firstName} переименован в ${firstName}`,
        'LOW'
      )
    }

    if (email !== currentUser.email) {
      await createSystemNotification(
        'Изменен email пользователя',
        `Email пользователя ${user.firstName} изменен с ${currentUser.email} на ${email}`,
        'MEDIUM'
      )
    }

    if (phone !== currentUser.phone) {
      await createSystemNotification(
        'Изменен телефон пользователя',
        `Телефон пользователя ${user.firstName} был обновлен`,
        'LOW'
      )
    }

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${id}`)
    return { success: true, user }
  } catch (error) {
    console.error('Error updating user:', error)
    await createSystemNotification(
      'Ошибка обновления пользователя',
      `Произошла ошибка при обновлении пользователя: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при обновлении пользователя' }
  }
}

// UPDATE USER PASSWORD - Обновление пароля пользователя
export async function updateUserPassword(id: number, newPassword: string) {
  try {
    if (!newPassword?.trim()) {
      return { error: 'Пароль обязателен для заполнения' }
    }

    if (newPassword.length < 6) {
      return { error: 'Пароль должен содержать минимум 6 символов' }
    }

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    await prisma.user.update({
      where: { id },
      data: {
        passwordHash: await hashPassword(newPassword),
        updatedAt: new Date()
      }
    })

    // Создаем уведомление об изменении пароля
    await createSystemNotification(
      'Пароль пользователя изменен',
      `Пароль пользователя ${user.firstName} был изменен администратором`,
      'MEDIUM'
    )

    revalidatePath(`/admin/users/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating user password:', error)
    await createSystemNotification(
      'Ошибка изменения пароля пользователя',
      `Произошла ошибка при изменении пароля пользователя: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при изменении пароля пользователя' }
  }
}

// TOGGLE USER ACTIVE - Переключение статуса пользователя (если добавите поле isActive)
export async function toggleUserActive(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return { error: 'Пользователь не найден' }
    }

    // Если в модели User нет поля isActive, нужно его добавить
    // const updatedUser = await prisma.user.update({
    //   where: { id },
    //   data: {
    //     isActive: !user.isActive
    //   }
    // })

    // Создаем уведомление об изменении статуса
    // await createSystemNotification(
    //   'Изменен статус пользователя',
    //   `Пользователь ${user.firstName} теперь ${updatedUser.isActive ? 'активен' : 'неактивен'}`,
    //   'MEDIUM'
    // )

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${id}`)
    // return { success: true, user: updatedUser }
    return { error: 'Функция временно недоступна - добавьте поле isActive в модель User' }
  } catch (error) {
    console.error('Error toggling user active:', error)
    await createSystemNotification(
      'Ошибка изменения статуса пользователя',
      `Произошла ошибка при изменении статуса пользователя: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при изменении статуса пользователя' }
  }
}

// GET USER STATS - Статистика по пользователям
export async function getUserStats() {
  try {
    const [
      totalUsers,
      usersWithOrders,
      usersWithChefProfile,
      newUsersToday,
      averageOrdersPerUser
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          orders: {
            some: {}
          }
        }
      }),
      prisma.user.count({
        where: {
          chefProfile: {
            isNot: null
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.order.aggregate({
        _avg: {
          userId: true
        }
      })
    ])

    // Создаем уведомление о новых пользователях сегодня
    if (newUsersToday > 0) {
      await createSystemNotification(
        'Новые пользователи сегодня',
        `Зарегистрировано ${newUsersToday} новых пользователей за сегодня`,
        'LOW'
      )
    }

    return {
      total: totalUsers,
      withOrders: usersWithOrders,
      withChefProfile: usersWithChefProfile,
      newToday: newUsersToday,
      averageOrders: averageOrdersPerUser._avg.userId || 0
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      total: 0,
      withOrders: 0,
      withChefProfile: 0,
      newToday: 0,
      averageOrders: 0
    }
  }
}

// SEARCH USERS - Поиск пользователей
export async function searchUsers(query: string, limit: number = 20) {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Фильтруем результаты на стороне JavaScript для case-insensitive поиска
    const filteredUsers = users.filter(user => 
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      (user.phone && user.phone.toLowerCase().includes(query.toLowerCase()))
    )

    return filteredUsers || []
  } catch (error) {
    console.error('Error searching users:', error)
    return []
  }
}

// BULK DELETE USERS - Массовое удаление пользователей
export async function bulkDeleteUsers(userIds: number[]) {
  try {
    // Проверяем можно ли удалить пользователей
    const usersToDelete = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      include: {
        _count: {
          select: {
            orders: true
          }
        },
        chefProfile: true
      }
    })

    // Проверяем есть ли пользователи с заказами или профилями поваров
    const usersWithRestrictions = usersToDelete.filter(user => 
      user._count.orders > 0 || user.chefProfile !== null
    )

    if (usersWithRestrictions.length > 0) {
      const userNames = usersWithRestrictions.map(u => u.firstName).join(', ')
      return { error: `Нельзя удалить пользователей с заказами или профилями поваров: ${userNames}` }
    }

    const result = await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    })

    // Создаем уведомление о массовом удалении
    await createSystemNotification(
      'Массовое удаление пользователей',
      `Удалено ${result.count} пользователей`,
      'MEDIUM'
    )

    revalidatePath('/admin/users')
    return { success: true, deletedCount: result.count }
  } catch (error) {
    console.error('Error bulk deleting users:', error)
    await createSystemNotification(
      'Ошибка массового удаления пользователей',
      `Произошла ошибка при массовом удалении пользователей: ${error}`,
      'HIGH'
    )
    return { error: 'Ошибка при массовом удалении пользователей' }
  }
}