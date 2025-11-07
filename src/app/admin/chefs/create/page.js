import CreateChefSelector from "../components/create-chef-selector"
import BackButton from "../../Components/back-button"

export default function CreateChefPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Хедер */}
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <BackButton href="/admin/chefs" />
              <div className="mt-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                  Добавление повара
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl">
                  Выберите способ создания профиля повара - преобразовать существующего пользователя или создать полностью нового
                </p>
              </div>
            </div>
            
            {/* Декоративный элемент */}
            <div className="hidden lg:block opacity-10">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Разделитель */}
          <div className="border-t border-gray-200 pt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CreateChefSelector />
          </div>

          {/* Информационный блок */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Советы по созданию поваров</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Проверяйте наличие дубликатов email перед созданием</li>
                    <li>• Устанавливайте соответствующий опыт работы</li>
                    <li>• Добавляйте подробное описание специализации</li>
                    <li>• Назначайте статус "На проверке" для новых поваров</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}