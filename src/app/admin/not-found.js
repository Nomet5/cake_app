import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Сайдбар */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-8 w-8 bg-blue-600 rounded"></div>
          <span className="text-lg font-semibold">Админ-панель</span>
        </div>
        
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Дашборд</span>
          </Link>
          
          <Link href="/admin/categories" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Категории</span>
          </Link>
          
          <Link href="/admin/products" className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Товары</span>
          </Link>
        </nav>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
          
          <p className="text-gray-500 mb-8">
            Извините, мы не смогли найти страницу, которую вы ищете. 
            Возможно, вы перешли по устаревшей ссылке или страница была перемещена.
          </p>

          <div className="space-y-4">
            <Link
              href="/admin"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Вернуться в дашборд
            </Link>
            
            <div className="text-sm">
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Вернуться назад
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}