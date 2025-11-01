'use client';

import { useState } from 'react';
import { deleteCategory } from '../../../actions/admin/category.actions';

export default function DeleteCategoryModal({ isOpen, onClose, category }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const result = await deleteCategory(category.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        // Можно добавить toast уведомление здесь
        window.location.reload();
      }
    } catch (err) {
      setError('Произошла ошибка при удалении категории');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="text-center">
          {/* Иконка с анимацией */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4 animate-bounce-soft">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Удалить категорию?
          </h3>
          
          <p className="text-sm text-gray-500 mb-4">
            Вы уверены, что хотите удалить категорию <strong>«{category.name}»</strong>? 
            Это действие нельзя отменить.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-shake">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 hover-lift disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
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
        </div>
      </div>
    </div>
  );
}