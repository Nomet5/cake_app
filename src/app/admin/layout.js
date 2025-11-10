// src/app/admin/layout.js
"use client";
import "../globals.css";
import "./Components/animation-component";
import { useState, useEffect } from "react";
import AdminSidebar from "./Components/layout/admin-sidebar";
import AdminHeader from "./Components/layout/admin-header";
import AdminErrorBoundary from "./error-boundary";
import AdminBreadcrumbs from "./Components/layout/admin_breadcrumbs";
import AdminLoading from "./Components/ui/admin-loading";
import { NotificationBell } from "./Components/notificationBell";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // По умолчанию закрыт
  const [mounted, setMounted] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Симуляция реальной загрузки данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Обработчик для обновления счетчика уведомлений
  const handleNotificationsUpdate = (count) => {
    setNotificationsCount(count);
  };

  // Показываем красивый loading
  if (isLoading) {
    return <AdminLoading />;
  }

  if (!mounted) {
    return null;
  }

  return (
    <AdminErrorBoundary>
      {/* Основной контейнер с ограничением ширины */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 admin-transition animate-fade-in overflow-x-hidden">
        {/* Header с уведомлениями */}
        <AdminHeader
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          notificationsCount={notificationsCount}
        >
          <NotificationBell onNotificationsUpdate={handleNotificationsUpdate} />
        </AdminHeader>

        {/* Основной контент с ограничением по ширине */}
        <div className="flex transition-all duration-500 ease-in-out max-w-full">
          {/* Sidebar - теперь с улучшенным поведением */}
          <div
            className={`
            fixed lg:static inset-y-0 left-0 z-50
            transition-all duration-500 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <AdminSidebar
              isOpen={sidebarOpen}
              notificationsCount={notificationsCount}
            />
          </div>

          {/* Main Content с адаптивными отступами */}
          <main
            className={`
            flex-1 min-h-screen content-transition w-full
            transition-all duration-500 ease-in-out
            ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
            max-w-full overflow-hidden
          `}
          >
            {/* Контейнер с ограничением ширины и отступами */}
            <div className="p-4 lg:p-6 space-y-6 w-full max-w-full box-border">
              {/* Breadcrumbs */}
              <AdminBreadcrumbs />

              {/* Контент страницы с ограничением ширины */}
              <div className="w-full max-w-full overflow-x-hidden">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* FAB кнопка для мобильных устройств */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover-lift z-50 animate-bounce-slow hover-glow transition-all duration-300"
          aria-label="Переключить меню"
        >
          <svg
            className={`w-6 h-6 transition-all duration-500 ease-in-out ${
              sidebarOpen ? "rotate-90" : "rotate-0"
            } icon-animated`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Desktop toggle button - ИСПРАВЛЕННАЯ ВЕРСИЯ */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-6 lg:flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-600 rounded-full shadow-lg hover-lift z-40 hover:bg-white hover:shadow-xl transition-all duration-300 hover:border-blue-300/50"
          aria-label="Переключить меню"
        >
          <svg
            className={`w-5 h-5 transition-all duration-500 ease-in-out ${
              sidebarOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Плавающие элементы для украшения */}
        <div className="fixed top-1/4 left-10 w-4 h-4 bg-blue-300 rounded-full opacity-20 animate-float-slow pointer-events-none hidden lg:block"></div>
        <div className="fixed top-1/3 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-15 animate-float pointer-events-none hidden lg:block"></div>
        <div className="fixed bottom-1/4 left-1/4 w-3 h-3 bg-green-300 rounded-full opacity-25 animate-float-fast pointer-events-none hidden lg:block"></div>
      </div>
    </AdminErrorBoundary>
  );
}
