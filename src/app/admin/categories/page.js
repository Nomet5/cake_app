// app/admin/categories/page.tsx
import { getCategories, deleteCategory } from "../../lib/actions/category.actions";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Категории</h2>
        <Link 
          href="/admin/categories/create" 
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
              <th className="p-3 text-left border-b">Название</th>
              <th className="p-3 text-left border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{category.id}</td>
                <td className="p-3">{category.name}</td>
                <td className="p-3">
                  <form action={deleteCategory.bind(null, category.id)}>
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