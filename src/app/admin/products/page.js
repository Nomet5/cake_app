// app/admin/products/page.tsx
import { getProducts, toggleProductAvailable } from '../../lib/actions/product.actions'
import { SearchFilter } from '@/components/SearchFilter'
import { ProductTable } from '@/components/ProductTable'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    search?: string; 
    chefId?: string;
    categoryId?: string;
    available?: string;
  }
}) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const chefId = searchParams.chefId ? Number(searchParams.chefId) : undefined
  const categoryId = searchParams.categoryId ? Number(searchParams.categoryId) : undefined
  const available = searchParams.available === 'true' ? true : 
                   searchParams.available === 'false' ? false : undefined
  
  const result = await getProducts(page, 20, search, chefId)

  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Ошибка: {result.error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Товары</h1>
          <p className="text-gray-600 mt-2">
            Управление товарами и их доступностью
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          <span>Добавить товар</span>
        </a>
      </div>

      {/* Фильтры и поиск */}
      <ProductFilters 
        search={search}
        chefId={chefId}
        categoryId={categoryId}
        available={available}
      />

      {/* Таблица товаров */}
      <ProductTable 
        products={result.products} 
        pagination={result.pagination}
        currentPage={page}
      />
    </div>
  )
}