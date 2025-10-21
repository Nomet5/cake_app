import AdminHeader from "./adminComponents/adminHeader";
import AdminSidebar from "./adminComponents/adminSideBar";


export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex">
            
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
