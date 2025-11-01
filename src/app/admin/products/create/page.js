'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductForm from './components/create-product-form';

// Mock API functions - замените на реальные вызовы API
const createProduct = async (productData) => {
  // Временная заглушка - замените на реальный API вызов
  console.log('Creating product:', productData);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const CreateProductPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик создания товара
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Подготовка данных для отправки
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inStock: formData.inStock,
        images: formData.images
      };

      // В реальном приложении здесь будет загрузка изображений на сервер
      if (formData.images.some(img => img.file)) {
        console.log('Загрузка изображений...');
      }

      // Вызов API для создания товара
      await createProduct(productData);
      
      // Успешное создание - переход к списку товаров
      router.push('/admin/products');
      router.refresh(); // Обновляем данные на странице
      
    } catch (err) {
      setError(err.message || 'Произошла ошибка при создании товара');
      console.error('Error creating product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить создание товара? Все несохраненные данные будут потеряны.')) {
      router.push('/admin/products');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок страницы */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Создание нового товара
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Заполните информацию о новом товаре
              </p>
            </div>
            
            {/* Кнопка назад */}
            <button
              onClick={() => router.push('/admin/products')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Назад к списку
            </button>
          </div>
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Основной контент */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {/* Форма создания товара */}
            <CreateProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Подсказка
              </h3>
              <div className="text-sm text-blue-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Поля помеченные * являются обязательными для заполнения</li>
                  <li>Вы можете загрузить до 10 изображений товара</li>
                  <li>Изображения должны быть в формате JPG, PNG или GIF</li>
                  <li>Размер каждого изображения не должен превышать 10MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;