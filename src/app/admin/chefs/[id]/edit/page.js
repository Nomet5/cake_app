import { notFound } from 'next/navigation'
import { getChefById } from "../../../../actions/admin/chef.actions"
import EditChefForm from "../../components/edit-chef-form"
import BackButton from "../../../components/back-button"

export default async function EditChefPage({ params }) {
  // Validate that ID is a valid number
  const chefId = parseInt(params.id)
  if (isNaN(chefId)) {
    notFound()
  }

  const result = await getChefById(params.id)

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

  return (
    <div className="p-6 space-y-6">
      <BackButton href={`/admin/chefs/${params.id}`} />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Редактирование повара</h1>
        <p className="text-gray-600">Измените данные повара {result.chef.name}</p>
      </div>

      <EditChefForm chef={result.chef} />
    </div>
  )
}