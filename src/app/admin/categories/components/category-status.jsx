'use client';

import { useState, useEffect } from 'react';

export default function CategoryStatus({ isActive }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-500
      ${isActive 
        ? 'bg-green-100 text-green-800 shadow-green-200' 
        : 'bg-red-100 text-red-800 shadow-red-200'
      }
      ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
      hover-lift
    `}>
      <span className={`w-2 h-2 rounded-full mr-2 animate-pulse-slow ${
        isActive ? 'bg-green-500' : 'bg-red-500'
      }`}></span>
      {isActive ? 'Активна' : 'Неактивна'}
    </span>
  );
}