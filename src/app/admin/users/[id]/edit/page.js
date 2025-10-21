// app/admin/users/[id]/edit/page.tsx
import { getUserById } from '@/lib/actions'
import { UserForm } from '@/components/UserForm'
import { notFound } from 'next/navigation'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const result = await getUserById(Number(params.id))

  if (!result.success) {
    notFound()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Редактирование пользователя</h1>
        <a
          href={`/admin/users/${params.id}`}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Назад
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <UserForm user={result.user} />
      </div>
    </div>
  )
}