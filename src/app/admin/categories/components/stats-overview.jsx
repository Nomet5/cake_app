'use client';

const StatCard = ({ stat, index }) => {
  const staggerDelay = `stagger-${index + 1}`;
  
  return (
    <div className={`
      bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 
      hover-lift hover-glow animate-fade-in ${staggerDelay}
    `}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`
            h-12 w-12 rounded-xl flex items-center justify-center 
            transition-all duration-500 hover:scale-110 ${stat.color}
          `}>
            <stat.icon className="h-6 w-6 text-white animate-bounce-soft" />
          </div>
          <div className="ml-5 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">
                {stat.value}
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-progress" />
      </div>
    </div>
  );
};

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      name: 'Всего категорий',
      value: stats.total,
      color: 'bg-blue-500 shadow-blue-200',
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Активных',
      value: stats.active,
      color: 'bg-green-500 shadow-green-200',
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Неактивных',
      value: stats.inactive,
      color: 'bg-red-500 shadow-red-200',
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'С товарами',
      value: stats.withProducts,
      color: 'bg-purple-500 shadow-purple-200',
      icon: ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <StatCard key={stat.name} stat={stat} index={index} />
      ))}
    </div>
  );
}