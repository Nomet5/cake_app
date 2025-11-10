// app/admin/orders/components/OrderActions.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  updateOrderStatus, 
  updateOrderPaymentStatus,
  cancelOrder 
} from '../../../lib/actions/order.actions';
import { AnimatedContainer, AnimatedCard, AnimatedButton } from '../../Components/animation-component';

export default function OrderActions({ order }) {
  const [loading, setLoading] = useState('');
  const router = useRouter();

  const handleStatusUpdate = async (newStatus) => {
    setLoading(newStatus);
    
    try {
      const result = await updateOrderStatus(order.id, newStatus);
      
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Произошла ошибка при обновлении статуса');
    } finally {
      setLoading('');
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    setLoading(`payment_${newPaymentStatus}`);
    
    try {
      const result = await updateOrderPaymentStatus(order.id, newPaymentStatus);
      
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Ошибка при обновлении статуса оплаты');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Произошла ошибка при обновлении статуса оплаты');
    } finally {
      setLoading('');
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Вы уверены, что хотите отменить этот заказ?')) {
      return;
    }

    setLoading('cancel');
    
    try {
      const result = await cancelOrder(order.id);
      
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Ошибка при отмене заказа');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Произошла ошибка при отмене заказа');
    } finally {
      setLoading('');
    }
  };

  const getAvailableActions = () => {
    const statusActions = {
      PENDING: [
        { id: 'CONFIRMED', label: 'Подтвердить заказ', variant: 'success', icon: '✅' },
        { id: 'CANCELLED', label: 'Отменить заказ', variant: 'danger', icon: '❌' },
      ],
      CONFIRMED: [
        { id: 'PREPARING', label: 'Начать готовить', variant: 'primary', icon: '👨‍🍳' },
        { id: 'CANCELLED', label: 'Отменить заказ', variant: 'danger', icon: '❌' },
      ],
      PREPARING: [
        { id: 'READY', label: 'Заказ готов', variant: 'success', icon: '🎉' },
        { id: 'CANCELLED', label: 'Отменить заказ', variant: 'danger', icon: '❌' },
      ],
      READY: [
        { id: 'DELIVERED', label: 'Отметить доставленным', variant: 'success', icon: '🚚' },
      ],
      DELIVERED: [],
      CANCELLED: [
        { id: 'PENDING', label: 'Восстановить заказ', variant: 'primary', icon: '↩️' },
      ]
    };

    return statusActions[order.status] || [];
  };

  const getPaymentActions = () => {
    if (order.paymentStatus === 'PAID') {
      return [
        { id: 'REFUNDED', label: 'Возврат средств', variant: 'secondary', icon: '💸' },
      ];
    }

    if (order.paymentStatus === 'PENDING') {
      return [
        { id: 'PAID', label: 'Отметить оплаченным', variant: 'success', icon: '💰' },
        { id: 'FAILED', label: 'Отметить ошибкой оплаты', variant: 'danger', icon: '❌' },
      ];
    }

    if (order.paymentStatus === 'FAILED') {
      return [
        { id: 'PAID', label: 'Отметить оплаченным', variant: 'success', icon: '💰' },
      ];
    }

    return [];
  };

  const statusActions = getAvailableActions();
  const paymentActions = getPaymentActions();

  return (
    <AnimatedCard className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Действия
        </h2>

        {/* Статус заказа */}
        {statusActions.length > 0 && (
          <div className="space-y-3 mb-4">
            <h3 className="font-medium text-gray-900 text-sm">Статус заказа</h3>
            {statusActions.map((action, index) => (
              <AnimatedContainer 
                key={action.id}
                animation="fadeInUp" 
                delay={index * 100}
              >
                <AnimatedButton
                  variant={action.variant}
                  size="md"
                  loading={loading === action.id}
                  disabled={!!loading}
                  onClick={() => handleStatusUpdate(action.id)}
                  className="w-full justify-center gap-2"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </AnimatedButton>
              </AnimatedContainer>
            ))}
          </div>
        )}

        {/* Статус оплаты */}
        {paymentActions.length > 0 && (
          <div className="space-y-3 mb-4">
            <h3 className="font-medium text-gray-900 text-sm">Статус оплаты</h3>
            {paymentActions.map((action, index) => (
              <AnimatedContainer 
                key={action.id}
                animation="fadeInUp" 
                delay={index * 100 + 200}
              >
                <AnimatedButton
                  variant={action.variant}
                  size="md"
                  loading={loading === `payment_${action.id}`}
                  disabled={!!loading}
                  onClick={() => handlePaymentStatusUpdate(action.id)}
                  className="w-full justify-center gap-2"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </AnimatedButton>
              </AnimatedContainer>
            ))}
          </div>
        )}

        {/* Дополнительные действия */}
        <AnimatedContainer animation="fadeInUp" delay={400}>
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <AnimatedButton
              variant="secondary"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => window.print()}
            >
              <span>🖨️</span>
              Печать чека
            </AnimatedButton>

            {order.status !== 'CANCELLED' && (
              <AnimatedButton
                variant="ghost"
                size="sm"
                loading={loading === 'cancel'}
                disabled={!!loading}
                className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                onClick={handleCancelOrder}
              >
                <span>❌</span>
                Отменить заказ
              </AnimatedButton>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedCard>
  );
}