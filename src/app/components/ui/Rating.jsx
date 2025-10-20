const Rating = ({ rating, reviewCount, size = 'sm' }) => {
    const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    }

    return (
        <div className={`flex items-center gap-1 ${sizes[size]}`}>
            <div className="flex text-bakery-700">
                {'★'.repeat(5).split('').map((star, index) => (
                    <span
                        key={index}
                        className={index < Math.floor(rating) ? 'text-bakery-700' : 'text-bakery-200'}
                    >
                        {star}
                    </span>
                ))}
            </div>
            <span className="font-medium text-bakery-1100">{rating}</span>
            {reviewCount && (
                <span className="text-bakery-1050">({reviewCount})</span>
            )}
        </div>
    )
}

export default Rating