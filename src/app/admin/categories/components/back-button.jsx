'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function BackButton({ 
  href, 
  children = 'Назад', 
  className = '',
  fallbackHref // Добавляем опциональный fallback URL
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else if (fallbackHref) {
      // Если указан fallbackHref, используем его
      router.push(fallbackHref);
    } else {
      // Определяем куда вернуться на основе текущего пути
      const isEditPage = pathname.includes('/edit');
      const isCategoryDetailPage = pathname.match(/\/admin\/categories\/\d+$/);
      
      if (isEditPage) {
        // Если на странице редактирования - возвращаемся к списку категорий
        router.push('/admin/categories');
      } else if (isCategoryDetailPage) {
        // Если на странице деталей категории - возвращаемся к списку категорий
        router.push('/admin/categories');
      } else {
        // В остальных случаях используем стандартное поведение
        router.back();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center px-4 py-2 border border-gray-300 
        rounded-lg shadow-sm text-sm font-medium text-gray-700 
        bg-white hover:bg-gray-50 transition-all duration-300
        hover-lift hover:shadow-md group
        ${className}
      `}
    >
      <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {children}
    </button>
  );
}