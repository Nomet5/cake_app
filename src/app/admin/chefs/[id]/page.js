import { notFound } from 'next/navigation'
import { getAdminChef } from "../../../../actions/admin/chefs.actions"
import ChefProfile from "./components/chef-profile"
import ChefProducts from "./components/chef-products"
import ChefOrders from "./components/chef-orders"
import ChefReviews from "./components/chef-reviews"
import ChefStats from "./components/chef-stats"
import BackButton from "../../components/back-button"

export default async function ChefDetailPage({ params }) {
  const result = await getAdminChef(params.id)

  if (!result.success) {
    if (result.error === 'Chef not found') {
      notFound()
    }
    
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Ошибка</h2>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    )
  }

  const { chef } = result

  return (
    <div className="p-6 space-y-6">
      <BackButton />
      
      {/* Заголовок и действия */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{chef.name}</h1>
          <p className="text-gray-600">Профиль повара</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            {chef.status === 'active' ? 'Заблокировать' : 'Активировать'}
          </button>
          <a
            href={`/admin/chefs/${chef.id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Редактировать
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Левая колонка - профиль и статистика */}
        <div className="lg:col-span-1 space-y-6">
          <ChefProfile chef={chef} />
          <ChefStats chef={chef} />
        </div>
        
        {/* Правая колонка - продукты, заказы, отзывы */}
        <div className="lg:col-span-3 space-y-6">
          <ChefProducts chefId={chef.id} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChefOrders chefId={chef.id} />
            <ChefReviews chefId={chef.id} />
          </div>
        </div>
      </div>
    </div>
  )
}