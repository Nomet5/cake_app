import { notFound } from 'next/navigation'
import { getChefById } from "../../../actions/admin/chef.actions"
import ChefProfile from "../components/chef-profile"
import ChefProducts from "../components/chef-products"
import ChefOrders from "../components/chef-orders"
import ChefReviews from "../components/chef-reviews"
import ChefStats from "../components/chef-stats"
import BackButton from "../../components/back-button"
import ChefActions from "../create/components/chef-actions"

export default async function ChefDetailPage({ params }) {
  // Добавляем проверку на существование params.id
  if (!params?.id) {
    notFound()
  }

  // Преобразуем id в число с проверкой
  const chefId = parseInt(params.id)
  
  // Проверяем, что преобразование прошло успешно
  if (isNaN(chefId)) {
    notFound()
  }

  // Используем getChefById с проверенным ID
  const result = await getChefById(chefId)

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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{chef.businessName || chef.user?.firstName || 'Повар'}</h1>
          <p className="text-gray-600">Профиль повара</p>
        </div>
        
        {/* Используем Client Component для действий */}
        <ChefActionsClient chef={chef} />
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