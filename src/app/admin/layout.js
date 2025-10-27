// src/app/admin/layout.js
"use client";

import AdminSidebar from "./Components/layout/admin-sidebar";
import AdminHeader from "./Components/layout/admin-header";
import AdminErrorBoundary from "./Components/layout/error-boundary";
import AdminBreadcrumbs from "./Components/layout/admin_breadcrumbs";

export default function AdminLayout({ children }) {
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {/* <AdminBreadcrumbs /> */}
            {children}
          </main>
        </div>
      </div>
    </AdminErrorBoundary>
  );
}
