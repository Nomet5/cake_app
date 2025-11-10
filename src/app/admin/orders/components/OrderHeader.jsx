// app/admin/orders/components/OrderHeader.js
'use client';

import { AnimatedContainer } from '../../Components/animation-component';
import BackButton from '../../Components/back-button'; // Изменено с { Back_Button } на BackButton

export default function OrderHeader({ order, onBack }) {
  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      PREPARING: 'bg-orange-100 text-orange-800 border-orange-200',
      READY: 'bg-green-100 text-green-800 border-green-200',
      DELIVERED: 'bg-gray-100 text-gray-800 border-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Ожидание',
      CONFIRMED: 'Подтвержден',
      PREPARING: 'Готовится',
      READY: 'Готов',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменен'
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.PENDING;
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      PENDING: 'Ожидает оплаты',
      PAID: 'Оплачен',
      FAILED: 'Ошибка оплаты',
      REFUNDED: 'Возврат'
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      CARD: 'Карта',
      CASH: 'Наличные',
      ONLINE: 'Онлайн',
    };
    return methods[method] || method;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <AnimatedContainer animation="fadeInDown" duration="normal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div onClick={onBack} className="cursor-pointer">
            <BackButton />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Создан: {formatDate(order.createdAt)}
            </p>
            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <p className="text-gray-500 text-sm">
                Обновлен: {formatDate(order.updatedAt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {getPaymentStatusText(order.paymentStatus)}
            </span>
            {order.paymentMethod && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {getPaymentMethodText(order.paymentMethod)}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {order.totalAmount?.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-sm text-gray-500">
              {order.items?.length || 0} товаров
            </p>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
}