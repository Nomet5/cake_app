'use client';

import Link from 'next/link';
import { useState } from 'react';

const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 hover-lift ${
        isHovered ? 'shadow-lg border-blue-200' : 'shadow-sm'
      } animate-fade-in stagger-${(index % 4) + 1}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h4>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="font-medium text-green-600">
              {product.price?.toLocaleString('ru-RU')} ₽
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              product.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.isAvailable ? 'В наличии' : 'Нет в наличии'}
            </span>
          </div>

          {product.chef && (
            <p className="text-sm text-gray-500 mb-3">
              Шеф: {product.chef.user.firstName}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Заказы: {product._count?.orderItems || 0}</span>
            <span>Отзывы: {product._count?.reviews || 0}</span>
          </div>
        </div>

        <Link
          href={`/admin/products/${product.id}`}
          className={`ml-4 px-3 py-1 text-sm rounded-lg transition-all duration-300 ${
            isHovered 
              ? 'bg-blue-600 text-white shadow-blue-200' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          →
        </Link>
      </div>
    </div>
  );
};

export default function CategoryProducts({ products }) {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? products : products.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Товары в категории
          <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {products.length}
          </span>
        </h3>
        
        {products.length > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            {showAll ? 'Скрыть' : 'Показать все'}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8 animate-bounce-slow">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500">В этой категории пока нет товаров</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}

      {products.length > 6 && !showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            + Показать еще {products.length - 6} товаров
          </button>
        </div>
      )}
    </div>
  );
}