import { getCategories } from '../../actions/admin/category.actions'
import CategoriesTable from './components/categories-table'
import CategoryActions from './components/category-actions'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Категории</h1>
          <p className="text-gray-600">Управление категориями товаров</p>
        </div>
        <CategoryActions />
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}