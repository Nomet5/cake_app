// app/admin/chefs/components/create-chef-form.jsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createChef } from "../../../../actions/admin/chef.actions"
import ChefImageUpload from "./chef-image-upload"
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
} from '../../../Components/animation-component'

export default function CreateChefForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    status: 'pending',
    description: '',
    address: '',
    avatar: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Специализация обязательна'
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await createChef(formData)
      
      if (result.success) {
        router.push(`/admin/chefs/${result.chef.id}`)
        router.refresh()
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Произошла ошибка при создании повара' })
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
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
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
      ${errors[fieldName] 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
        : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100 bg-white hover:border-gray-300'
      }
    `
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
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">👨‍🍳</span>
          </div>
        </FloatingElement>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Добавить нового повара</h1>
        <p className="text-gray-600">Заполните информацию о новом поваре для добавления в систему</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2 animate-pulse-gentle"></div>
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Аватар */}
              <div className="lg:col-span-1">
                <ChefImageUpload 
                  currentImage={formData.avatar}
                  onImageChange={handleImageChange}
                  chefName={formData.name}
                />
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
                    placeholder="Введите полное имя повара"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.name}
                    </p>
                  )}
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
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
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
                    placeholder="Например: Итальянская кухня, Суши-мастер"
                  />
                  {errors.specialization && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                      {errors.specialization}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Контактная информация */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
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

        {/* Безопасность и статус */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Безопасность и статус
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Пароль *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={getInputClasses('password')}
                  placeholder="Минимум 6 символов"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Подтверждение пароля *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={getInputClasses('confirmPassword')}
                  placeholder="Повторите пароль"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Статус повара *
              </label>
              <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full md:w-64 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300"
                >
                  <option value="pending">⏳ На проверке</option>
                  <option value="active">✅ Активен</option>
                  <option value="inactive">⏸️ Неактивен</option>
                </select>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  Рекомендуется "На проверке" для новых поваров
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Дополнительная информация */}
        <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Дополнительная информация
            </h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
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

              <div>
                <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                  Описание повара
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={isLoading}
                  className={getInputClasses('description')}
                  placeholder="Расскажите о поваре, его опыте, специализации, образовании..."
                />
                <p className="mt-2 text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  Это описание будет отображаться в профиле повара
                </p>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Ошибка отправки формы */}
        {errors.submit && (
          <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {errors.submit}
              </p>
            </div>
          </AnimatedContainer>
        )}

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
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Создание...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать повара
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  )
}