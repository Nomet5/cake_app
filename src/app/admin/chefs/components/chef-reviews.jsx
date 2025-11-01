// app/admin/chefs/components/chef-reviews.jsx
'use client'

import { 
  AnimatedContainer, 
  AnimatedList,
  FloatingElement,
  SubtleHover,
  AnimatedCounter
} from '../../Components/animation-component'

export default function ChefReviews({ chefId }) {
  // Временные данные отзывов
  const reviews = [
    { 
      id: 1, 
      customer: 'Анна Козлова', 
      rating: 5, 
      comment: 'Отличный повар! Блюда очень вкусные и качественные. Обязательно буду заказывать ещё.', 
      date: '2024-01-14',
      avatarColor: 'bg-blue-500'
    },
    { 
      id: 2, 
      customer: 'Дмитрий Волков', 
      rating: 4, 
      comment: 'Хорошо, но можно лучше. Доставка немного задержалась, но еда была свежей.', 
      date: '2024-01-13',
      avatarColor: 'bg-green-500'
    },
    { 
      id: 3, 
      customer: 'Мария Петрова', 
      rating: 5, 
      comment: 'Великолепно! Профессионал своего дела. Блюда выглядят как в ресторане.', 
      date: '2024-01-12',
      avatarColor: 'bg-purple-500'
    },
  ]

  const stats = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    responseRate: 85
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
    )
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Статистика отзывов */}
      <AnimatedContainer animation="fadeInUp" delay={0} duration="normal">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FloatingElement speed="slow">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </FloatingElement>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">Отзывы клиентов</h3>
                <p className="text-gray-600 mt-1">
                  Общая оценка работы повара
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline">
                <AnimatedCounter 
                  value={parseFloat(stats.averageRating)}
                  duration={2000}
                  className="text-4xl font-bold text-orange-600"
                  format={false}
                />
                <span className="text-2xl text-orange-600 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                средний рейтинг
              </div>
            </div>
          </div>

          {/* Детальная статистика */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-yellow-200">
            <div className="text-center">
              <AnimatedCounter 
                value={stats.totalReviews}
                duration={1500}
                className="text-2xl font-bold text-gray-900"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Всего отзывов</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={stats.fiveStar}
                duration={1500}
                className="text-2xl font-bold text-green-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">5-звездочных</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={stats.responseRate}
                duration={1500}
                className="text-2xl font-bold text-blue-600"
                format={false}
              />
              <div className="text-sm text-gray-600 mt-1">% ответов</div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Список отзывов */}
      <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse-gentle"></span>
              Последние отзывы
            </h4>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {reviews.length} отзывов
            </span>
          </div>
          
          <AnimatedList
            items={reviews}
            animation="fadeInUp"
            staggerDelay={80}
            className="space-y-4"
            renderItem={(review, index) => (
              <FloatingElement speed="normal" key={review.id}>
                <SubtleHover>
                  <div className="border-2 border-gray-100 rounded-xl p-5 hover-lift hover-glow transition-all duration-300 group">
                    {/* Заголовок отзыва */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${review.avatarColor} rounded-xl flex items-center justify-center text-white font-medium shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          {getInitials(review.customer)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.customer}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(review.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{review.rating}.0</span>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Текст отзыва */}
                    <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                      {review.comment}
                    </p>

                    {/* Действия */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Отзыв проверен
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Ответить
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                          Пожаловаться
                        </button>
                      </div>
                    </div>
                  </div>
                </SubtleHover>
              </FloatingElement>
            )}
          />

          {/* Кнопка показать все отзывы */}
          {reviews.length > 0 && (
            <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full py-3 text-orange-600 hover:text-orange-800 font-medium rounded-lg border-2 border-orange-200 hover:bg-orange-50 transition-all duration-300 hover-lift flex items-center justify-center group">
                  <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Показать все отзывы ({reviews.length})
                </button>
              </div>
            </AnimatedContainer>
          )}
        </div>
      </AnimatedContainer>

      {/* Пустое состояние */}
      {reviews.length === 0 && (
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center shadow-sm">
            <FloatingElement speed="slow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </FloatingElement>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Отзывов пока нет</h4>
            <p className="text-gray-500 text-sm mb-4">
              У этого повара еще нет отзывов от клиентов
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
              Попросить оставить отзыв
            </button>
          </div>
        </AnimatedContainer>
      )}
    </div>
  )
}