export default function AdminDashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>

      {/* StatsCards скелетон - 4 карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Выручка */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="h-7 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 rounded w-16 mr-2"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        
        {/* Заказы */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="h-7 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 rounded w-16 mr-2"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        
        {/* Пользователи */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-7 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="flex items-center">
            <div className="h-3 bg-gray-200 rounded w-16 mr-2"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        
        {/* Конверсия */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* ChartsSection скелетон */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левый график */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-12"></div>
              ))}
            </div>
          </div>
          
          {/* Правый график */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded w-16"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя секция */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QuickActions скелетон */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {['Добавить товар', 'Создать категорию', 'Управление заказами', 'Настройки'].map((text, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RecentActivities скелетон */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}