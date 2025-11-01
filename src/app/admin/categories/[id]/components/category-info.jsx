'use client';

import { useState } from 'react';

export default function CategoryInfo({ category }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Информация о категории</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`space-y-4 transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-32'} overflow-hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">ID категории</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{category.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Статус</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
              category.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {category.isActive ? 'Активна' : 'Неактивна'}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Порядок сортировки</label>
            <p className="mt-1 text-sm text-gray-900">{category.sortOrder}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Дата создания</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(category.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        {category.description && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Описание</label>
            <p className="mt-1 text-sm text-gray-900 leading-relaxed">
              {category.description}
            </p>
          </div>
        )}
      </div>

      {!isExpanded && (
        <div className="mt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            Показать больше...
          </button>
        </div>
      )}
    </div>
  );
}