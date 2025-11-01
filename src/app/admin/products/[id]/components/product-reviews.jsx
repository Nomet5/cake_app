// app/admin/products/[id]/components/product-reviews.jsx
'use client'

export default function ProductReviews({ product }) {
  const reviews = product.reviews || []

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-100'
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => review.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === stars).length / reviews.length) * 100 : 0
  }))

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">⭐</span>
        Отзывы о продукте
        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {reviews.length}
        </span>
      </h3>

      {/* Rating Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <div className="text-sm text-gray-600 mt-1">Средняя оценка</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
            <div className="text-sm text-gray-600">Всего отзывов</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Распределение оценок</h4>
        <div className="space-y-2">
          {ratingDistribution.map((dist, index) => (
            <div key={dist.stars} className="flex items-center space-x-3 animate-slide-in-right"
                 style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
              <div className="w-8 text-sm text-gray-600">{dist.stars} ★</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${dist.percentage}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">{dist.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Последние отзывы</h4>
        {reviews.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.slice(0, 5).map((review, index) => (
              <div 
                key={review.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {review.user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.user?.firstName || 'Аноним'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${getRatingColor(review.rating)}`}>
                    {review.rating}.0
                  </div>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
                
                {!review.comment && (
                  <p className="text-gray-500 text-sm italic">
                    Без комментария
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">😔</div>
            <div>Пока нет отзывов</div>
          </div>
        )}
      </div>

      {/* View All Reviews */}
      {reviews.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
            Показать все отзывы ({reviews.length})
          </button>
        </div>
      )}
    </div>
  )
}