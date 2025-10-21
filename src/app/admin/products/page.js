// app/admin/products/page.tsx
import { getProducts, deleteProduct } from "../../lib/actions/product.actions";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Товары</h2>
        <Link 
          href="/admin/products/create" 
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
              <th className="p-3 text-left border-b">Цена</th>
              <th className="p-3 text-left border-b">Повар</th>
              <th className="p-3 text-left border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{product.id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price} ₽</td>
                <td className="p-3">{product.chef.businessName}</td>
                <td className="p-3">
                  <form action={deleteProduct.bind(null, product.id)}>
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