'use client'

import { useState } from 'react'
import Button from '../common/Button'
import StarRating from '../common/StarRating'

const ReviewForm = ({ productId, onSubmit, onCancel }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (rating === 0) {
            alert('Пожалуйста, поставьте оценку')
            return
        }

        if (!comment.trim()) {
            alert('Пожалуйста, напишите отзыв')
            return
        }

        setIsSubmitting(true)

        try {
            // Здесь будет запрос к API когда бэкенд будет готов
            const review = {
                id: Date.now(),
                rating,
                comment: comment.trim(),
                userName: 'Анонимный пользователь', // Временное значение
                date: new Date().toISOString(),
                productName: 'Товар' // Временное значение
            }

            onSubmit(review)
            setRating(0)
            setComment('')
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error)
            alert('Произошла ошибка при отправке отзыва')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-bakery-50 rounded-2xl p-6 border border-bakery-200">
            <h3 className="font-semibold text-bakery-1150 text-lg mb-4 font-body">
                Оставить отзыв
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Рейтинг */}
                <div>
                    <label className="block text-bakery-1100 text-sm mb-2 font-body">
                        Ваша оценка *
                    </label>
                    <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        size="lg"
                    />
                    {rating > 0 && (
                        <p className="text-bakery-1050 text-sm mt-1 font-body">
                            Вы поставили {rating} {rating === 1 ? 'звезду' : rating < 5 ? 'звезды' : 'звезд'}
                        </p>
                    )}
                </div>

                {/* Комментарий */}
                <div>
                    <label className="block text-bakery-1100 text-sm mb-2 font-body">
                        Ваш отзыв *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Расскажите о вашем опыте... Что вам понравилось? Что можно улучшить?"
                        rows={4}
                        className="w-full px-4 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-white font-body text-bakery-1100 placeholder-bakery-1050 resize-none"
                        required
                    />
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                    </Button>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ReviewForm