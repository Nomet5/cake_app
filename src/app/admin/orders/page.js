// src/app/admin/orders/page.js
import { getOrders, getOrderStats } from "../../actions/admin/order.actions";
import Link from "next/link";
import DeleteOrderModal from "../Components/DeliteOrderModal";

export default async function OrdersPage({ searchParams }) {
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);

  const deleteOrderId = searchParams.delete;
  const orderToDelete = orders.find(
    (order) => order.id === parseInt(deleteOrderId)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Заказы</h1>
          <p className="text-gray-600">
            Всего: {stats.total} | В обработке: {stats.pending} | Завершено:{" "}
            {stats.completed}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/orders?filter=pending"
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            В обработке
          </Link>
          <Link
            href="/admin/orders/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Создать заказ
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">В обработке</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Завершено</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Выручка</p>
              <p className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString("ru-RU")} ₽
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Номер
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Повар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Оплата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.user?.firstName}</p>
                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{order.chef?.businessName}</p>
                  <p className="text-sm text-gray-500">
                    {order.chef?.user?.firstName}
                  </p>
                </td>
                <td className="px-6 py-4 font-medium">{order.totalAmount} ₽</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Просмотреть
                  </Link>
                  <Link
                    href={`/admin/orders?delete=${order.id}`}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Удалить
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно удаления */}
      {deleteOrderId && orderToDelete && (
        <DeleteOrderModal
          orderId={parseInt(deleteOrderId)}
          orderInfo={{
            orderNumber: orderToDelete.orderNumber,
            userName: orderToDelete.user?.firstName,
            totalAmount: orderToDelete.totalAmount,
          }}
        />
      )}
    </div>
  );
}

// Компоненты бейджей статусов
function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Ожидание" },
    CONFIRMED: { color: "bg-blue-100 text-blue-800", label: "Подтвержден" },
    PREPARING: { color: "bg-purple-100 text-purple-800", label: "Готовится" },
    READY: { color: "bg-green-100 text-green-800", label: "Готов" },
    DELIVERED: { color: "bg-green-100 text-green-800", label: "Доставлен" },
    CANCELLED: { color: "bg-red-100 text-red-800", label: "Отменен" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Ожидание" },
    PAID: { color: "bg-green-100 text-green-800", label: "Оплачен" },
    FAILED: { color: "bg-red-100 text-red-800", label: "Ошибка" },
    REFUNDED: { color: "bg-gray-100 text-gray-800", label: "Возврат" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}
