// src/app/admin/users/page.js
import { getUsers } from "../../lib/actions/user.actions";
import Link from "next/link";
import CreateUserModal from "../Components/createUserModal";

export default async function UsersPage({ searchParams }) {
  // Получаем пользователей на сервере
  const users = await getUsers();

  // Проверяем параметр URL для отображения модального окна
  const showModal = searchParams.modal === "create";

  return (
    <div className="p-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Пользователи</h1>
        <Link
          href="/admin/users?modal=create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Добавить пользователя
        </Link>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Имя
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Телефон
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Заказы
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Повар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата регистрации
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.firstName || "Не указано"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone || "Не указан"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user._count?.orders || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.chefProfile ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Редактировать
                    </Link>
                    <Link
                      href={`/admin/users?delete=${user.id}`}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Пользователи не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Условный рендеринг модального окна */}
      {showModal && <CreateUserModal />}
    </div>
  );
}
