// app/admin/settings/page.jsx
'use client'

import { useState } from 'react'
import { Save, Bell, Shield, Palette, Globe, Database, Users, Mail, CreditCard } from 'lucide-react'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // Общие настройки
    siteName: 'CakeApp',
    siteDescription: 'Платформа для заказа домашней выпечки',
    adminEmail: 'admin@cakeapp.ru',
    supportPhone: '+7 (999) 123-45-67',
    timezone: 'Europe/Moscow',
    
    // Уведомления
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    systemAlerts: true,
    
    // Безопасность
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordMinLength: 8,
    loginAttempts: 5,
    
    // Внешний вид
    theme: 'light',
    sidebarCollapsed: false,
    dashboardCards: 6,
    language: 'ru',
    
    // Управление пользователями
    userRegistration: true,
    emailVerification: true,
    autoApproveChefs: false,
    defaultUserRole: 'USER',
    
    // Уведомления по email
    smtpHost: 'smtp.cakeapp.ru',
    smtpPort: 587,
    smtpUsername: 'noreply@cakeapp.ru',
    smtpPassword: '********',
    
    // Платежи
    paymentGateway: 'yookassa',
    testMode: true,
    currency: 'RUB',
    taxRate: 20,
    
    // Система
    maintenanceMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily',
    logRetention: 30
  })

  const handleSave = async () => {
    try {
      console.log('Saving settings:', settings)
      // Здесь будет логика сохранения настроек
      alert('Настройки успешно сохранены!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Ошибка при сохранении настроек')
    }
  }

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const tabs = [
    { id: 'general', name: 'Общие', icon: Globe },
    { id: 'notifications', name: 'Уведомления', icon: Bell },
    { id: 'security', name: 'Безопасность', icon: Shield },
    { id: 'appearance', name: 'Внешний вид', icon: Palette },
    { id: 'users', name: 'Пользователи', icon: Users },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'payments', name: 'Платежи', icon: CreditCard },
    { id: 'system', name: 'Система', icon: Database }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Общие настройки</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название сайта
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email администратора
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание сайта
          </label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон поддержки
          </label>
          <input
            type="tel"
            value={settings.supportPhone}
            onChange={(e) => handleInputChange('supportPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Часовой пояс
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Europe/Moscow">Москва (UTC+3)</option>
            <option value="Europe/London">Лондон (UTC+0)</option>
            <option value="America/New_York">Нью-Йорк (UTC-5)</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Уведомления</h2>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email уведомления', description: 'Получать уведомления по email' },
          { key: 'pushNotifications', label: 'Push уведомления', description: 'Веб push уведомления в браузере' },
          { key: 'orderNotifications', label: 'Уведомления о заказах', description: 'Уведомления о новых заказах и изменениях' },
          { key: 'userNotifications', label: 'Уведомления о пользователях', description: 'Новые регистрации и активность' },
          { key: 'systemAlerts', label: 'Системные предупреждения', description: 'Критические ошибки и предупреждения' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => handleInputChange(item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Безопасность</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
          <div>
            <div className="font-medium text-gray-900">Двухфакторная аутентификация</div>
            <div className="text-sm text-gray-600">Требовать 2FA для доступа в админ-панель</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Таймаут сессии (минуты)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            min={5}
            max={480}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Минимальная длина пароля
          </label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
            min={6}
            max={20}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Максимум попыток входа
          </label>
          <input
            type="number"
            value={settings.loginAttempts}
            onChange={(e) => handleInputChange('loginAttempts', parseInt(e.target.value))}
            min={1}
            max={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Внешний вид</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тема интерфейса
          </label>
          <select
            value={settings.theme}
            onChange={(e) => handleInputChange('theme', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
            <option value="auto">Авто</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Язык интерфейса
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Карточек на дашборде
          </label>
          <input
            type="number"
            value={settings.dashboardCards}
            onChange={(e) => handleInputChange('dashboardCards', parseInt(e.target.value))}
            min={4}
            max={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
        <div>
          <div className="font-medium text-gray-900">Свернутая боковая панель</div>
          <div className="text-sm text-gray-600">Показывать боковую панель в свернутом виде</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.sidebarCollapsed}
            onChange={(e) => handleInputChange('sidebarCollapsed', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderUserSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Управление пользователями</h2>
      
      <div className="space-y-4">
        {[
          { key: 'userRegistration', label: 'Регистрация новых пользователей', description: 'Разрешить новым пользователям регистрироваться' },
          { key: 'emailVerification', label: 'Подтверждение email', description: 'Требовать подтверждение email при регистрации' },
          { key: 'autoApproveChefs', label: 'Авто-одобрение поваров', description: 'Автоматически одобрять заявки поваров' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => handleInputChange(item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Роль по умолчанию
          </label>
          <select
            value={settings.defaultUserRole}
            onChange={(e) => handleInputChange('defaultUserRole', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USER">Пользователь</option>
            <option value="CHEF">Повар</option>
            <option value="MODERATOR">Модератор</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'users':
        return renderUserSettings()
      case 'email':
        return <div>Email настройки</div>
      case 'payments':
        return <div>Настройки платежей</div>
      case 'system':
        return <div>Системные настройки</div>
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки системы</h1>
          <p className="text-gray-600 mt-2">Управление параметрами платформы CakeApp</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              {renderContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  <Save className="h-5 w-5" />
                  <span>Сохранить настройки</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}