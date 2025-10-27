export default function ChefProfile({ chef }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <img 
          src={chef.avatar || '/default-avatar.png'} 
          alt={chef.name}
          className="h-24 w-24 rounded-full object-cover mb-4 border-4 border-gray-100"
        />
        <h2 className="text-xl font-bold text-gray-900">{chef.name}</h2>
        <p className="text-gray-600">{chef.specialization}</p>
        <div className="flex items-center mt-1">
          <span className="text-sm text-gray-900 mr-1">{chef.rating}</span>
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Email:</span>
          <span className="text-sm text-gray-900">{chef.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Телефон:</span>
          <span className="text-sm text-gray-900">{chef.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Опыт:</span>
          <span className="text-sm text-gray-900">{chef.experience}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Статус:</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            chef.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {chef.status === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Дата регистрации:</span>
          <span className="text-sm text-gray-900">
            {new Date(chef.joinedAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>

      {chef.description && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-2">О поваре:</h3>
          <p className="text-sm text-gray-700">{chef.description}</p>
        </div>
      )}
    </div>
  )
}