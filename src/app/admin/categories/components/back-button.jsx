'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ 
  href, 
  children = 'Назад', 
  className = '' 
}) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center px-4 py-2 border border-gray-300 
        rounded-lg shadow-sm text-sm font-medium text-gray-700 
        bg-white hover:bg-gray-50 transition-all duration-300
        hover-lift hover:shadow-blue-200
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