import Link from 'next/link'

export default function ChefsNotFound() {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Раздел не найден</h1>
        
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Раздел управления поварами не доступен или был перемещен.
        </p>

        <div className="space-y-3">
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← В дашборд
          </Link>
        </div>
      </div>
    </div>
  )
}