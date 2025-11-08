'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategory, deleteCategory } from '../../../actions/admin/category.actions';
import { AnimatedContainer, AnimatedButton } from '../../Components//animation-component';

export default function EditCategoryForm({ category }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.target);
    
    try {
      const result = await updateCategory(category.id, formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Категория успешно обновлена!');
        setTimeout(() => {
          router.push('/admin/categories');
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError('Произошла ошибка при обновлении категории');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const result = await deleteCategory(category.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Категория успешно удалена!');
        setTimeout(() => {
          router.push('/admin/categories');
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError('Произошла ошибка при удалении категории');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('isActive', (!category.isActive).toString());
      
      const result = await updateCategory(category.id, formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(`Категория ${!category.isActive ? 'активирована' : 'деактивирована'}!`);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError('Произошла ошибка при изменении статуса категории');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedContainer animation="fadeInUp" duration="normal">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Сообщения об ошибках и успехе */}
        {error && (
          <AnimatedContainer animation="shake" duration="fast">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </AnimatedContainer>
        )}

        {success && (
          <AnimatedContainer animation="fadeIn" duration="normal">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            </div>
          </AnimatedContainer>
        )}

        {/* Основные поля формы */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Название категории */}
          <AnimatedContainer animation="fadeInUp" delay={100} className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Название категории *
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={category.name}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                placeholder="Введите название категории"
              />
            </div>
          </AnimatedContainer>

          {/* Порядок сортировки */}
          <AnimatedContainer animation="fadeInUp" delay={150}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Порядок сортировки
                </div>
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={category.sortOrder}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">
                Категории сортируются по возрастанию этого значения
              </p>
            </div>
          </AnimatedContainer>

          {/* Статус активности */}
          <AnimatedContainer animation="fadeInUp" delay={200}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Статус категории
                </div>
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    value="true"
                    defaultChecked={category.isActive}
                    className="sr-only"
                  />
                  <label
                    htmlFor="isActive"
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out ${
                      category.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
                        category.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </label>
                </div>
                <span className="text-sm text-gray-700">
                  {category.isActive ? 'Активная' : 'Неактивная'}
                </span>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Статистика категории */}
        <AnimatedContainer animation="fadeInUp" delay={250}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
            <h4 className="text-sm font-medium text-blue-900 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Статистика категории
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">{category.id}</div>
                <div className="text-xs text-blue-700">ID категории</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">{category._count?.products || 0}</div>
                <div className="text-xs text-blue-700">Товаров</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-blue-900">
                  {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="text-xs text-blue-700">Дата создания</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-blue-900">
                  {new Date(category.updatedAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="text-xs text-blue-700">Последнее обновление</div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Кнопки действий */}
        <AnimatedContainer animation="fadeInUp" delay={300}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            {/* Левая группа кнопок - действия с категорией */}
            <div className="flex flex-wrap gap-3">
              <AnimatedButton
                type="button"
                onClick={handleToggleActive}
                disabled={isLoading}
                variant={category.isActive ? "warning" : "success"}
                size="md"
              >
                {category.isActive ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Деактивировать
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Активировать
                  </>
                )}
              </AnimatedButton>
              
              <AnimatedButton
                type="button"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                variant="danger"
                size="md"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Удаление...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Удалить категорию
                  </>
                )}
              </AnimatedButton>
            </div>

            {/* Правая группа кнопок - навигация и сохранение */}
            <div className="flex flex-wrap gap-3">
              <AnimatedButton
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                variant="secondary"
                size="md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Отмена
              </AnimatedButton>
              
              <AnimatedButton
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="md"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Сохранить изменения
                  </>
                )}
              </AnimatedButton>
            </div>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  );
}