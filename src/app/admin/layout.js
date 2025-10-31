// src/app/admin/layout.js
"use client";
import "../globals.css";
import "./Components/animation-component"; // Подключаем анимации
import { useState, useEffect } from 'react';
import AdminSidebar from "./Components/layout/admin-sidebar";
import AdminHeader from "./Components/layout/admin-header";
import AdminErrorBoundary from "./error-boundary";
import AdminBreadcrumbs from "./Components/layout/admin_breadcrumbs";
import AdminLoading from "./Components/ui/admin-loading";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Симуляция реальной загрузки данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Увеличиваем время для демонстрации анимаций

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        <AdminHeader onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <div className="flex transition-all duration-500 ease-in-out">
          <div className={`
            sidebar-transition
            ${sidebarOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0'}
            ${sidebarOpen ? 'animate-slide-in-left' : ''}
          `}>
            <AdminSidebar isOpen={sidebarOpen} />
          </div>
          
          <main className={`
            flex-1 min-h-screen content-transition
            ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}
            animate-fade-in-up
          `}>
            <div className="p-6 space-y-6">
              <div className="animate-scale-in">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* FAB кнопка */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover-lift z-50 animate-bounce-slow hover-glow"
          aria-label="Переключить меню"
        >
          <svg 
            className={`w-6 h-6 transition-all duration-500 ease-in-out ${
              sidebarOpen ? 'rotate-180' : 'rotate-0'
            } icon-animated`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </AdminErrorBoundary>
  );
}