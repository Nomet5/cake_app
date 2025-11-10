// app/admin/orders/components/OrderSummary.js
'use client';

import { AnimatedContainer, AnimatedCard, AnimatedCounter } from '../../Components/animation-component';

export default function OrderSummary({ subtotal, deliveryFee, totalAmount }) {
  const summaryItems = [
    { label: 'Стоимость товаров', value: subtotal || 0, color: 'text-gray-900' },
    { label: 'Доставка', value: deliveryFee || 0, color: 'text-gray-900' },
  ];

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Стоимость
        </h2>

        <div className="space-y-3">
          {summaryItems.map((item, index) => (
            <AnimatedContainer key={index} animation="fadeInUp" delay={index * 50}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-medium ${item.color}`}>
                  {item.value.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </AnimatedContainer>
          ))}
          
          <AnimatedContainer animation="fadeInUp" delay={summaryItems.length * 50}>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Итого</span>
                <span className="text-xl font-bold text-gray-900">
                  <AnimatedCounter 
                    value={totalAmount || 0} 
                    duration={1500}
                    format={true}
                  /> ₽
                </span>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedCard>
  );
}