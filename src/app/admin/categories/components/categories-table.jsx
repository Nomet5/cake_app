'use client';

import Link from 'next/link';
import { useState } from 'react';
import CategoryStatus from './category-status';
import CategoryActions from './category-actions';

const TableRow = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <tr 
      className={`
        transition-all duration-300 border-b border-gray-100
        ${isHovered ? 'bg-blue-50 scale-[1.02]' : 'bg-white'}
        animate-fade-in stagger-${(index % 4) + 1}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <Link 
          href={`/admin/categories/${category.id}`}
          className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-300 hover-lift inline-block"
        >
          {category.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <CategoryStatus isActive={category.isActive} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-100 hover:text-blue-600">
          {category.sortOrder}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900">
            {category._count?.products || 0}
          </span>
          {category._count?.products > 0 && (
            <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping-slow"></span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <CategoryActions category={category} />
      </td>
    </tr>
  );
};

export default function CategoriesTable({ categories }) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
          <tr className="animate-slide-in-down">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Порядок
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Товары
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category, index) => (
            <TableRow key={category.id} category={category} index={index} />
          ))}
        </tbody>
      </table>
      
      {categories.length === 0 && (
        <div className="text-center py-12 animate-bounce-slow">
          <div className="text-gray-400 text-lg">Категории не найдены</div>
        </div>
      )}
    </div>
  );
}