// app/admin/users/loading.jsx
export default function UsersLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок с анимацией */}
      <div className="flex justify-between items-center animate-fade-in">
        <div className="space-y-3">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Статистика с ступенчатой анимацией */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 animate-pulse"></div>
                <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse ml-4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Фильтры с анимацией */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Таблица с анимацией строк */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: '0.8s' }}>
        {/* Заголовок таблицы */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        {/* Строки таблицы с последовательной анимацией */}
        <div className="divide-y divide-gray-200">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="p-6 hover:bg-gray-50 transition-colors duration-300 animate-fade-in"
              style={{ 
                animationDelay: `${0.9 + index * 0.05}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-center justify-between">
                {/* Аватар и информация */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                  </div>
                </div>

                {/* Статус и статистика */}
                <div className="flex items-center space-x-6">
                  <div className="space-y-2">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 animate-pulse"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
                  </div>
                  
                  {/* Действия */}
                  <div className="flex space-x-3">
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-4 flex space-x-4">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация/футер таблицы */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"
                  style={{ animationDelay: `${1.3 + i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительные элементы загрузки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '1.4s' }}>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}