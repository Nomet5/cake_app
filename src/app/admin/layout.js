// src/app/admin/layout.js
"use client";

import { useState, useEffect } from 'react';
import AdminSidebar from "./Components/layout/admin-sidebar";
import AdminHeader from "./Components/layout/admin-header";
import AdminErrorBoundary from "./error-boundary";
import AdminBreadcrumbs from "./Components/layout/admin_breadcrumbs";

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Симуляция загрузки начальных данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-2">
            Загрузка админ-панели
          </h2>
          <p className="text-gray-600 animate-pulse">
            Подготовка данных...
          </p>
          <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 admin-transition">
        <AdminHeader onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="flex transition-all duration-500 ease-in-out">
          <div className={`
            transition-all duration-500 ease-in-out
            ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
          `}>
            <AdminSidebar isOpen={sidebarOpen} />
          </div>
          <main className={`
            flex-1 min-h-screen transition-all duration-500 ease-in-out
            ${sidebarOpen ? 'ml-0' : 'ml-0'}
            animate-fade-in
          `}>
            <div className="p-6 space-y-6">
              {/* <AdminBreadcrumbs /> */}
              <div className="animate-scale-in">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Floating Action Button для мобильных устройств */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover-lift transition-all duration-300 z-50 animate-bounce-slow"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Overlay для мобильных устройств */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-500 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </AdminErrorBoundary>
  );
}