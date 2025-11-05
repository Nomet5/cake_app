'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateChef } from "../../../actions/admin/chef.actions"
import ChefImageUpload from "./chef-image-upload"
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
  AnimatedCard,
  SubtleHover
} from "../../../admin/Components/animation-component"

export default function EditChefForm({ chef }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: chef.name || '',
    email: chef.email || '',
    phone: chef.phone || '',
    specialization: chef.specialization || '',
    experience: chef.experience || '',
    status: chef.status || 'active',
    description: chef.description || '',
    address: chef.address || '',
    avatar: chef.avatar || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateChef(chef.id, formData)
      
      if (result.success) {
        router.push(`/admin/chefs/${chef.id}`)
        router.refresh()
      } else {
        alert(`Ошибка: ${result.error}`)
      }
    } catch (error) {
      alert('Произошла ошибка при сохранении')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: imageUrl
    }))
  }

  const handleCancel = () => {
    router.back()
  }

  const getInputClasses = (fieldName) => {
    return `
      w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300
    `
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-50 border-green-200',
      inactive: 'text-gray-600 bg-gray-50 border-gray-200',
      pending: 'text-orange-600 bg-orange-50 border-orange-200',
      banned: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[status] || colors.active
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto"
    >
      {/* Заголовок формы */}
      <div className="text-center mb-8">
        <FloatingElement speed="slow">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">👨‍🍳</span>
          </div>
        </FloatingElement>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Редактирование повара</h1>
        <p className="text-gray-600">Обновите информацию о поваре</p>
        
        {/* Статус повара */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 mt-3 ${getStatusColor(chef.status)}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            chef.status === 'active' ? 'bg-green-500' :
            chef.status === 'inactive' ? 'bg-gray-500' :
            chef.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {chef.status === 'active' ? 'Активен' :
             chef.status === 'inactive' ? 'Неактивен' :
             chef.status === 'pending' ? 'На проверке' : 'Заблокирован'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></div>
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Аватар */}
              <div className="lg:col-span-1">
                <SubtleHover>
                  <ChefImageUpload 
                    currentImage={formData.avatar}
                    onImageChange={handleImageChange}
                    chefName={formData.name}
                  />
                </SubtleHover>
              </div>
              
              {/* Основные поля */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Имя повара *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={getInputClasses('name')}
                    placeholder="Введите имя повара"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={getInputClasses('email')}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="specialization" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Специализация *
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className={getInputClasses('specialization')}
                    placeholder="Например: Итальянская кухня"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Контактная информация */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Контактная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={getInputClasses('phone')}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label htmlFor="experience" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Опыт работы
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={getInputClasses('experience')}
                >
                  <option value="">Выберите опыт</option>
                  <option value="Менее 1 года">Менее 1 года</option>
                  <option value="1-3 года">1-3 года</option>
                  <option value="3-5 лет">3-5 лет</option>
                  <option value="5-10 лет">5-10 лет</option>
                  <option value="Более 10 лет">Более 10 лет</option>
                </select>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Статус и адрес */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Статус и местоположение
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Статус *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white"
                >
                  <option value="active">✅ Активен</option>
                  <option value="inactive">⏸️ Неактивен</option>
                  <option value="pending">⏳ На проверке</option>
                  <option value="banned">🚫 Заблокирован</option>
                </select>
              </div>

              <div>
                <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                  Адрес
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={getInputClasses('address')}
                  placeholder="Город, улица, дом"
                />
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Описание */}
        <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              Описание повара
            </h3>
            
            <div>
              <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Биография и описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={isLoading}
                className={getInputClasses('description')}
                placeholder="Расскажите о поваре, его опыте и специализации..."
              />
              <p className="mt-2 text-sm text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                Это описание будет отображаться в профиле повара
              </p>
            </div>
          </div>
        </AnimatedContainer>

        {/* Дополнительная информация */}
        <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
          <AnimatedCard hoverable={false} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              Дополнительная информация
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover-lift transition-all duration-300">
                <div className="text-2xl font-bold text-blue-600 mb-1">{chef.id}</div>
                <div className="text-sm text-gray-600">ID повара</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover-lift transition-all duration-300">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {new Date(chef.joinedAt).toLocaleDateString('ru-RU')}
                </div>
                <div className="text-sm text-gray-600">Дата регистрации</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover-lift transition-all duration-300">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {chef.ordersCompleted || 0}
                </div>
                <div className="text-sm text-gray-600">Выполнено заказов</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200 hover-lift transition-all duration-300">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {chef.rating || '0.0'}
                </div>
                <div className="text-sm text-gray-600">Рейтинг</div>
              </div>
            </div>
          </AnimatedCard>
        </AnimatedContainer>

        {/* Кнопки действий */}
        <AnimatedContainer animation="fadeInUp" delay={600} duration="normal">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <AnimatedButton
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Отмена
            </AnimatedButton>
            
            <AnimatedButton
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сохранить изменения
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  )
}