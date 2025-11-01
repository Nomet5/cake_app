// app/admin/products/[id]/components/product-images.jsx
'use client'

import { useState } from 'react'
import { setPrimaryProductImage, removeProductImage } from "../../../../../lib/actions/product.actions"
import { useRouter } from 'next/navigation'

export default function ProductImages({ product }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleSetPrimary = async (imageId) => {
    setIsLoading(true)
    try {
      const result = await setPrimaryProductImage(product.id, imageId)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error setting primary image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async (imageId) => {
    if (!confirm('Вы уверены, что хотите удалить это изображение?')) return
    
    setIsLoading(true)
    try {
      const result = await removeProductImage(imageId)
      if (result.success) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error removing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const primaryImage = product.images?.find(img => img.isPrimary)
  const otherImages = product.images?.filter(img => !img.isPrimary) || []

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in-up">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🖼️</span>
        Изображения продукта
        <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {product.images?.length || 0}
        </span>
      </h3>

      {/* Main Image */}
      <div className="mb-6">
        <div className="bg-gray-100 rounded-2xl p-4 mb-3">
          {primaryImage ? (
            <div className="relative group">
              <img
                src={primaryImage.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Основное
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📷</div>
                <div>Нет основного изображения</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {otherImages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Дополнительные изображения</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherImages.map((image, index) => (
              <div 
                key={image.id}
                className="relative group animate-scale-in"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <img
                  src={image.imageUrl}
                  alt={`${product.name} ${index + 2}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedImage(index + 1)}
                />
                
                {/* Image Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all duration-300 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    disabled={isLoading}
                    className="p-1 bg-white rounded text-green-600 hover:bg-green-50 transition-colors duration-200"
                    title="Сделать основным"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    disabled={isLoading}
                    className="p-1 bg-white rounded text-red-600 hover:bg-red-50 transition-colors duration-200"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Добавить изображения</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-gray-400 transition-colors duration-300">
          <div className="text-3xl text-gray-400 mb-2">📤</div>
          <div className="text-gray-600 mb-2">Перетащите изображения сюда или</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Выберите файлы
          </button>
          <div className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP до 10MB</div>
        </div>
      </div>
    </div>
  )
}