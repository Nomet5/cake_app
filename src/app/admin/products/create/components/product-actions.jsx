import React from 'react';

const ProductActions = ({ productId, onSave, onDelete, onCancel, isEditing, isLoading = false }) => {
  return (
    <div className="flex gap-3 justify-end mt-6">
      {isEditing && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Удалить товар
        </button>
      )}
      
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
      >
        Отмена
      </button>
      
      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Сохранение...' : (isEditing ? 'Обновить товар' : 'Создать товар')}
      </button>
    </div>
  );
};

export default ProductActions;