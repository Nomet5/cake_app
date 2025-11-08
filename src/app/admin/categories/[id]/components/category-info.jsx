'use client';

import { useState } from 'react';
import { AnimatedContainer, AnimatedButton } from '../../../Components/animation-component';

export default function CategoryInfo({ category }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AnimatedContainer 
      animation="fadeInUp" 
      delay={100}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Заголовок с кнопкой */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900">Информация о категории</h3>
        </div>
        
        <AnimatedButton
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Свернуть
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Подробнее
            </>
          )}
        </AnimatedButton>
      </div>

      {/* Основная информация - всегда видна */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <AnimatedContainer animation="fadeIn" delay={200} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-700">ID категории</div>
              <div className="text-lg font-bold text-blue-900">{category.id}</div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeIn" delay={250} className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-green-700">Статус</div>
              <div className={`text-lg font-bold ${category.isActive ? 'text-green-900' : 'text-red-900'}`}>
                {category.isActive ? 'Активна' : 'Неактивна'}
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeIn" delay={300} className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-700">Порядок</div>
              <div className="text-lg font-bold text-purple-900">{category.sortOrder}</div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer animation="fadeIn" delay={350} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-orange-700">Дата создания</div>
              <div className="text-lg font-bold text-orange-900">
                {new Date(category.createdAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>

      {/* Дополнительная информация - раскрывается */}
      <AnimatedContainer 
        animation="slideDown"
        duration="normal"
        className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Описание категории */}
          {category.description && (
            <AnimatedContainer animation="fadeInUp" delay={100} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-2">Описание категории</div>
                  <div className="text-gray-600 leading-relaxed bg-white p-3 rounded border border-gray-200">
                    {category.description}
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Статистика товаров */}
          <AnimatedContainer animation="fadeInUp" delay={150} className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-indigo-700">Товары в категории</div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-lg font-bold text-indigo-900">
                    {category._count?.products || 0} товаров
                  </span>
                  {category._count?.products > 0 && (
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping-slow"></span>
                  )}
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* Дополнительные действия */}
          <AnimatedContainer animation="fadeInUp" delay={200} className="flex space-x-3 pt-2">
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={() => window.location.href = `/admin/categories/${category.id}/edit`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </AnimatedButton>
            
            <AnimatedButton
              variant={category.isActive ? "secondary" : "success"}
              size="sm"
              onClick={() => {/* функция смены статуса */}}
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
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      {/* Индикатор свернутого состояния */}
      {!isExpanded && (
        <div className="text-center pt-2">
          <div className="text-sm text-gray-500 animate-pulse">
            ↓ Нажмите "Подробнее" для дополнительной информации
          </div>
        </div>
      )}
    </AnimatedContainer>
  );
}