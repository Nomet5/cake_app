// app/admin/users/create/loading.js
export default function CreateUserLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 admin-transition">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки skeleton с анимацией */}
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className={`h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse ${
                  index % 2 === 0 ? 'w-20' : 'w-4'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
              {index < 4 && <div className="text-gray-400">/</div>}
            </div>
          ))}
        </div>

        {/* Заголовок и кнопка назад с анимацией */}
        <div className="flex justify-between items-center mb-8 animate-scale-in">
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-72 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-56 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-32 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Информационная карточка с анимацией */}
        <div className="mb-6 animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse mr-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-64 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Форма создания пользователя с анимацией */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 max-w-md animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="space-y-6">
            {[
              { label: 'Email', width: 'w-16' },
              { label: 'Имя', width: 'w-12' },
              { label: 'Пароль', width: 'w-20' },
              { label: 'Телефон', width: 'w-20' }
            ].map((field, index) => (
              <div 
                key={index}
                className="space-y-3 animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className={`h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded ${field.width} animate-pulse`}></div>
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
                {field.label === 'Пароль' && (
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
                )}
              </div>
            ))}

            {/* Разделитель */}
            <div className="border-t border-gray-200 pt-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-56 animate-pulse"></div>
            </div>

            {/* Кнопка создания */}
            <div className="pt-4 animate-scale-in" style={{ animationDelay: '1s' }}>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация с анимацией */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md animate-fade-in" style={{ animationDelay: '1.1s' }}>
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse mr-3"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}