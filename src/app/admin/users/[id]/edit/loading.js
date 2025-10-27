// app/admin/users/[id]/edit/loading.js
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 admin-transition">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок с анимацией */}
        <div className="mb-8 animate-fade-in">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-72 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        </div>

        {/* Информационная карточка с анимацией */}
        <div className="mb-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse mr-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse"></div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка формы с анимацией */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 space-y-6">
            {[
              { label: 'Email', width: 'w-20' },
              { label: 'Имя', width: 'w-16' },
              { label: 'Телефон', width: 'w-24' }
            ].map((field, index) => (
              <div 
                key={index}
                className="space-y-3 animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className={`h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded ${field.width} animate-pulse`}></div>
                <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ))}

            {/* Разделитель с анимацией */}
            <div className="border-t border-gray-200 pt-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-36 mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Футер с кнопками с анимацией */}
          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-56 animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-28 animate-pulse"></div>
                <div className="h-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl w-28 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация с анимацией */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse mr-3"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}