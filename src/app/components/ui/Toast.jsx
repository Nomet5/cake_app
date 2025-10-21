'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../context/ToastContext'

const Toast = () => {
    const { toasts, removeToast } = useToast()

    const getToastStyles = (type) => {
        const baseStyles = "rounded-xl p-4 shadow-bakery-hard border-l-4 max-w-sm"

        switch (type) {
            case 'success':
                return `${baseStyles} bg-bakery-50 border-bakery-900 text-bakery-1100`
            case 'error':
                return `${baseStyles} bg-red-50 border-red-500 text-red-900`
            case 'warning':
                return `${baseStyles} bg-amber-50 border-amber-500 text-amber-900`
            case 'info':
                return `${baseStyles} bg-blue-50 border-blue-500 text-blue-900`
            default:
                return `${baseStyles} bg-bakery-50 border-bakery-500 text-bakery-1100`
        }
    }

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅'
            case 'error':
                return '❌'
            case 'warning':
                return '⚠️'
            case 'info':
                return 'ℹ️'
            default:
                return '💬'
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 300, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 300, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={getToastStyles(toast.type)}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0">
                                {getToastIcon(toast.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium font-body break-words">
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 text-bakery-1050 hover:text-bakery-700 transition-colors text-lg"
                            >
                                ×
                            </button>
                        </div>

                        {/* Progress bar */}
                        <motion.div
                            className="h-1 bg-current opacity-20 mt-2 rounded-full"
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: toast.duration / 1000, ease: "linear" }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default Toast