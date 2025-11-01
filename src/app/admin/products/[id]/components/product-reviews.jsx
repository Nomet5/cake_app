// app/admin/products/[id]/components/product-reviews.jsx
'use client'

import { 
  AnimatedContainer,
  AnimatedCounter,
  FloatingElement,
  SubtleHover
} from '../../../Components/animation-component'

export default function ProductReviews({ product }) {
  const reviews = product.reviews || []

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'from-emerald-400 to-green-500 text-white'
    if (rating >= 4) return 'from-green-400 to-emerald-500 text-white'
    if (rating >= 3) return 'from-yellow-400 to-amber-500 text-white'
    if (rating >= 2) return 'from-orange-400 to-red-500 text-white'
    return 'from-red-400 to-pink-500 text-white'
  }

  const getRatingBg = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800'
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => review.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === stars).length / reviews.length) * 100 : 0
  }))

  const getStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <AnimatedContainer animation="fadeInUp" delay={200} className="h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FloatingElement speed="slow">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">⭐</span>
              </div>
            </FloatingElement>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Отзывы о продукте</h3>
              <p className="text-sm text-gray-600">Оценки и мнения покупателей</p>
            </div>
          </div>
          
          <div className="text-right">
            <AnimatedCounter 
              value={reviews.length}
              duration={1500}
              className="text-2xl font-bold text-gray-900"
              format={true}
            />
            <div className="text-sm text-gray-500">всего отзывов</div>
          </div>
        </div>

        {/* Rating Overview */}
        <AnimatedContainer animation="scaleIn" delay={300}>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 mb-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className={`text-5xl font-bold bg-gradient-to-r ${getRatingColor(averageRating)} bg-clip-text text-transparent`}>
                  {averageRating}
                </div>
                <div className="text-yellow-500 text-xl mt-2">{getStars(Math.round(averageRating))}</div>
                <div className="text-sm text-gray-600 mt-2">Средняя оценка</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.rating >= 4).length}
                </div>
                <div className="text-sm text-gray-600">Положительных</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.rating <= 2).length}
                </div>
                <div className="text-sm text-gray-600">Критических</div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Rating Distribution */}
        <AnimatedContainer animation="fadeInUp" delay={400} className="mb-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Распределение оценок
            </h4>
            <div className="space-y-3">
              {ratingDistribution.map((dist, index) => (
                <div 
                  key={dist.stars} 
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-12 text-sm text-gray-600 font-medium flex items-center">
                    <span className="text-yellow-500 mr-1">{dist.stars}</span>
                    ★
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover:from-yellow-500 group-hover:to-amber-600"
                      style={{ width: `${dist.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-gray-900">{dist.count}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({Math.round(dist.percentage)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {/* Recent Reviews */}
        <AnimatedContainer animation="fadeInUp" delay={500} className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Последние отзывы
            </h4>
            {reviews.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Показано {Math.min(reviews.length, 5)} из {reviews.length}
              </span>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {reviews.slice(0, 5).map((review, index) => (
                <AnimatedContainer
                  key={review.id}
                  animation="fadeInUp"
                  delay={600 + index * 100}
                >
                  <FloatingElement speed="normal">
                    <SubtleHover>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-200 hover:shadow-md transition-all duration-300 group">
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                              {review.user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {review.user?.firstName || 'Анонимный пользователь'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center space-x-2">
                                <span>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</span>
                                <span>•</span>
                                <span>{review.user?.email}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getRatingBg(review.rating)} border-2 border-transparent group-hover:scale-110 transition-transform duration-300`}>
                            {review.rating}.0
                          </div>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1 mb-3">
                          <div className="text-yellow-500 text-lg">
                            {getStars(review.rating)}
                          </div>
                        </div>
                        
                        {/* Comment */}
                        {review.comment ? (
                          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                            {review.comment}
                          </p>
                        ) : (
                          <p className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-3 border border-gray-100">
                            Пользователь не оставил комментарий
                          </p>
                        )}
                      </div>
                    </SubtleHover>
                  </FloatingElement>
                </AnimatedContainer>
              ))}
            </div>
          ) : (
            <AnimatedContainer animation="fadeInUp" delay={600}>
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">😴</div>
                <div className="text-gray-900 font-medium mb-2">Пока нет отзывов</div>
                <div className="text-gray-500 text-sm">
                  Пользователи еще не оставили отзывов об этом продукте
                </div>
              </div>
            </AnimatedContainer>
          )}
        </AnimatedContainer>

        {/* View All Reviews */}
        {reviews.length > 5 && (
          <AnimatedContainer animation="fadeInUp" delay={700} className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group">
                <span>Показать все отзывы</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                  +{reviews.length - 5}
                </span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </AnimatedContainer>
        )}
      </div>
    </AnimatedContainer>
  )
}