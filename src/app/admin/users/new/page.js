// app/admin/users/new/page.tsx
import { UserForm } from '@/components/UserForm'

export default function NewUserPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Создание пользователя</h1>
        <a
          href="/admin/users"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Назад к списку
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <UserForm />
      </div>
    </div>
  )
}