import AdminSidebar from "./Components/adminSideBar";
import AdminHeader from "./Components/adminHeader";

// src/app/admin/layout.js
export default function AdminLayout({ children }) {
  return (
    // Не используйте html/body здесь, они уже в корневом layout
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}