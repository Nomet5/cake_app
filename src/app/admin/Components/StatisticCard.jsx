// src/app/admin/components/StatCard.jsx
export default function StatCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 ${colorClasses[color]} rounded-full`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}