import CreateChefForm from "./components/create-chef-form"
import BackButton from "../../components/back-button"

export default function CreateChefPage() {
  return (
    <div className="p-6 space-y-6">
      <BackButton href="/admin/chefs" />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавление повара</h1>
        <p className="text-gray-600">Создайте новый профиль повара</p>
      </div>

      <CreateChefForm />
    </div>
  )
}