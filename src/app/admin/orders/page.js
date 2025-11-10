// src/app/admin/orders/page.js
import { getOrders, getOrderStats } from "../../actions/admin/order.actions";
import Link from "next/link";
import DeleteOrderModal from "./components/DeleteOrderModal";
import StatsCard from "./components/statsCard";
import OrderFilters from "./components/OrderFilters";
import OrdersTable from "./components/OrdersTable";

export default async function OrdersPage({ searchParams }) {
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);

  const deleteOrderId = searchParams.delete;
  const orderToDelete = orders.find(
    (order) => order.id === parseInt(deleteOrderId)
  );

  // Фильтрация заказов по searchParams
  const filter = searchParams.filter || 'all';
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status);
    if (filter === 'confirmed') return order.status === 'CONFIRMED';
    if (filter === 'preparing') return order.status === 'PREPARING';
    if (filter === 'delivered') return order.status === 'DELIVERED';
    if (filter === 'cancelled') return order.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="min-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок и кнопки */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Управление заказами</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Всего заказов: {stats.total} • В обработке: {stats.pending} • Завершено: {stats.completed}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/orders/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
            >
              <span className="mr-2">+</span>
              Создать заказ
            </Link>
          </div>
        </div>
          
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Всего заказов"
            value={stats.total}
            icon="📦"
            color="blue"
            description="Заказов в системе"
          />
          <StatsCard
            title="В обработке"
            value={stats.pending}
            icon="⏳"
            color="yellow"
            description="Требуют внимания"
          />
          <StatsCard
            title="Завершено"
            value={stats.completed}
            icon="✅"
            color="green"
            description="Успешно выполнено"
          />
          <StatsCard
            title="Общая выручка"
            value={stats.totalRevenue}
            icon="💰"
            color="purple"
            description="Сумма всех заказов"
            isPrice={true}
          />
        </div>
          
        {/* Фильтры */}
        <div className="mb-6">
          <OrderFilters />
        </div>

        {/* Таблица заказов */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Список заказов ({filteredOrders.length})
            </h2>
            <p className="text-sm text-gray-500">
              Отсортировано по дате создания
            </p>
          </div>
          <OrdersTable orders={filteredOrders} />
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
    </div>
  );
}