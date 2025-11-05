// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { fakerRU as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начало заполнения базы данных тестовыми данными...')

  // 1. Создаем категории (10 штук)
  console.log('📂 Создание категорий...')
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Торты праздничные', isActive: true, sortOrder: 1 },
      { name: 'Пироги домашние', isActive: true, sortOrder: 2 },
      { name: 'Десерты изысканные', isActive: true, sortOrder: 3 },
      { name: 'Печенье ароматное', isActive: true, sortOrder: 4 },
      { name: 'Хлеб деревенский', isActive: true, sortOrder: 5 },
      { name: 'Пирожные французские', isActive: true, sortOrder: 6 },
      { name: 'Чизкейки нежные', isActive: true, sortOrder: 7 },
      { name: 'Макаруны цветные', isActive: true, sortOrder: 8 },
      { name: 'Кексы праздничные', isActive: true, sortOrder: 9 },
      { name: 'Мороженое фруктовое', isActive: true, sortOrder: 10 }
    ]
  })

  // 2. Создаем пользователей (10 штук - 5 поваров + 5 клиентов)
  console.log('👥 Создание пользователей...')
  const users = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const isChef = i < 5
      return await prisma.user.create({
        data: {
          email: isChef ? `chef${i+1}@cakeapp.ru` : `customer${i+1}@cakeapp.ru`,
          firstName: faker.person.firstName(),
          passwordHash: '$2b$10$exampleHashForTesting123456789', // тестовый хеш
          phone: faker.phone.number(),
          role: isChef ? 'CHEF' : 'CUSTOMER',
        }
      })
    })
  )

  const chefs = users.slice(0, 5)
  const customers = users.slice(5, 10)

  // 3. Создаем поваров (5 штук)
  console.log('👨‍🍳 Создание поваров...')
  const chefProfiles = await Promise.all(
    chefs.map(async (chef, index) => {
      return await prisma.chef.create({
        data: {
          userId: chef.id,
          businessName: faker.company.name() + ' Кондитерская',
          description: faker.lorem.paragraph(),
          isActive: faker.datatype.boolean({ probability: 0.8 }),
          isVerified: faker.datatype.boolean({ probability: 0.7 }),
          specialty: faker.commerce.department(),
          yearsOfExperience: faker.number.int({ min: 1, max: 20 })
        }
      })
    })
  )

  // 4. Создаем адреса пользователей (10 штук)
  console.log('🏠 Создание адресов...')
  const addresses = await Promise.all(
    users.map(async (user) => {
      return await prisma.address.create({
        data: {
          userId: user.id,
          addressLine1: faker.location.streetAddress(),
          city: faker.location.city(),
          country: 'Russia',
          isPrimary: faker.datatype.boolean({ probability: 0.3 })
        }
      })
    })
  )

  // 5. Создаем продукты (10 штук)
  console.log('🍰 Создание продуктов...')
  const products = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const chef = chefProfiles[i % chefProfiles.length]
      const categoryId = (i % 10) + 1 // Распределяем по категориям
      
      return await prisma.product.create({
        data: {
          chefId: chef.id,
          categoryId: categoryId,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
          isAvailable: faker.datatype.boolean({ probability: 0.9 })
        }
      })
    })
  )

  // 6. Создаем изображения продуктов (10 штук)
  console.log('🖼️ Создание изображений продуктов...')
  const productImages = await Promise.all(
    products.map(async (product) => {
      return await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: `https://picsum.photos/seed/${product.id}/400/300`,
          isPrimary: true
        }
      })
    })
  )

  // 7. Создаем акции (5 штук)
  console.log('🎯 Создание акций...')
  const promotions = await Promise.all(
    chefProfiles.map(async (chef) => {
      return await prisma.promotion.create({
        data: {
          chefId: chef.id,
          title: faker.commerce.productAdjective() + ' акция',
          discountType: faker.helpers.arrayElement(['PERCENTAGE', 'FIXED', 'FREE_DELIVERY']),
          discountValue: parseFloat(faker.commerce.price({ min: 10, max: 50 })),
          startDate: faker.date.recent(),
          endDate: faker.date.future(),
          isActive: faker.datatype.boolean({ probability: 0.7 })
        }
      })
    })
  )

  // 8. Создаем заказы (10 штук)
  console.log('📦 Создание заказов...')
  const orders = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const customer = customers[i % customers.length]
      const chef = chefProfiles[i % chefProfiles.length]
      
      return await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${i}`,
          userId: customer.id,
          chefId: chef.id,
          status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED']),
          totalAmount: parseFloat(faker.commerce.price({ min: 500, max: 5000 })),
          subtotal: parseFloat(faker.commerce.price({ min: 400, max: 4500 })),
          deliveryFee: parseFloat(faker.commerce.price({ min: 0, max: 500 })),
          deliveryAddress: faker.location.streetAddress(),
          paymentStatus: faker.helpers.arrayElement(['PENDING', 'PAID', 'FAILED']),
          paymentMethod: faker.helpers.arrayElement(['CARD', 'CASH', 'ONLINE'])
        }
      })
    })
  )

  // 9. Создаем элементы заказов (10 штук)
  console.log('🛒 Создание элементов заказов...')
  const orderItems = await Promise.all(
    orders.map(async (order, index) => {
      const product = products[index % products.length]
      
      return await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          unitPrice: product.price,
          totalPrice: product.price * faker.number.int({ min: 1, max: 5 })
        }
      })
    })
  )

  // 10. Создаем доставки (10 штук)
  console.log('🚚 Создание доставок...')
  const deliveries = await Promise.all(
    orders.map(async (order) => {
      return await prisma.delivery.create({
        data: {
          orderId: order.id,
          status: faker.helpers.arrayElement(['PENDING', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED']),
          estimatedTime: faker.date.soon()
        }
      })
    })
  )

  // 11. Создаем отзывы (10 штук)
  console.log('⭐ Создание отзывов...')
  const reviews = await Promise.all(
    orders.map(async (order, index) => {
      const customer = customers[index % customers.length]
      const chef = chefProfiles[index % chefProfiles.length]
      const product = products[index % products.length]
      
      return await prisma.review.create({
        data: {
          orderId: order.id,
          userId: customer.id,
          chefId: chef.id,
          productId: product.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          isApproved: faker.datatype.boolean({ probability: 0.9 })
        }
      })
    })
  )

  // 12. Создаем элементы корзины (5 штук)
  console.log('🛍️ Создание элементов корзины...')
  const cartItems = await Promise.all(
    customers.slice(0, 5).map(async (customer, index) => {
      const product = products[index % products.length]
      
      return await prisma.cartItem.create({
        data: {
          userId: customer.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 3 })
        }
      })
    })
  )

  // 13. Создаем сессии пользователей (10 штук)
  console.log('🔐 Создание сессий...')
  const userSessions = await Promise.all(
    users.map(async (user) => {
      return await prisma.userSession.create({
        data: {
          userId: user.id,
          token: `session_token_${user.id}_${Date.now()}`,
          expiresAt: faker.date.future()
        }
      })
    })
  )

  // 14. Создаем уведомления (10 штук)
  console.log('🔔 Создание уведомлений...')
  const notifications = await Promise.all(
    users.map(async (user, index) => {
      return await prisma.notification.create({
        data: {
          type: faker.helpers.arrayElement(['ORDER', 'USER', 'PAYMENT', 'REVIEW', 'SYSTEM']),
          priority: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
          title: faker.lorem.words(3),
          message: faker.lorem.sentence(),
          isRead: faker.datatype.boolean({ probability: 0.4 }),
          actionUrl: faker.internet.url(),
          userId: user.id,
          expiresAt: faker.date.future(),
          data: {
            orderId: orders[index % orders.length]?.id,
            productName: products[index % products.length]?.name,
            amount: parseFloat(faker.commerce.price({ min: 100, max: 5000 }))
          }
        }
      })
    })
  )

  console.log('✅ Все тестовые данные успешно созданы!')
  console.log('\n📊 Статистика созданных данных:')
  console.log(`- 👥 Пользователи: ${users.length}`)
  console.log(`- 👨‍🍳 Повара: ${chefProfiles.length}`)
  console.log(`- 🏠 Адреса: ${addresses.length}`)
  console.log(`- 📂 Категории: ${10}`)
  console.log(`- 🍰 Продукты: ${products.length}`)
  console.log(`- 🖼️ Изображения: ${productImages.length}`)
  console.log(`- 🎯 Акции: ${promotions.length}`)
  console.log(`- 📦 Заказы: ${orders.length}`)
  console.log(`- 🛒 Элементы заказов: ${orderItems.length}`)
  console.log(`- 🚚 Доставки: ${deliveries.length}`)
  console.log(`- ⭐ Отзывы: ${reviews.length}`)
  console.log(`- 🛍️ Корзины: ${cartItems.length}`)
  console.log(`- 🔐 Сессии: ${userSessions.length}`)
  console.log(`- 🔔 Уведомления: ${notifications.length}`)
  
  console.log('\n🚀 Запустите Prisma Studio для просмотра данных:')
  console.log('npx prisma studio')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании тестовых данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })