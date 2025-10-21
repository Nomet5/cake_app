'use client'

import { motion } from 'framer-motion'

const HoverScale = ({
    children,
    scale = 1.05,
    className = ""
}) => {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default HoverScale