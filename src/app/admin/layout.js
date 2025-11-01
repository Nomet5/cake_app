// src/app/admin/layout.js
"use client";
import "../globals.css";
import "./Components/animation-component"; 
import { useState, useEffect } from 'react';
import AdminSidebar from "./Components/layout/admin-sidebar";
import AdminHeader from "./Components/layout/admin-header";
import AdminErrorBoundary from "./error-boundary";
import AdminBreadcrumbs from "./Components/layout/admin_breadcrumbs"; // Исправлен импорт
import AdminLoading from "./Components/ui/admin-loading";
import { NotificationBell } from "./Components/notification";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 admin-transition animate-fade-in">
        {/* Header с уведомлениями */}
        <AdminHeader 
          onToggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          notificationsCount={notificationsCount}
        >
          <NotificationBell onNotificationsUpdate={handleNotificationsUpdate} />
        </AdminHeader>
        
        <div className="flex transition-all duration-500 ease-in-out">
          {/* Sidebar */}
          <div className={`
            sidebar-transition fixed lg:static inset-y-0 left-0 z-30
            ${sidebarOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100 lg:w-20'}
            ${sidebarOpen ? 'animate-slide-in-left' : ''}
            bg-white shadow-xl lg:shadow-none
          `}>
            <AdminSidebar 
              isOpen={sidebarOpen} 
              notificationsCount={notificationsCount}
            />
          </div>
          
          {/* Main Content */}
          <main className={`
            flex-1 min-h-screen content-transition
            ${sidebarOpen ? 'lg:ml-0' : 'ml-0 lg:ml-20'}
            transition-all duration-500 ease-in-out
          `}>
            <div className="p-4 lg:p-6 space-y-6">
              {/* Breadcrumbs - теперь подключены */}
              <AdminBreadcrumbs />
              
              {/* Контент страницы с анимациями */}
              <div className="animate-fade-in-up">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* FAB кнопка для мобильных устройств */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover-lift z-40 animate-bounce-slow hover-glow transition-all duration-300"
          aria-label="Переключить меню"
        >
          <svg 
            className={`w-6 h-6 transition-all duration-500 ease-in-out ${
              sidebarOpen ? 'rotate-90' : 'rotate-0'
            } icon-animated`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Плавающие элементы для украшения */}
        <div className="fixed top-1/4 left-10 w-4 h-4 bg-blue-300 rounded-full opacity-20 animate-float-slow pointer-events-none"></div>
        <div className="fixed top-1/3 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-15 animate-float pointer-events-none"></div>
        <div className="fixed bottom-1/4 left-1/4 w-3 h-3 bg-green-300 rounded-full opacity-25 animate-float-fast pointer-events-none"></div>
      </div>
    </AdminErrorBoundary>
  );
}