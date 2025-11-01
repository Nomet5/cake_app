// app/admin/products/components/product-status.jsx
'use client'

import { toggleProductAvailable } from "../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'

export default function ProductStatus({ product }) {
  const router = useRouter()

  const handleToggleStatus = async () => {
    try {
      const result = await toggleProductAvailable(product.id)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }

  return (
    <button
      onClick={handleToggleStatus}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 
        transform hover:scale-105 cursor-pointer
        ${product.isAvailable 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'
        }
      `}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {product.isAvailable ? 'Доступен' : 'Недоступен'}
    </button>
  )
}