'use client';

const StatItem = ({ label, value, icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white transition-all duration-300 hover-lift">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]} mr-3 transition-all duration-300 hover:scale-110`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
      
      {trend && (
        <span className={`text-sm font-medium ${
          trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  );
};

export default function CategoryStats({ category }) {
  const stats = [
    {
      label: 'Всего товаров',
      value: category._count?.products || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      label: 'Активных товаров',
      value: category.products?.filter(p => p.isAvailable)?.length || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      label: 'Средняя цена',
      value: category.products?.length 
        ? `${Math.round(category.products.reduce((sum, p) => sum + (p.price || 0), 0) / category.products.length).toLocaleString('ru-RU')} ₽`
        : '0 ₽',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'purple'
    },
    {
      label: 'Всего заказов',
      value: category.products?.reduce((sum, p) => sum + (p._count?.orderItems || 0), 0) || 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'orange'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика категории</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className={`animate-fade-in stagger-${index + 1}`}>
            <StatItem {...stat} />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Дата обновления:</span>
          <span className="text-gray-900 font-medium">
            {new Date(category.updatedAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </div>
  );
}