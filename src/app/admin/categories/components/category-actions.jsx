'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toggleCategoryActive } from '../../../actions/admin/category.actions';
import DeleteCategoryModal from '../components/delete-category-modal';

const ActionButton = ({ onClick, children, color = 'blue', className = '' }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    if (onClick) onClick(e);
  };

  const colorClasses = {
    blue: 'text-blue-600 hover:text-blue-900 hover:bg-blue-50',
    red: 'text-red-600 hover:text-red-900 hover:bg-red-50',
    green: 'text-green-600 hover:text-green-900 hover:bg-green-50',
    orange: 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-3 py-2 rounded-lg font-medium transition-all duration-300
        transform ${isClicked ? 'scale-95' : 'scale-100'}
        ${colorClasses[color]} ${className}
      `}
    >
      {children}
    </button>
  );
};

export default function CategoryActions({ category }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await toggleCategoryActive(category.id);
      // Добавляем визуальную обратную связь
      setTimeout(() => setIsToggling(false), 1000);
    } catch (error) {
      console.error('Error toggling category:', error);
      setIsToggling(false);
    }
  };

  return (
    <>
      <div className="flex gap-1 animate-scale-in">
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="px-3 py-2 rounded-lg font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-300 hover-lift"
        >
          ✏️ Редактировать
        </Link>
        
        <ActionButton
          onClick={handleToggleActive}
          color={category.isActive ? 'orange' : 'green'}
          className={isToggling ? 'animate-pulse' : ''}
        >
          {category.isActive ? '⏸️ Деактивировать' : '▶️ Активировать'}
        </ActionButton>
        
        <ActionButton
          onClick={() => setShowDeleteModal(true)}
          color="red"
        >
          🗑️ Удалить
        </ActionButton>
      </div>

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        category={category}
      />
    </>
  );
}