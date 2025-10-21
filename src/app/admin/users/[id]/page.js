// app/admin/users/[id]/page.tsx
import { getUserById } from '@/lib/actions'
import { notFound } from 'next/navigation'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const result = await getUserById(Number(params.id))

  if (!result.success) {
    notFound()
  }

  const { user } = result

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{user.firstName}</h1>
          <p className="text-gray-600 mt-2">Детальная информация о пользователе</p>
        </div>
        <div className="flex space-x-3">
          <a
            href={`/admin/users/${user.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Редактировать
          </a>
          <a
            href="/admin/users"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Назад
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Основная информация</h2>
          <div className="space-y-4">
            <InfoRow label="ID" value={user.id} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Имя" value={user.firstName} />
            <InfoRow label="Телефон" value={user.phone || '—'} />
            <InfoRow label="Дата регистрации" value={new Date(user.createdAt).toLocaleString('ru-RU')} />
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Статистика</h2>
          <div className="space-y-3">
            <StatItem label="Заказы" value={user._count.orders} />
            <StatItem label="Отзывы" value={user._count.reviews} />
            <StatItem label="Адреса" value={user._count.addresses} />
            <StatItem label="Товары в корзине" value={user._count.cartItems} />
          </div>
        </div>

        {/* Профиль повара */}
        {user.chefProfile && (
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Профиль повара</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow label="Название бизнеса" value={user.chefProfile.businessName} />
              <StatItem label="Товаров" value={user.chefProfile._count.products} />
              <StatItem label="Заказов" value={user.chefProfile._count.orders} />
            </div>
          </div>
        )}

        {/* Последние заказы */}
        {user.orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Последние заказы</h2>
            <div className="space-y-3">
              {user.orders.map((order: any) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
        {value}
      </span>
    </div>
  )
}

function OrderItem({ order }: { order: any }) {
  return (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
      <div>
        <div className="font-medium">Заказ #{order.orderNumber}</div>
        <div className="text-sm text-gray-600">Повар: {order.chef.businessName}</div>
      </div>
      <div className="text-right">
        <div className="font-medium">{order.totalAmount} ₽</div>
        <div className={`text-sm ${
          order.status === 'DELIVERED' ? 'text-green-600' : 
          order.status === 'CANCELLED' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {order.status}
        </div>
      </div>
    </div>
  )
}