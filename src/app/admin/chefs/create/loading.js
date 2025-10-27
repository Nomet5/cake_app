export default function CreateChefLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Кнопка назад */}
      <div className="h-4 bg-gray-200 rounded w-24"></div>

      {/* Заголовок */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-56"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>

      {/* Форма создания */}
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Аватар */}
          <div className="lg:col-span-1">
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          {/* Основные поля */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-36"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Пароль и статус */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-28"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Адрес и описание */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-4">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
}