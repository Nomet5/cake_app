'use client'

import { motion, AnimatePresence } from 'framer-motion'

const TransitionWrapper = ({
    children,
    keyName,
    className = ""
}) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default TransitionWrapper