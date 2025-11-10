// app/admin/orders/components/OrderChefInfo.js
'use client';

import { AnimatedContainer, AnimatedCard } from '../../Components/animation-component';

export default function OrderChefInfo({ chef }) {
  const chefUser = chef?.user || {};

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Повар / Ресторан
        </h2>

        <div className="space-y-4">
          <AnimatedContainer animation="fadeInUp" delay={50}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {chef.businessName?.charAt(0) || chefUser.firstName?.charAt(0) || 'П'}
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">
                  {chef.businessName || 'Не указано'}
                </h3>
                {chefUser.firstName && (
                  <p className="text-sm text-gray-500">Владелец: {chefUser.firstName}</p>
                )}
              </div>
            </div>
          </AnimatedContainer>

          {chefUser.email && (
            <AnimatedContainer animation="fadeInUp" delay={100}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email</span>
                <a 
                  href={`mailto:${chefUser.email}`}
                  className="font-medium text-blue-600 hover:text-blue-700 text-sm"
                >
                  {chefUser.email}
                </a>
              </div>
            </AnimatedContainer>
          )}

          {chefUser.phone && (
            <AnimatedContainer animation="fadeInUp" delay={150}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Телефон</span>
                <a 
                  href={`tel:${chefUser.phone}`}
                  className="font-medium text-gray-900 text-sm"
                >
                  {chefUser.phone}
                </a>
              </div>
            </AnimatedContainer>
          )}

          <AnimatedContainer animation="fadeInUp" delay={200}>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ID повара</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {chef.id}
              </span>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedCard>
  );
}