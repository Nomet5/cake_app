export default function ChefReviews({ chefId }) {
  // Временные данные отзывов
  const reviews = [
    { id: 1, customer: 'Анна Козлова', rating: 5, comment: 'Отличный повар! Блюда очень вкусные.', date: '2024-01-14' },
    { id: 2, customer: 'Дмитрий Волков', rating: 4, comment: 'Хорошо, но можно лучше.', date: '2024-01-13' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние отзывы</h3>
      
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {review.customer.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{review.customer}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-900 mr-1">{review.rating}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}