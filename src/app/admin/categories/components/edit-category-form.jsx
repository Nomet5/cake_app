'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategory, deleteCategory } from '../../../actions/admin/category.actions';

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Сообщения */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Поля формы */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Название категории *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={category.name}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
            placeholder="Введите название категории"
          />
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Порядок сортировки
          </label>
          <input
            type="number"
            id="sortOrder"
            name="sortOrder"
            defaultValue={category.sortOrder}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
          <p className="mt-1 text-sm text-gray-500">
            Категории сортируются по возрастанию этого значения
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            value="true"
            defaultChecked={category.isActive}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Активная категория
          </label>
        </div>

        {/* Статистика категории */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Статистика категории</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ID категории:</span>
              <span className="ml-2 font-medium text-gray-900">{category.id}</span>
            </div>
            <div>
              <span className="text-gray-500">Товаров:</span>
              <span className="ml-2 font-medium text-gray-900">{category._count?.products || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">Дата создания:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(category.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Последнее обновление:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date(category.updatedAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift disabled:opacity-50 ${
              category.isActive 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {category.isActive ? 'Деактивировать' : 'Активировать'}
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 hover-lift disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Удаление...
              </>
            ) : (
              'Удалить категорию'
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 hover-lift disabled:opacity-50"
          >
            Отмена
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover-lift disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}