import StarRating from '../common/StarRating'

const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-bakery-soft border border-bakery-200">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="font-semibold text-bakery-1150 text-lg font-body">
                        {review.userName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="sm" readonly />
                        <span className="text-bakery-1050 text-sm font-body">
                            {formatDate(review.date)}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-bakery-1100 leading-relaxed font-body">
                {review.comment}
            </p>

            {review.productName && (
                <div className="mt-3 pt-3 border-t border-bakery-200">
                    <p className="text-bakery-1050 text-sm font-body">
                        Заказ: {review.productName}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ReviewCard