// app/admin/orders/[id]/edit/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById, updateOrder } from '../../../../actions/admin/order.actions';
import OrderEditForm from '../../components/OrderEditForm';
import { AnimatedContainer } from '../../../Components/animation-component';

export default function OrderEditPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!params?.id) {
          setError('ID заказа не указан');
          return;
        }

        const id = parseInt(params.id);
        
        if (isNaN(id)) {
          setError(`Неверный формат ID: ${params.id}`);
          return;
        }

        const result = await getOrderById(id);
        
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setOrder(result.order);
        } else {
          setError('Неизвестная ошибка при загрузке заказа');
        }
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Ошибка загрузки заказа');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params?.id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const result = await updateOrder(order.id, formData);
      
      if (result.success) {
        router.push(`/admin/orders/${order.id}`);
        router.refresh();
      } else {
        setError(result.error || 'Ошибка при сохранении заказа');
      }
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Ошибка сохранения заказа');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/orders/${order.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="loader-dots inline-block mb-4">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <p className="text-gray-600">Загрузка заказа...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Ошибка загрузки заказа
              </h2>
              
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              
              <button
                onClick={() => router.push('/admin/orders')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Вернуться к списку заказов
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContainer animation="fadeInDown" duration="normal">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад к заказу
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Редактирование заказа {order.orderNumber}
                </h1>
                <p className="text-gray-500 text-sm">
                  Измените необходимые поля и сохраните изменения
                </p>
              </div>
            </div>
          </div>

          {/* Форма редактирования */}
          <OrderEditForm 
            order={order}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
          />
        </AnimatedContainer>
      </div>
    </div>
  );
}