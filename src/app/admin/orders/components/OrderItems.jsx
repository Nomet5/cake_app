// app/admin/orders/components/OrderItems.js
'use client';

import { AnimatedContainer, AnimatedCard, AnimatedList } from '../../Components/animation-component';

export default function OrderItems({ items }) {
  const renderItem = (item, index) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        {item.product?.images?.[0] && (
          <img 
            src={item.product.images[0].url} 
            alt={item.product.name}
            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {item.product?.name || 'Товар не найден'}
          </h4>
          {item.product?.chef && (
            <p className="text-sm text-gray-500">
              От: {item.product.chef.businessName}
            </p>
          )}
          {item.product?.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {item.product.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {item.unitPrice?.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-sm text-gray-500">
            × {item.quantity}
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {item.totalPrice?.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-xs text-gray-400">
            за шт: {item.unitPrice?.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>
    </div>
  );

  const calculateSubtotal = () => {
    return items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
  };

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Состав заказа
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Промежуточный итог</p>
            <p className="text-lg font-semibold text-gray-900">
              {calculateSubtotal().toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>

        {!items || items.length === 0 ? (
          <AnimatedContainer animation="fadeInUp">
            <div className="text-center py-8 text-gray-500">
              Нет товаров в заказе
            </div>
          </AnimatedContainer>
        ) : (
          <AnimatedList
            items={items}
            renderItem={renderItem}
            animation="fadeInUp"
            staggerDelay={50}
            className="divide-y divide-gray-100"
          />
        )}
      </div>
    </AnimatedCard>
  );
}