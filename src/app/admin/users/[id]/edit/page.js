// src/app/admin/users/[id]/edit/page.js
import { getUserById, updateUser } from '../../../../lib/actions/user.actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EditUserForm from '../../../Components/EditUserForm'

export default async function EditUserPage(props) {
  // Ждем параметры (await для динамических маршрутов)
  const params = await props.params
  const id = parseInt(params.id)
  
  // Получаем данные пользователя
  const result = await getUserById(id)

  // Если пользователь не найден, показываем 404
  if (!result.success) {
    notFound()
  }

  const { user } = result

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
            <Link href="/admin/users" className="text-gray-500 hover:text-gray-700">
              Пользователи
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <Link href={`/admin/users/${user.id}`} className="text-gray-500 hover:text-gray-700">
              {user.firstName || user.email}
            </Link>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">Редактирование</span>
          </li>
        </ol>
      </nav>

      {/* Заголовок и действия */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Редактирование пользователя</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <Link
          href={`/admin/users/${user.id}`}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Назад
        </Link>
      </div>

      {/* Форма редактирования */}
      <EditUserForm user={user} />
    </div>
  )
}