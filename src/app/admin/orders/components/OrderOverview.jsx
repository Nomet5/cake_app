// app/admin/orders/components/OrderOverview.jsx
'use client';

import { 
  AnimatedContainer,
  FloatingElement
} from '../../Components/animation-component';

export default function OrderOverview({ order }) {
  const stats = [
    {
      label: 'Товаров в заказе',
      value: order.items?.length || 0,
      icon: '📦',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Общая сумма',
      value: `${order.totalAmount} ₽`,
      icon: '💰',
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Стоимость доставки',
      value: `${order.deliveryFee} ₽`,
      icon: '🚚',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <AnimatedContainer
      animation="fadeInUp"
      delay={100}
      duration="normal"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          Обзор заказа
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <AnimatedContainer
              key={stat.label}
              animation="fadeInUp"
              delay={200 + (index * 100)}
              duration="normal"
            >
              <FloatingElement speed="normal">
                <div 
                  className={`
                    bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white
                    transform hover:scale-105 transition-transform duration-300
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="text-2xl opacity-90">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </AnimatedContainer>
  );
}