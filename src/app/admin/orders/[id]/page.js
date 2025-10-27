// src/app/admin/orders/[id]/page.js
import {
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  cancelOrder,
} from "../../../actions/admin/order.actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderDetailPage(props) {
  const params = await props.params;
  const id = parseInt(params.id);

  const result = await getOrderById(id);

  if (!result.success) {
    notFound();
  }

  const { order } = result;

  return (
    <div className="p-6">
      {/* Хлебные крошки */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
              Дашборд
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className="text-gray-500 hover:text-gray-700"
            >
              Заказы
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">
              Заказ #{order.orderNumber}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Карточка заказа */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  Заказ #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Создан:{" "}
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {order.totalAmount} ₽
                </div>
                <div className="flex space-x-2 mt-2">
                  <StatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Информация о пользователе и поваре */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Информация о клиенте
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Имя:</span>
                    <p className="font-medium">{order.user?.firstName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="font-medium">{order.user?.email}</p>
                  </div>
                  {order.user?.phone && (
                    <div>
                      <span className="text-sm text-gray-500">Телефон:</span>
                      <p className="font-medium">{order.user.phone}</p>
                    </div>
                  )}
                  <Link
                    href={`/admin/users/${order.userId}`}
                    className="inline-block text-blue-600 hover:text-blue-900 text-sm"
                  >
                    👤 Профиль пользователя
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Информация о поваре
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Название:</span>
                    <p className="font-medium">{order.chef?.businessName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Повар:</span>
                    <p className="font-medium">{order.chef?.user?.firstName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Контакты:</span>
                    <p className="font-medium">{order.chef?.user?.email}</p>
                    {order.chef?.user?.phone && (
                      <p className="font-medium">{order.chef.user.phone}</p>
                    )}
                  </div>
                  <Link
                    href={`/admin/chefs/${order.chefId}`}
                    className="inline-block text-blue-600 hover:text-blue-900 text-sm"
                  >
                    👨‍🍳 Профиль повара
                  </Link>
                </div>
              </div>
            </div>

            {/* Адрес доставки */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Адрес доставки</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-gray-700">{order.deliveryAddress}</p>
              </div>
            </div>

            {/* Товары в заказе */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Состав заказа</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {item.unitPrice} ₽
                      </p>
                    </div>
                    <p className="font-medium">{item.totalPrice} ₽</p>
                  </div>
                ))}

                {/* Итоги */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Стоимость товаров:</span>
                    <span>{order.subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Доставка:</span>
                    <span>{order.deliveryFee} ₽</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Итого:</span>
                    <span>{order.totalAmount} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Отзыв (если есть) */}
          {order.review && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Отзыв о заказе</h3>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⭐</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl font-bold text-yellow-500">
                      {order.review.rating}/5
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.review.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.review.isApproved ? "Одобрен" : "На модерации"}
                    </span>
                  </div>
                  <p className="text-gray-700">{order.review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(order.review.createdAt).toLocaleDateString(
                      "ru-RU"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель с действиями */}
        <div className="space-y-6">
          {/* Действия со статусом */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Управление статусом</h3>
            <div className="space-y-3">
              <form
                action={updateOrderStatus.bind(null, order.id, "CONFIRMED")}
              >
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✅ Подтвердить заказ
                </button>
              </form>
              <form
                action={updateOrderStatus.bind(null, order.id, "PREPARING")}
              >
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  👨‍🍳 В приготовлении
                </button>
              </form>
              <form action={updateOrderStatus.bind(null, order.id, "READY")}>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  📦 Готов к выдаче
                </button>
              </form>
              <form
                action={updateOrderStatus.bind(null, order.id, "DELIVERED")}
              >
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors"
                >
                  🚚 Доставлен
                </button>
              </form>
            </div>
          </div>

          {/* Управление оплатой */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Статус оплаты</h3>
            <div className="space-y-3">
              <form
                action={updateOrderPaymentStatus.bind(null, order.id, "PAID")}
              >
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  💰 Отметить оплаченным
                </button>
              </form>
              <form
                action={updateOrderPaymentStatus.bind(null, order.id, "FAILED")}
              >
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ❌ Ошибка оплаты
                </button>
              </form>
            </div>
          </div>

          {/* Отмена заказа */}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">
                Отмена заказа
              </h3>
              <form action={cancelOrder.bind(null, order.id)}>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Отменить заказ
                </button>
              </form>
            </div>
          )}

          {/* Быстрые действия */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Действия</h3>
            <div className="space-y-2">
              <Link
                href={`/admin/orders/${order.id}/edit`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                ✏️ Редактировать заказ
              </Link>
              {!order.review && (
                <Link
                  href={`/admin/reviews/create?orderId=${order.id}`}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  ⭐ Добавить отзыв
                </Link>
              )}
              <Link
                href={`/admin/orders?delete=${order.id}`}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                🗑️ Удалить заказ
              </Link>
            </div>
          </div>

          {/* Информация о заказе */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Создан:</span>
                <span>{new Date(order.createdAt).toLocaleString("ru-RU")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Обновлен:</span>
                <span>{new Date(order.updatedAt).toLocaleString("ru-RU")}</span>
              </div>
              {order.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Отменен:</span>
                  <span>
                    {new Date(order.cancelledAt).toLocaleString("ru-RU")}
                  </span>
                </div>
              )}
              {order.actualDeliveryTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставлен:</span>
                  <span>
                    {new Date(order.actualDeliveryTime).toLocaleString("ru-RU")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компоненты бейджей (те же что и в списке)
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
