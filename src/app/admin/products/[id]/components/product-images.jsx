// app/admin/products/[id]/components/product-images.jsx
'use client'

import { useState } from 'react'
import { setPrimaryProductImage, removeProductImage } from "../../../../actions/admin/product.actions"
import { useRouter } from 'next/navigation'
import { 
  AnimatedContainer,
  AnimatedButton,
  FloatingElement,
  SubtleHover,
  SkeletonLoader 
} from '../../../Components/animation-component'

export default function ProductImages({ product }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageLoading, setImageLoading] = useState({})
  const [showLightbox, setShowLightbox] = useState(false)

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
        // Сбрасываем selectedImage если удаляем выбранное изображение
        if (selectedImage >= product.images?.length - 1) {
          setSelectedImage(Math.max(0, product.images?.length - 2))
        }
      }
    } catch (error) {
      console.error('Error removing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageLoad = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: true }))
  }

  const primaryImage = product.images?.find(img => img.isPrimary)
  const otherImages = product.images?.filter(img => !img.isPrimary) || []
  const allImages = product.images || []

  // Текущее выбранное изображение для просмотра
  const currentImage = allImages[selectedImage]

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <>
      <AnimatedContainer animation="fadeInUp" delay={300} className="h-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FloatingElement speed="slow">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🖼️</span>
                </div>
              </FloatingElement>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Изображения продукта</h3>
                <p className="text-sm text-gray-600">Управление фотографиями продукта</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{allImages.length}</div>
              <div className="text-sm text-gray-500">изображений</div>
            </div>
          </div>

          {/* Main Image Preview */}
          <AnimatedContainer animation="scaleIn" delay={400} className="mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {currentImage?.isPrimary ? 'Основное изображение' : 'Просмотр изображения'}
                </h4>
                <div className="flex items-center space-x-2">
                  {currentImage?.isPrimary && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Основное
                    </span>
                  )}
                  {allImages.length > 1 && (
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                      {selectedImage + 1} / {allImages.length}
                    </span>
                  )}
                </div>
              </div>

              {currentImage ? (
                <div className="relative group">
                  {!imageLoading[currentImage.id] && (
                    <SkeletonLoader type="card" className="w-full h-64 rounded-xl" />
                  )}
                  <img
                    src={currentImage.imageUrl}
                    alt={`${product.name} ${selectedImage + 1}`}
                    className={`w-full h-64 object-cover rounded-xl shadow-lg transition-opacity duration-300 cursor-zoom-in ${
                      imageLoading[currentImage.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(currentImage.id)}
                    onClick={() => setShowLightbox(true)}
                  />
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          prevImage()
                        }}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          nextImage()
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        →
                      </button>
                    </>
                  )}
                  
                  {/* Image Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <AnimatedButton
                      variant="success"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowLightbox(true)
                      }}
                      className="bg-white text-green-600 hover:bg-green-50"
                    >
                      📷 Увеличить
                    </AnimatedButton>
                    {!currentImage.isPrimary && (
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetPrimary(currentImage.id)
                        }}
                        disabled={isLoading}
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        ⭐ Основное
                      </AnimatedButton>
                    )}
                  </div>
                </div>
              ) : (
                <FloatingElement speed="normal">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-5xl text-gray-400 mb-3">📷</div>
                    <div className="text-gray-600 font-medium mb-1">Нет изображений</div>
                    <div className="text-gray-500 text-sm text-center px-4">
                      Добавьте первое изображение продукта
                    </div>
                  </div>
                </FloatingElement>
              )}
            </div>
          </AnimatedContainer>

          {/* Thumbnails Grid */}
          {allImages.length > 0 && (
            <AnimatedContainer animation="fadeInUp" delay={500} className="mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Все изображения ({allImages.length})
                  </h4>
                  <div className="flex space-x-2">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                      Кликните для просмотра
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allImages.map((image, index) => (
                    <AnimatedContainer
                      key={image.id}
                      animation="fadeInUp"
                      delay={600 + index * 100}
                    >
                      <FloatingElement speed="fast">
                        <SubtleHover>
                          <div 
                            className={`relative group bg-white rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                              selectedImage === index 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedImage(index)}
                          >
                            {/* Image */}
                            {!imageLoading[image.id] && (
                              <SkeletonLoader type="card" className="w-full h-24" />
                            )}
                            <img
                              src={image.imageUrl}
                              alt={`${product.name} ${index + 1}`}
                              className={`w-full h-24 object-cover transition-opacity duration-300 ${
                                imageLoading[image.id] ? 'opacity-100' : 'opacity-0'
                              }`}
                              onLoad={() => handleImageLoad(image.id)}
                            />
                            
                            {/* Selection Indicator */}
                            {selectedImage === index && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            
                            {/* Primary Badge */}
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xs">⭐</span>
                              </div>
                            )}
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-2">
                              {/* Top Actions */}
                              <div className="flex justify-between">
                                {!image.isPrimary && (
                                  <AnimatedButton
                                    variant="success"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSetPrimary(image.id)
                                    }}
                                    disabled={isLoading}
                                    className="w-7 h-7 p-0 bg-white text-green-600 hover:bg-green-50 text-xs"
                                    title="Сделать основным"
                                  >
                                    ⭐
                                  </AnimatedButton>
                                )}
                              </div>
                              
                              {/* Bottom Actions */}
                              <div className="flex justify-center space-x-1">
                                <AnimatedButton
                                  variant="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveImage(image.id)
                                  }}
                                  disabled={isLoading}
                                  className="w-7 h-7 p-0 bg-white text-red-600 hover:bg-red-50 text-xs"
                                  title="Удалить"
                                >
                                  🗑️
                                </AnimatedButton>
                              </div>
                            </div>

                            {/* Image Number */}
                            <div className="absolute bottom-1 left-1">
                              <span className="text-xs font-medium text-white bg-black/50 px-1 rounded">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                        </SubtleHover>
                      </FloatingElement>
                    </AnimatedContainer>
                  ))}
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Upload Section */}
          <AnimatedContainer animation="fadeInUp" delay={700} className="mt-auto">
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Добавить изображения
                </h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  До 10 МБ
                </span>
              </div>

              <FloatingElement speed="slow">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white group cursor-pointer">
                  <div className="text-4xl text-gray-400 mb-3 group-hover:text-purple-500 transition-colors duration-300">📤</div>
                  <div className="text-gray-700 font-medium mb-2">Перетащите изображения сюда</div>
                  <div className="text-gray-500 text-sm mb-4">или</div>
                  <AnimatedButton
                    variant="primary"
                    size="md"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Выберите файлы
                  </AnimatedButton>
                  <div className="text-xs text-gray-400 mt-3">
                    Поддерживаются: PNG, JPG, WEBP
                  </div>
                </div>
              </FloatingElement>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      {/* Lightbox Modal */}
      {showLightbox && currentImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors duration-200 z-10"
            >
              ✕
            </button>
            
            <img
              src={currentImage.imageUrl}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 transition-colors duration-200"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 transition-colors duration-200"
                >
                  →
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}