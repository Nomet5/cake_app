// app/admin/orders/components/OrderCustomerInfo.js
'use client';

import { AnimatedContainer, AnimatedCard } from '../../Components/animation-component';

export default function OrderCustomerInfo({ user }) {
  const addresses = user?.addresses || [];
  const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Информация о клиенте
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedContainer animation="fadeInUp" delay={50}>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Контактные данные</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Имя:</span>
                  <span className="font-medium">{user?.firstName || 'Не указано'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  {user?.email ? (
                    <a 
                      href={`mailto:${user.email}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {user.email}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-500">Не указан</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Телефон:</span>
                  {user?.phone ? (
                    <a 
                      href={`tel:${user.phone}`}
                      className="font-medium text-gray-900"
                    >
                      {user.phone}
                    </a>
                  ) : (
                    <span className="font-medium text-gray-500">Не указан</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID пользователя:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {user?.id || 'Гость'}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContainer>

          <AnimatedContainer animation="fadeInUp" delay={100}>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Адрес</h3>
              {primaryAddress ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-gray-900">
                    {primaryAddress.street}
                    {primaryAddress.apartment && `, кв. ${primaryAddress.apartment}`}
                  </p>
                  {primaryAddress.city && (
                    <p className="text-sm text-gray-600">{primaryAddress.city}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {primaryAddress.entrance && (
                      <div>Подъезд: {primaryAddress.entrance}</div>
                    )}
                    {primaryAddress.floor && (
                      <div>Этаж: {primaryAddress.floor}</div>
                    )}
                    {primaryAddress.intercom && (
                      <div className="col-span-2">Домофон: {primaryAddress.intercom}</div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Адрес не указан</p>
              )}
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </AnimatedCard>
  );
}