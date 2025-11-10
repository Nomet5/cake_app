// app/admin/categories/components/create-category-form.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '../../../actions/admin/category.actions';
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
  SubtleHover
} from '../../Components/animation-component';

export default function CreateCategoryForm({ onBack }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sortOrder: 0,
    isActive: true,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const submitFormData = new FormData();
    submitFormData.append('name', formData.name.trim());
    submitFormData.append('sortOrder', formData.sortOrder.toString());
    submitFormData.append('isActive', formData.isActive.toString());
    submitFormData.append('description', formData.description || '');
    
    try {
      const result = await createCategory(submitFormData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Перенаправляем на страницу категорий после успешного создания
        router.push('/admin/categories');
        router.refresh();
      }
    } catch (err) {
      setError('Произошла ошибка при создании категории');
      console.error('Create category error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto"
    >
      {/* Заголовок формы */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к списку категорий
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Создать новую категорию</h1>
          <p className="text-gray-600 mt-2">Добавьте новую категорию для организации товаров в меню</p>
        </div>
        <FloatingElement speed="slow">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">📁</span>
          </div>
        </FloatingElement>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Сообщение об ошибке */}
        {error && (
          <AnimatedContainer animation="fadeIn" duration="fast">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          </AnimatedContainer>
        )}

        {/* Основная информация */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></div>
              Основная информация
            </h3>
            
            <div className="space-y-6">
              {/* Название категории */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Название категории *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 disabled:bg-gray-100 disabled:opacity-60"
                  placeholder="Например: Суши, Десерты, Напитки"
                />
                <p className="mt-2 text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Укажите понятное название для категории товаров
                </p>
              </div>

              {/* Описание */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Описание категории
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-300 bg-white hover:border-gray-300 disabled:bg-gray-100 disabled:opacity-60 resize-none"
                  placeholder="Краткое описание категории (необязательно)"
                />
                <p className="mt-2 text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Это описание поможет лучше понять назначение категории
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Настройки категории */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Настройки категории
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Порядок сортировки */}
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Порядок сортировки
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    min="0"
                    max="999"
                    disabled={isLoading}
                    className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 bg-white hover:border-gray-300 disabled:bg-gray-100 disabled:opacity-60"
                    placeholder="0"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-sm font-medium">#</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Чем меньше число, тем выше категория в списке
                </p>
              </div>

              {/* Статус активности */}
              <div className="flex items-center justify-center md:justify-start">
                <SubtleHover>
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2 transition-all duration-300"
                    />
                    <div>
                      <label htmlFor="isActive" className="block text-sm font-semibold text-gray-700 cursor-pointer">
                        Активная категория
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.isActive ? 'Категория видна пользователям' : 'Категория скрыта'}
                      </p>
                    </div>
                  </div>
                </SubtleHover>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Предпросмотр категории */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Предпросмотр категории
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <div className="text-purple-600 font-semibold">Название</div>
                <div className="text-gray-900 mt-1 truncate">
                  {formData.name || 'Не указано'}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <div className="text-purple-600 font-semibold">Порядок</div>
                <div className="text-gray-900 mt-1">
                  #{formData.sortOrder}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-purple-200">
                <div className="text-purple-600 font-semibold">Статус</div>
                <div className={`mt-1 font-semibold ${
                  formData.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.isActive ? '✅ Активна' : '⏸️ Неактивна'}
                </div>
              </div>
              
              {formData.description && (
                <div className="md:col-span-3 bg-white rounded-xl p-4 border border-purple-200">
                  <div className="text-purple-600 font-semibold mb-2">Описание</div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {formData.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Кнопки действий */}
        <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            {onBack && (
              <AnimatedButton
                type="button"
                onClick={onBack}
                disabled={isLoading}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад
              </AnimatedButton>
            )}
            
            <AnimatedButton
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Создание...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать категорию
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  );
}