// app/admin/products/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductForm from './components/create-product-form';
import { createProduct } from '../../../actions/admin/product.actions';
import { 
  AnimatedContainer,
  FloatingElement,
  SubtleHover 
} from "../../Components/animation-component";

const CreateProductPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик создания товара
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Создаем FormData для передачи в server action
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description || '');
      submitFormData.append("price", formData.price.toString());
      submitFormData.append("chefId", formData.chefId.toString());
      submitFormData.append("categoryId", formData.categoryId.toString());
      submitFormData.append("isAvailable", formData.isAvailable.toString());

      // Вызов server action для создания продукта
      const result = await createProduct(submitFormData);
      
      if (result.success) {
        // Успешное создание - переход к списку товаров
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.error || 'Произошла ошибка при создании товара');
      }
      
    } catch (err) {
      setError(err.message || 'Произошла непредвиденная ошибка');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <AnimatedContainer animation="fadeIn" delay={100}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Заголовок страницы */}
          <div className="mb-8">
            <AnimatedContainer animation="fadeInUp" delay={200}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FloatingElement speed="slow">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white text-2xl">➕</span>
                    </div>
                  </FloatingElement>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Создание нового продукта
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                      Заполните информацию о новом продукте для вашего меню
                    </p>
                  </div>
                </div>
                
                {/* Кнопка назад */}
                <SubtleHover>
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Назад к списку
                  </button>
                </SubtleHover>
              </div>
            </AnimatedContainer>
          </div>

          {/* Сообщение об ошибке */}
          {error && (
            <AnimatedContainer animation="fadeInUp" delay={400}>
              <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800">
                      Ошибка создания продукта
                    </h3>
                    <p className="text-red-700 mt-2">
                      {error}
                    </p>
                    <div className="mt-3 text-sm text-red-600">
                      Проверьте правильность заполнения всех обязательных полей
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Основной контент */}
          <AnimatedContainer animation="fadeInUp" delay={500}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Форма создания товара */}
                <CreateProductForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </AnimatedContainer>

          {/* Дополнительная информация */}
          <AnimatedContainer animation="fadeInUp" delay={600} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Подсказки */}
              <FloatingElement speed="normal">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    💡 Полезные подсказки
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Поля помеченные <span className="text-red-500">*</span> обязательны для заполнения</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Вы можете загрузить до 10 изображений продукта</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Поддерживаются форматы: JPG, PNG, WEBP</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Максимальный размер изображения: 10MB</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Укажите реалистичную цену для привлечения клиентов</span>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Статистика создания */}
              <FloatingElement speed="normal">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    📊 Быстрая статистика
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-green-700 font-medium">Продуктов создано</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">5+</div>
                      <div className="text-green-700 font-medium">Обязательных полей</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">10</div>
                      <div className="text-green-700 font-medium">Макс. изображений</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">2мин</div>
                      <div className="text-green-700 font-medium">Среднее время</div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </AnimatedContainer>

          {/* Футер с информацией */}
          <AnimatedContainer animation="fadeInUp" delay={700} className="mt-8">
            <div className="text-center text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Все данные защищены</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Автоматическое сохранение черновиков</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Мгновенная публикация</span>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default CreateProductPage;