'use client'

import { useState } from 'react'

const StarRating = ({
    rating = 0,
    onRatingChange,
    size = 'md',
    readonly = false
}) => {
    const [hoverRating, setHoverRating] = useState(0)

    const sizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    }

    const handleClick = (value) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value)
        }
    }

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value)
        }
    }

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0)
        }
    }

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating)
                return (
                    <button
                        key={star}
                        type="button"
                        className={`${sizes[size]} transition-transform ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            }`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => handleMouseEnter(star)}
                        onMouseLeave={handleMouseLeave}
                        disabled={readonly}
                    >
                        <span className={isFilled ? 'text-bakery-700' : 'text-bakery-200'}>
                            ★
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export default StarRating