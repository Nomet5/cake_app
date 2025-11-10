// app/admin/orders/components/OrderDeliveryInfo.js
'use client';

import { AnimatedContainer, AnimatedCard } from '../../Components/animation-component';

export default function OrderDeliveryInfo({ deliveryAddress, delivery }) {
  const getDeliveryStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-orange-100 text-orange-800',
      ON_THE_WAY: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.PENDING;
  };

  const getDeliveryStatusText = (status) => {
    const texts = {
      PENDING: 'Ожидание',
      ASSIGNED: 'Назначен',
      PICKED_UP: 'Забран',
      ON_THE_WAY: 'В пути',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменен'
    };
    return texts[status] || status;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Доставка
        </h2>

        <div className="space-y-4">
          {delivery?.status && (
            <AnimatedContainer animation="fadeInUp" delay={50}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Статус доставки</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryStatusColor(delivery.status)}`}>
                  {getDeliveryStatusText(delivery.status)}
                </span>
              </div>
            </AnimatedContainer>
          )}

          {deliveryAddress && (
            <AnimatedContainer animation="fadeInUp" delay={100}>
              <div>
                <span className="text-gray-600 block mb-2">Адрес доставки</span>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium text-gray-900">
                    {deliveryAddress}
                  </p>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {delivery?.estimatedDeliveryTime && (
            <AnimatedContainer animation="fadeInUp" delay={150}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Примерное время</span>
                <span className="font-medium text-gray-900 text-sm">
                  {formatDateTime(delivery.estimatedDeliveryTime)}
                </span>
              </div>
            </AnimatedContainer>
          )}

          {delivery?.actualDeliveryTime && (
            <AnimatedContainer animation="fadeInUp" delay={200}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Фактическое время</span>
                <span className="font-medium text-gray-900 text-sm">
                  {formatDateTime(delivery.actualDeliveryTime)}
                </span>
              </div>
            </AnimatedContainer>
          )}

          {delivery?.deliveryNotes && (
            <AnimatedContainer animation="fadeInUp" delay={250}>
              <div>
                <span className="text-gray-600 block mb-2">Примечания</span>
                <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                  {delivery.deliveryNotes}
                </p>
              </div>
            </AnimatedContainer>
          )}

          {delivery?.deliveryDriver && (
            <AnimatedContainer animation="fadeInUp" delay={300}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Курьер</span>
                <span className="font-medium text-gray-900">
                  {delivery.deliveryDriver}
                </span>
              </div>
            </AnimatedContainer>
          )}

          {delivery?.trackingNumber && (
            <AnimatedContainer animation="fadeInUp" delay={350}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Трек номер</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {delivery.trackingNumber}
                </span>
              </div>
            </AnimatedContainer>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
}