// app/admin/users/[id]/page.js
import { getUserById } from "../../../actions/admin/user.actions";
import { notFound } from "next/navigation";
import UserProfile from "./components/user-profile";
import UserStats from "./components/user-stats";
import UserActivity from "./components/user-activity";
import UserOrders from "./components/user-orders";
import BackButton from "../components/back-button";
import UserActions from "../components/user-actions";

export default async function UserDetailPage({ params }) {
  const id = parseInt(params.id);
  const result = await getUserById(id);

  if (!result.success) {
    notFound();
  }

  const { user } = result;

  return (
    <div className="p-6 space-y-6 admin-transition">
      {/* Шапка с анимациями */}
      <div className="flex justify-between items-center animate-fade-in">
        <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
          <BackButton />
        </div>
        <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <UserActions user={user} />
        </div>
      </div>

      {/* Основной контент с сеткой */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="lg:col-span-1 space-y-6">
          {/* Профиль пользователя с анимацией */}
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <UserProfile user={user} />
          </div>
          
          {/* Статистика с анимацией */}
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <UserStats user={user} />
          </div>
        </div>
        
        {/* Правая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Активность с анимацией */}
          <div className="animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
            <UserActivity user={user} />
          </div>
          
          {/* Заказы с анимацией */}
          <div className="animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            <UserOrders user={user} />
          </div>

          {/* Дополнительная информация если есть заказы */}
          {user.orders && user.orders.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 animate-pulse">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Всего заказов: <span className="font-bold">{user.orders.length}</span>
                  </p>
                  <p className="text-xs text-blue-600">
                    Последний заказ: {new Date(user.orders[0].createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Сообщение если нет заказов */}
          {(!user.orders || user.orders.length === 0) && (
            <div className="text-center py-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заказов</h3>
              <p className="text-gray-500">У этого пользователя пока нет заказов</p>
            </div>
          )}
        </div>
      </div>

      {/* Информация о датах создания/обновления */}
      <div className="border-t border-gray-200 pt-6 mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center p-3 bg-gray-50 rounded-lg hover-lift">
            <p className="font-medium text-gray-900">Дата регистрации</p>
            <p className="text-blue-600 font-semibold">
              {new Date(user.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg hover-lift">
            <p className="font-medium text-gray-900">Последнее обновление</p>
            <p className="text-green-600 font-semibold">
              {new Date(user.updatedAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg hover-lift">
            <p className="font-medium text-gray-900">Статус аккаунта</p>
            <p className={`font-semibold ${user.chefProfile ? 'text-green-600' : 'text-blue-600'}`}>
              {user.chefProfile ? 'Активный повар' : 'Активный клиент'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}