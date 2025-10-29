'use client'

import { useState } from 'react'
import Button from '../common/Button'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import StarRating from '../common/StarRating'

const ProductReviews = ({ productId, productName }) => {
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            rating: 5,
            comment: 'Очень вкусный торт! Заказывали на день рождения, все гости были в восторге. Шоколадный бисквит просто тает во рту.',
            userName: 'Анна Петрова',
            date: '2024-01-15T10:00:00Z',
            productName: 'Шоколадный торт "Вечер в Париже"'
        },
        {
            id: 2,
            rating: 4,
            comment: 'Хороший торт, но показался немного сладким. В следующий раз попрошу меньше сахара. Доставка быстрая, упаковка аккуратная.',
            userName: 'Иван Сидоров',
            date: '2024-01-10T14:30:00Z',
            productName: 'Шоколадный торт "Вечер в Париже"'
        },
        {
            id: 3,
            rating: 5,
            comment: 'Великолепно! Заказываю уже второй раз. Торт очень свежий, крем нежный, украшение красивое. Рекомендую!',
            userName: 'Мария Иванова',
            date: '2024-01-05T09:15:00Z',
            productName: 'Шоколадный торт "Вечер в Париже"'
        }
    ])

    // Расчет среднего рейтинга
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

    const handleAddReview = (newReview) => {
        setReviews(prev => [newReview, ...prev])
        setShowReviewForm(false)
        alert('Спасибо за ваш отзыв! Он будет опубликован после проверки.')
    }

    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(review => review.rating === stars).length,
        percentage: reviews.length > 0
            ? (reviews.filter(review => review.rating === stars).length / reviews.length) * 100
            : 0
    }))

    return (
        <section className="py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-bakery-1150 mb-4 font-display">
                    Отзывы о товаре
                </h2>

                {/* Общая статистика */}
                <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200 mb-6">
                    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                        {/* Средний рейтинг */}
                        <div className="text-center lg:text-left">
                            <div className="text-4xl font-bold text-bakery-1150 mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <StarRating rating={averageRating} size="lg" readonly />
                            <p className="text-bakery-1050 text-sm mt-2 font-body">
                                {reviews.length} {reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'}
                            </p>
                        </div>

                        {/* Распределение рейтингов */}
                        <div className="flex-1">
                            {ratingDistribution.map(({ stars, count, percentage }) => (
                                <div key={stars} className="flex items-center gap-3 mb-2">
                                    <span className="text-bakery-1050 text-sm w-4 font-body">
                                        {stars}
                                    </span>
                                    <div className="flex-1 bg-bakery-100 rounded-full h-2">
                                        <div
                                            className="bg-bakery-700 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-bakery-1050 text-sm w-8 font-body">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Кнопка добавления отзыва */}
                        <div>
                            <Button onClick={() => setShowReviewForm(true)}>
                                Написать отзыв
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Форма добавления отзыва */}
                {showReviewForm && (
                    <div className="mb-6">
                        <ReviewForm
                            productId={productId}
                            onSubmit={handleAddReview}
                            onCancel={() => setShowReviewForm(false)}
                        />
                    </div>
                )}
            </div>

            {/* Список отзывов */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-bakery-1150 mb-2 font-display">
                            Пока нет отзывов
                        </h3>
                        <p className="text-bakery-1050 mb-4 font-body">
                            Будьте первым, кто оставит отзыв об этом товаре!
                        </p>
                        <Button onClick={() => setShowReviewForm(true)}>
                            Написать первый отзыв
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductReviews