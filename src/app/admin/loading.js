export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-sm mx-auto">
        
        {/* Анимированный контейнер */}
        <div className="relative animate-fade-in-up">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-gray-100">
            <svg 
              className="w-8 h-8 text-blue-500 animate-pulse-gentle" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" 
              />
            </svg>
          </div>
          
          {/* Тонкое вращающееся кольцо */}
          <div className="absolute -inset-2 border-2 border-blue-100 border-t-blue-400 rounded-2xl animate-spin duration-slow"></div>
        </div>

        {/* Текстовая информация */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-semibold text-gray-800">
            Загрузка данных
          </h3>
          <p className="text-gray-500 text-sm">
            Подождите, идет загрузка пользователей...
          </p>
        </div>

        {/* Минималистичный прогресс-индикатор */}
        <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce-gentle"
                style={{ 
                  animationDelay: `${dot * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}