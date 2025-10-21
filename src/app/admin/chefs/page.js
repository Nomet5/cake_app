// app/admin/chefs/page.tsx
import { getChefs, deleteChef } from "../../lib/actions/chef.actions";
import Link from "next/link";

export default async function ChefsPage() {
  const chefs = await getChefs();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Повара</h2>
        <Link 
          href="/admin/chefs/create" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Добавить
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border-b">ID</th>
              <th className="p-3 text-left border-b">Название бизнеса</th>
              <th className="p-3 text-left border-b">Пользователь</th>
              <th className="p-3 text-left border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef) => (
              <tr key={chef.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{chef.id}</td>
                <td className="p-3">{chef.businessName}</td>
                <td className="p-3">{chef.user.email}</td>
                <td className="p-3">
                  <form action={deleteChef.bind(null, chef.id)}>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Удалить
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}