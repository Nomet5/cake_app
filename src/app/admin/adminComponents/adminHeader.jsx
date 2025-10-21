// components/AdminHeader.tsx
export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">🍰 Cake App Admin</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Администратор</span>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
            Выйти
          </button>
        </div>
      </div>
    </header>
  )
}