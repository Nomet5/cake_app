// app/admin/orders/page.tsx
import { getOrders, updateOrderStatus } from "../../lib/actions/order.actions";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">Номер</th>
              <th className="p-3 text-left border-b">Пользователь</th>
              <th className="p-3 text-left border-b">Повар</th>
              <th className="p-3 text-left border-b">Сумма</th>
              <th className="p-3 text-left border-b">Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{order.user.firstName}</td>
                <td className="p-3">{order.chef.businessName}</td>
                <td className="p-3">{order.totalAmount} ₽</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}