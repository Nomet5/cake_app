// components/Pagination.tsx
export function Pagination({ 
  currentPage, 
  totalPages, 
  basePath 
}: { 
  currentPage: number
  totalPages: number
  basePath: string
}) {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {/* Первая страница */}
        {currentPage > 1 && (
          <a
            href={`${basePath}?page=1`}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            «
          </a>
        )}

        {/* Номера страниц */}
        {getPageNumbers().map((page) => (
          <a
            key={page}
            href={`${basePath}?page=${page}`}
            className={`px-3 py-1 border rounded-lg ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </a>
        ))}

        {/* Последняя страница */}
        {currentPage < totalPages && (
          <a
            href={`${basePath}?page=${totalPages}`}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            »
          </a>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Страница {currentPage} из {totalPages}
      </div>
    </div>
  )
}