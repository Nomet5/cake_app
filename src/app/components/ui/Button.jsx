'use client'

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 font-body'

    const variants = {
        primary: 'bg-bakery-400 hover:bg-bakery-500 text-white focus:ring-bakery-400 shadow-bakery-soft hover:shadow-bakery-medium',
        secondary: 'bg-bakery-600 hover:bg-bakery-700 text-white focus:ring-bakery-600 shadow-bakery-soft',
        success: 'bg-bakery-900 hover:bg-bakery-950 text-white focus:ring-bakery-900',
        outline: 'border border-bakery-200 hover:bg-bakery-50 text-bakery-1100 focus:ring-bakery-400'
    }

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button