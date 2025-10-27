// app/admin/users/[id]/loading.js
export default function UserDetailLoading() {
  return (
    <div className="p-6 space-y-6 admin-transition">
      {/* Кнопка назад с анимацией */}
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse animate-fade-in"></div>

      {/* Заголовок с анимацией */}
      <div className="flex justify-between items-start animate-scale-in">
        <div className="space-y-3">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-56 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-36 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Контент с анимацией */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        {/* Левая колонка */}
        <div className="lg:col-span-1 space-y-6">
          {/* Профиль с анимацией */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-slide-in-left">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-4 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center animate-fade-in" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Статистика с анимацией */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-28 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center animate-fade-in" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Правая колонка */}
        <div className="lg:col-span-3 space-y-6">
          {/* Заказы с анимацией */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-slide-in-right">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-36 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${0.7 + i * 0.1}s` }}>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Активность с анимацией */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-44 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
                  <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}