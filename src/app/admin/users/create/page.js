// app/admin/users/create/page.tsx
"use client";

import { createUser } from "../../../actions/admin/user.actions";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Начальное состояние
const initialState = {
  success: false,
  error: "",
  message: "",
  userId: 0,
};

export default function CreateUserPage() {
  const [state, formAction, isPending] = useActionState(createUser, initialState);
  const router = useRouter();

  // Редирект при успешном создании
  useEffect(() => {
    if (state.success) {
      console.log("✅ Пользователь успешно создан:", {
        userId: state.userId,
        message: state.message
      });
      
      // Показываем сообщение об успехе на 2 секунды, затем редирект
      const timer = setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.message, state.userId, router]);

  // Логируем ошибки в консоль - УПРОЩЕННАЯ ВЕРСИЯ
  useEffect(() => {
    if (state.error) {
      console.error("❌ Ошибка создания пользователя:", state.error);
    }
  }, [state.error]);

  return (
    <div className="admin-transition">
      {/* Заголовок и кнопка назад с анимациями */}
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Создать пользователя
          </h2>
          <p className="text-gray-600 mt-2 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            Добавьте нового пользователя в систему
          </p>
        </div>
        <Link 
          href="/admin/users" 
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 hover-lift shadow-md flex items-center group animate-scale-in"
          style={{ animationDelay: '0.2s' }}
        >
          <svg 
            className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад к списку
        </Link>
      </div>

      {/* Баннер успеха */}
      {state.success && (
        <div className="mb-6 animate-fade-in">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Успешно!</h3>
                <p className="text-sm text-green-600">
                  {state.message || "Пользователь успешно создан"}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  Перенаправление к списку пользователей...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Баннер ошибки */}
      {state.error && !state.success && (
        <div className="mb-6 animate-fade-in">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Ошибка создания пользователя</h3>
                <p className="text-sm text-red-600">
                  {state.error}
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Проверьте введенные данные и попробуйте снова
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Информационная карточка */}
      {!state.success && (
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Новый пользователь</h3>
                <p className="text-sm text-gray-600">
                  Заполните все обязательные поля для создания учетной записи
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Основная форма с анимациями */}
      {!state.success && (
        <div className="bg-white rounded-xl shadow-lg border p-6 max-w-md animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <form action={formAction} className="space-y-6">
            {/* Поле Email с анимацией */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Email *
              </label>
              <input 
                type="email" 
                name="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift" 
                placeholder="user@example.com"
                required 
              />
              <p className="text-xs text-gray-500 mt-1">Будет использоваться для входа в систему</p>
            </div>
            
            {/* Поле Имя с анимацией */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Имя *
              </label>
              <input 
                type="text" 
                name="firstName" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift" 
                placeholder="Введите имя пользователя"
                required 
              />
            </div>

            {/* Поле Пароль с анимацией */}
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Пароль *
              </label>
              <input 
                type="password" 
                name="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift" 
                placeholder="Минимум 6 символов"
                required 
                minLength={6}
              />
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <svg className="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Пароль должен содержать минимум 6 символов
              </div>
            </div>
            
            {/* Поле Телефон с анимацией */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input 
                type="tel" 
                name="phone" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover-lift" 
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>

            {/* Разделитель */}
            <div className="border-t border-gray-200 pt-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="text-sm text-gray-500 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Поля помеченные * обязательны для заполнения
              </div>
            </div>
            
            {/* Кнопка создания с анимацией */}
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg transition-all duration-300 hover-lift shadow-lg font-medium flex items-center justify-center group animate-fade-in ${
                isPending 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-blue-700 hover:to-purple-700'
              }`}
              style={{ animationDelay: '1s' }}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Создание...
                </>
              ) : (
                <>
                  <svg 
                    className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Создать пользователя
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Дополнительная информация */}
      {!state.success && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover-lift">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Безопасность</p>
                <p className="text-xs text-gray-600">Пароль хранится в зашифрованном виде</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover-lift">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Автоматизация</p>
                <p className="text-xs text-gray-600">Пользователь получит стандартные настройки</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}