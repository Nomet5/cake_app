// app/admin/users/[id]/page.tsx
import { getUserById } from "../../../actions/admin/user.actions";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function UserDetailPage(props) {
  // Получаем ID из параметров
  const id = parseInt(props.params.id);

  // Получаем данные пользователя
  const result = await getUserById(id);

  // Если пользователь не найден, показываем 404
  if (!result.success) {
    notFound();
  }

  const { user } = result;

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
              href="/admin/users"
              className="text-gray-500 hover:text-gray-700"
            >
              Пользователи
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">
              {user.firstName || user.email}
            </span>
          </li>
        </ol>
      </nav>

      {/* Заголовок и действия */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName || "Пользователь без имени"}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/users/${user.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Редактировать
          </Link>
          <Link
            href="/admin/users"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Назад
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Карточка основной информации */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="mt-1">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Имя</label>
                <p className="mt-1">{user.firstName || "Не указано"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Телефон
                </label>
                <p className="mt-1">{user.phone || "Не указан"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Дата регистрации
                </label>
                <p className="mt-1">
                  {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Последнее обновление
                </label>
                <p className="mt-1">
                  {new Date(user.updatedAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {user._count?.orders || 0}
                </p>
                <p className="text-sm text-gray-600">Заказы</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {user._count?.reviews || 0}
                </p>
                <p className="text-sm text-gray-600">Отзывы</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {user._count?.addresses || 0}
                </p>
                <p className="text-sm text-gray-600">Адреса</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {user.chefProfile ? "Да" : "Нет"}
                </p>
                <p className="text-sm text-gray-600">Повар</p>
              </div>
            </div>
          </div>

          {/* Последние заказы */}
          {user.orders && user.orders.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Последние заказы</h2>
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Заказ #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.chef?.user?.firstName || "Повар"} •{" "}
                        {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.totalAmount} ₽</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Профиль повара */}
          {user.chefProfile && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Профиль повара</h2>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Статус
                  </label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Активен
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Товаров
                  </label>
                  <p className="mt-1">
                    {user.chefProfile._count?.products || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Заказов
                  </label>
                  <p className="mt-1">{user.chefProfile._count?.orders || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Адреса */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Адреса доставки</h2>
              <div className="space-y-3">
                {user.addresses.map((address) => (
                  <div key={address.id} className="p-3 border rounded-lg">
                    <p className="font-medium">
                      {address.title || "Основной адрес"}
                    </p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    {address.apartment && (
                      <p className="text-sm text-gray-600">
                        Кв. {address.apartment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Быстрые действия */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Действия</h2>
            <div className="space-y-2">
              <Link
                href={`/admin/orders?user=${user.id}`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                📦 Просмотреть заказы
              </Link>
              <Link
                href={`/admin/reviews?user=${user.id}`}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                ⭐ Просмотреть отзывы
              </Link>
              {!user.chefProfile && (
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  👨‍🍳 Сделать поваром
                </button>
              )}
              <Link
                href={`/admin/users?delete=${user.id}`}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                🗑️ Удалить пользователя
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
