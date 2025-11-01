// app/admin/products/components/product-image-upload.jsx
'use client'

import { useCallback, useState, useRef } from 'react'
import { 
  AnimatedContainer,
  FloatingElement,
  SubtleHover,
  AnimatedButton 
} from "../../../components/animation-component"

const ProductImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxFiles = 10, 
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    handleFiles(files)
    event.target.value = ''
  }

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    setDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    handleFiles(files)
  }, [images.length, maxFiles, maxSizeMB])

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const validateFile = (file) => {
    const errors = []
    
    // Проверка типа файла
    if (!acceptedFormats.includes(file.type)) {
      errors.push(`Формат ${file.type} не поддерживается`)
    }
    
    // Проверка размера
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      errors.push(`Размер файла не должен превышать ${maxSizeMB}MB`)
    }
    
    // Проверка количества файлов
    if (images.length >= maxFiles) {
      errors.push(`Максимальное количество изображений: ${maxFiles}`)
    }
    
    return errors
  }

  const handleFiles = (files) => {
    const newErrors = []
    const validFiles = []
    
    files.forEach((file) => {
      const fileErrors = validateFile(file)
      
      if (fileErrors.length === 0) {
        validFiles.push(file)
      } else {
        newErrors.push({
          fileName: file.name,
          errors: fileErrors
        })
      }
    })
    
    // Показываем ошибки
    if (newErrors.length > 0) {
      setErrors(newErrors)
      setTimeout(() => setErrors([]), 5000)
    }
    
    // Добавляем валидные файлы
    if (validFiles.length > 0) {
      const newImages = validFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isUploading: true,
        isPrimary: images.length === 0 && index === 0 // Первое изображение основное
      }))
      
      // Имитация загрузки
      newImages.forEach((image, index) => {
        // Постепенное увеличение прогресса
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            
            setTimeout(() => {
              onImagesChange(
                images.map(img => 
                  img.id === image.id 
                    ? { ...img, isUploading: false }
                    : img
                )
              )
            }, 300)
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [image.id]: progress
          }))
        }, 200)
      })
      
      onImagesChange([...images, ...newImages])
    }
  }

  const removeImage = (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId)
    const newImages = images.filter(image => image.id !== imageId)
    
    // Если удаляем основное изображение, делаем следующее основным
    if (imageToRemove?.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    
    onImagesChange(newImages)
    
    // Очищаем URL объекта
    if (imageToRemove?.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url)
    }
  }

  const setPrimaryImage = (imageId) => {
    const newImages = images.map(image => ({
      ...image,
      isPrimary: image.id === imageId
    }))
    onImagesChange(newImages)
  }

  const remainingSlots = maxFiles - images.length
  const formatList = acceptedFormats.map(format => 
    format.replace('image/', '').toUpperCase()
  ).join(', ')

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Изображения продукта</h3>
          <p className="text-sm text-gray-600 mt-1">
            {images.length} из {maxFiles} загружено
          </p>
        </div>
        
        {remainingSlots > 0 && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              Осталось мест: {remainingSlots}
            </div>
            <div className="text-xs text-gray-500">
              Макс. {maxSizeMB}MB на файл
            </div>
          </div>
        )}
      </div>

      {/* Область для перетаскивания */}
      <AnimatedContainer animation="fadeInUp" delay={100}>
        <div
          className={`
            relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer 
            transition-all duration-300 group overflow-hidden
            ${
              dragOver 
                ? 'border-blue-500 bg-blue-50/50 scale-105' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
            }
            ${images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (images.length < maxFiles && fileInputRef.current) {
              fileInputRef.current.click()
            }
          }}
        >
          {/* Фоновый градиент при наведении */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
            disabled={images.length >= maxFiles}
            className="hidden"
          />
          
          <FloatingElement speed="slow">
            <div className="relative z-10 space-y-4">
              {/* Иконка */}
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                dragOver 
                  ? 'bg-blue-500 text-white scale-110' 
                  : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Текст */}
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {images.length >= maxFiles ? 'Достигнут лимит изображений' : 'Перетащите изображения сюда'}
                </p>
                <p className="text-sm text-gray-600">
                  {images.length >= maxFiles 
                    ? 'Удалите некоторые изображения чтобы добавить новые'
                    : 'Или нажмите для выбора файлов'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  Поддерживаются: {formatList}
                </p>
              </div>

              {/* Кнопка выбора файлов */}
              {images.length < maxFiles && (
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  className="mx-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                >
                  📁 Выбрать файлы
                </AnimatedButton>
              )}
            </div>
          </FloatingElement>
        </div>
      </AnimatedContainer>

      {/* Сообщения об ошибках */}
      {errors.length > 0 && (
        <AnimatedContainer animation="fadeInUp" delay={200}>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Ошибки загрузки:
            </h4>
            <div className="space-y-1 text-sm text-red-700">
              {errors.map((error, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <strong>{error.fileName}:</strong> {error.errors.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedContainer>
      )}

      {/* Предпросмотр изображений */}
      {images.length > 0 && (
        <AnimatedContainer animation="fadeInUp" delay={300}>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Загруженные изображения ({images.length})
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <AnimatedContainer
                  key={image.id}
                  animation="scaleIn"
                  delay={400 + index * 50}
                >
                  <FloatingElement speed="fast">
                    <SubtleHover>
                      <div className={`
                        relative group bg-white rounded-xl border-2 overflow-hidden shadow-sm
                        transition-all duration-300 hover:shadow-md
                        ${image.isPrimary ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                      `}>
                        {/* Изображение */}
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        
                        {/* Наложение при наведении */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100">
                          {!image.isPrimary && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPrimaryImage(image.id)
                              }}
                              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Сделать основным"
                            >
                              ⭐
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(image.id)
                            }}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>

                        {/* Индикатор загрузки */}
                        {image.isUploading && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                            <div 
                              className="h-1 bg-blue-500 transition-all duration-300"
                              style={{ width: `${uploadProgress[image.id] || 0}%` }}
                            ></div>
                          </div>
                        )}

                        {/* Индикатор основного изображения */}
                        {image.isPrimary && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Основное
                            </span>
                          </div>
                        )}

                        {/* Информация о файле */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="truncate">{image.name}</div>
                          <div>{(image.size / 1024 / 1024).toFixed(1)} MB</div>
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

      {/* Подсказки */}
      <AnimatedContainer animation="fadeInUp" delay={500}>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⭐</span>
              </div>
              <span>Первое изображение станет основным</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Рекомендуемое разрешение: 800x600px</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Оптимальный формат: WebP или JPEG</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Максимум {maxFiles} изображений</span>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}

export default ProductImageUpload