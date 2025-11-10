// src/app/admin/profile/page.jsx
'use client'

import { useState } from 'react'
import { AnimatedContainer, AnimatedCard, AnimatedButton } from '../Components/animation-component'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  Settings,
  Key,
  Eye,
  EyeOff,
  Save,
  Edit,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Данные профиля
  const [profileData, setProfileData] = useState({
    // Основная информация
    firstName: 'Александр',
    lastName: 'Иванов',
    email: 'admin@cakeapp.ru',
    phone: '+7 (999) 123-45-67',
    position: 'Главный администратор',
    department: 'Техническая поддержка',
    
    // Контактная информация
    address: 'г. Москва, ул. Примерная, д. 123',
    birthDate: '15.03.1985',
    
    // Настройки безопасности
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Настройки уведомлений
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    securityAlerts: true
  })

  const handleSave = () => {
    setIsEditing(false)
    // Здесь будет логика сохранения данных
    console.log('Сохранение данных:', profileData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Сброс данных (в реальном приложении - загрузка из БД)
  }

  const tabs = [
    { id: 'general', label: 'Основная информация', icon: User },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'preferences', label: 'Настройки', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <AnimatedContainer animation="fadeInUp" className="max-w-6xl mx-auto">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200/50">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Профиль администратора
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Управление личными данными и настройками аккаунта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Боковая панель */}
          <AnimatedCard className="lg:col-span-1 p-6">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Статистика активности */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Статистика активности</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">В системе:</span>
                  <span className="font-medium">2 года 3 мес</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Последний вход:</span>
                  <span className="font-medium">Сегодня, 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Активность:</span>
                  <span className="font-medium text-green-600">Высокая</span>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Основной контент */}
          <div className="lg:col-span-3">
            <AnimatedCard className="p-6">
              {/* Заголовок с кнопками действий */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                {activeTab === 'general' && (
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <AnimatedButton
                          variant="secondary"
                          onClick={handleCancel}
                        >
                          Отмена
                        </AnimatedButton>
                        <AnimatedButton
                          onClick={handleSave}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Сохранить
                        </AnimatedButton>
                      </>
                    ) : (
                      <AnimatedButton
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Редактировать
                      </AnimatedButton>
                    )}
                  </div>
                )}
              </div>

              {/* Содержимое вкладок */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Аватар и основная информация */}
                  <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        АИ
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
                      <p className="text-gray-600">{profileData.position}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Активный
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Shield className="w-4 h-4" />
                          Администратор
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Форма редактирования */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Должность
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Отдел
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Адрес
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Дата рождения
                      </label>
                      <input
                        type="text"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Безопасность аккаунта</h4>
                        <p className="text-sm text-yellow-700">Рекомендуем регулярно менять пароль</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Текущий пароль
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Подтверждение пароля
                      </label>
                      <input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <AnimatedButton className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Сменить пароль
                    </AnimatedButton>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Email уведомления</h4>
                      <p className="text-sm text-gray-600">Получать уведомления на почту</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.emailNotifications}
                        onChange={(e) => setProfileData({...profileData, emailNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Другие настройки уведомлений... */}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">Настройки интерфейса</h4>
                    <p className="text-sm text-blue-700">Настройте внешний вид панели управления под себя</p>
                  </div>
                  
                  {/* Настройки темы, языка и т.д. */}
                </div>
              )}
            </AnimatedCard>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  )
}