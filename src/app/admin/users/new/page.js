// app/admin/users/create/page.tsx
import { createUser } from "@/lib/actions/user.actions";
import Link from "next/link";

export default function CreateUserPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Создать пользователя</h2>
        <Link 
          href="/admin/users" 
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Назад
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border p-6 max-w-md">
        <form action={createUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email" 
              name="email" 
              className="w-full border p-2 rounded" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Имя *</label>
            <input 
              type="text" 
              name="firstName" 
              className="w-full border p-2 rounded" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Телефон</label>
            <input 
              type="tel" 
              name="phone" 
              className="w-full border p-2 rounded" 
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  );
}