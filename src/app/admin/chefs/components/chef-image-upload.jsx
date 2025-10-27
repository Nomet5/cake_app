'use client'

import { useState } from 'react'

export default function ChefImageUpload({ currentImage, onImageChange, chefName }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    
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

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="h-40 w-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={chefName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs mt-2 block">Нет фото</span>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Фотография повара
        </label>
        
        <div className="flex space-x-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
            <span className="block w-full px-3 py-2 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors">
              {currentImage ? 'Изменить' : 'Загрузить'}
            </span>
          </label>
          
          {currentImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Удалить
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-500">
          Рекомендуемый размер: 400x400px. Форматы: JPG, PNG, WebP
        </p>
      </div>
    </div>
  )
}