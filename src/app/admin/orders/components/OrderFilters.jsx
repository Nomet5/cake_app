// src/app/admin/Components/OrderFilters.jsx (компактная версия)
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { 
  AnimatedContainer,
  SubtleHover 
} from '../../Components/animation-component';

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const filters = [
    { 
      value: 'all', 
      label: 'Все заказы', 
      icon: '📦',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200'
    },
    { 
      value: 'pending', 
      label: 'В обработке', 
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    { 
      value: 'confirmed', 
      label: 'Подтвержденные', 
      icon: '✅',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'preparing', 
      label: 'Готовятся', 
      icon: '👨‍🍳',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    { 
      value: 'delivered', 
      label: 'Доставленные', 
      icon: '🚚',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    { 
      value: 'cancelled', 
      label: 'Отмененные', 
      icon: '❌',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    }
  ];

  const handleFilterChange = (filter) => {
    const params = new URLSearchParams(searchParams);
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <AnimatedContainer
      animation="fadeInUp"
      delay={200}
      duration="normal"
      className="mb-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        {/* Заголовок секции */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🔍</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Фильтры заказов</h3>
            <p className="text-sm text-gray-500">Выберите статус для фильтрации</p>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, index) => (
            <AnimatedContainer
              key={filter.value}
              animation="fadeInUp"
              delay={300 + (index * 50)}
              duration="fast"
            >
              <SubtleHover>
                <button
                  onClick={() => handleFilterChange(filter.value)}
                  className={`
                    flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all duration-300
                    ${currentFilter === filter.value
                      ? `bg-gradient-to-r ${filter.color} text-white border-transparent shadow-md transform scale-105`
                      : `bg-white text-gray-700 ${filter.borderColor} hover:shadow-md hover:transform hover:scale-105`
                    }
                  `}
                >
                  {/* Иконка */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-300
                    ${currentFilter === filter.value 
                      ? 'bg-white bg-opacity-20' 
                      : filter.bgColor
                    }
                  `}>
                    {filter.icon}
                  </div>
                  
                  {/* Текст */}
                  <span className="font-medium text-sm whitespace-nowrap">
                    {filter.label}
                  </span>

                  {/* Индикатор активного состояния */}
                  {currentFilter === filter.value && (
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              </SubtleHover>
            </AnimatedContainer>
          ))}
        </div>

        {/* Информация о текущем фильтре */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Активный фильтр: <strong>{filters.find(f => f.value === currentFilter)?.label}</strong>
              </span>
            </div>
            
            {/* Кнопка сброса */}
            {currentFilter !== 'all' && (
              <button
                onClick={() => handleFilterChange('all')}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
              >
                <span>🔄</span>
                <span>Сбросить</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
}