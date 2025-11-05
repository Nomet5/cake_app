// app/admin/chefs/components/chef-image-upload.jsx
'use client'

import { useState, useRef } from 'react'
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
  SubtleHover 
} from '../../Components/animation-component'

export default function ChefImageUpload({ currentImage, onImageChange, chefName }) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения')
      return
    }

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB')
      return
    }

    setIsUploading(true)
    setIsDragOver(false)
    
    try {
      // Имитация загрузки изображения
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // В реальном приложении здесь будет загрузка на сервер
      const imageUrl = URL.createObjectURL(file)
      onImageChange(imageUrl)
    } catch (error) {
      alert('Ошибка при загрузке изображения')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onImageChange('')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleImageUpload(e)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="space-y-6"
    >
      {/* Заголовок */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse-gentle"></div>
          Фотография повара
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Загрузите профессиональное фото для профиля повара
        </p>
      </div>

      {/* Область загрузки */}
      <div className="text-center">
        <div 
          className={`relative inline-block transition-all duration-300 ${
            isDragOver ? 'scale-105' : 'scale-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FloatingElement speed="slow">
            <div 
              className={`
                h-48 w-48 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden
                transition-all duration-300 cursor-pointer group
                ${currentImage 
                  ? 'border-orange-300 bg-orange-50' 
                  : isDragOver
                    ? 'border-blue-400 bg-blue-50 scale-105'
                    : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={!isUploading ? triggerFileInput : undefined}
            >
              {currentImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={currentImage} 
                    alt={chefName}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Наложение при наведении */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium">Изменить фото</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 group-hover:text-orange-400 transition-colors duration-300 p-4">
                  <svg className="mx-auto h-12 w-12 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="space-y-1">
                    <span className="text-sm font-medium block">Загрузить фото</span>
                    <span className="text-xs block">Перетащите или кликните</span>
                  </div>
                </div>
              )}
            </div>
          </FloatingElement>
          
          {/* Индикатор загрузки */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <span className="text-xs font-medium">Загрузка...</span>
              </div>
            </div>
          )}

          {/* Индикатор drag & drop */}
          {isDragOver && !currentImage && !isUploading && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-2xl border-2 border-blue-400 border-dashed flex items-center justify-center">
              <div className="text-blue-600 text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium block">Отпустите для загрузки</span>
              </div>
            </div>
          )}

          {/* Скрытый input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <AnimatedButton
            onClick={triggerFileInput}
            disabled={isUploading}
            variant={currentImage ? "secondary" : "primary"}
            size="sm"
            className="flex-1 justify-center group"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Загрузка...
              </>
            ) : currentImage ? (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Изменить фото
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Выбрать файл
              </>
            )}
          </AnimatedButton>
          
          {currentImage && (
            <AnimatedButton
              onClick={handleRemoveImage}
              disabled={isUploading}
              variant="danger"
              size="sm"
              className="flex-1 justify-center group"
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </AnimatedButton>
          )}
        </div>

        {/* Информация о загрузке */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-gray-600">
              <p className="font-medium text-gray-700">Рекомендации по загрузке:</p>
              <ul className="mt-1 space-y-1">
                <li>• Форматы: JPG, PNG, WebP</li>
                <li>• Размер: до 5MB</li>
                <li>• Рекомендуемое разрешение: 400×400px</li>
                <li>• Профессиональное фото в формате портрета</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Drag & Drop подсказка */}
        {!currentImage && (
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Или перетащите изображение в выделенную область
            </p>
          </div>
        )}
      </div>
    </AnimatedContainer>
  )
}