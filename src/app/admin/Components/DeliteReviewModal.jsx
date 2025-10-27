// src/app/admin/reviews/components/DeleteReviewModal.jsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteReview } from '../../actions/admin/review.actions'

export default function DeleteReviewModal({ reviewId, reviewInfo }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    router.push('/admin/reviews')
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const result = await deleteReview(reviewId)

      if (result.success) {
        router.push('/admin/reviews')
        router.refresh()
      } else {
        alert(result.error)
        handleClose()
      }
    } catch (error) {
      alert('Ошибка при удалении отзыва')
      console.error('Delete review error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Подтверждение удаления</h3>
          <p className="text-gray-600 mb-6">
            Вы уверены, что хотите удалить отзыв от пользователя <strong>{reviewInfo.userName}</strong>?
            <br />
            <span className="text-sm text-gray-500">
              Рейтинг: {reviewInfo.rating}/5
            </span>
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Удаление...' : 'Удалить отзыв'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}