// app/admin/orders/components/OrderEditForm.js
'use client';

import { useState } from 'react';
import { AnimatedContainer, AnimatedCard, AnimatedButton } from '../../Components/animation-component';

export default function OrderEditForm({ order, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod || '',
    deliveryAddress: order.deliveryAddress,
    totalAmount: order.totalAmount,
    deliveryFee: order.deliveryFee,
    subtotal: order.subtotal,
    cancelReason: order.cancelReason || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deliveryAddress?.trim()) {
      newErrors.deliveryAddress = 'Адрес доставки обязателен';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Сумма должна быть больше 0';
    }

    if (formData.subtotal <= 0) {
      newErrors.subtotal = 'Стоимость товаров должна быть больше 0';
    }

    if (formData.deliveryFee < 0) {
      newErrors.deliveryFee = 'Стоимость доставки не может быть отрицательной';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Ожидание' },
    { value: 'CONFIRMED', label: 'Подтвержден' },
    { value: 'PREPARING', label: 'Готовится' },
    { value: 'READY', label: 'Готов' },
    { value: 'DELIVERED', label: 'Доставлен' },
    { value: 'CANCELLED', label: 'Отменен' }
  ];

  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Ожидает оплаты' },
    { value: 'PAID', label: 'Оплачен' },
    { value: 'FAILED', label: 'Ошибка оплаты' },
    { value: 'REFUNDED', label: 'Возврат' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Не указан' },
    { value: 'CARD', label: 'Карта' },
    { value: 'CASH', label: 'Наличные' },
    { value: 'ONLINE', label: 'Онлайн' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка - основная информация */}
        <div className="space-y-6">
          {/* Статусы */}
          <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статусы заказа</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус заказа
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус оплаты
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Способ оплаты
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paymentMethodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Адрес доставки */}
          <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Адрес доставки</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес доставки *
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryAddress ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Введите полный адрес доставки"
                />
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Правая колонка - стоимость */}
        <div className="space-y-6">
          {/* Стоимость */}
          <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Стоимость</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Стоимость товаров *
                  </label>
                  <input
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subtotal ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.subtotal && (
                    <p className="mt-1 text-sm text-red-600">{errors.subtotal}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Стоимость доставки
                  </label>
                  <input
                    type="number"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.deliveryFee ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.deliveryFee && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryFee}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Общая сумма *
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.totalAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Причина отмены */}
          {formData.status === 'CANCELLED' && (
            <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Причина отмены</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Причина отмены заказа
                  </label>
                  <textarea
                    name="cancelReason"
                    value={formData.cancelReason}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Укажите причину отмены заказа"
                  />
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Информация о заказе */}
          <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о заказе</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Номер заказа:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Клиент:</span>
                  <span className="font-medium">{order.user?.firstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Повар:</span>
                  <span className="font-medium">{order.chef?.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Товаров:</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Кнопки действий */}
      <AnimatedContainer animation="fadeInUp" delay={200} className="mt-8">
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <AnimatedButton
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Отмена
          </AnimatedButton>
          
          <AnimatedButton
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </AnimatedButton>
        </div>
      </AnimatedContainer>
    </form>
  );
}