// app/admin/chefs/components/create-chef-from-user.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createChefFromUser } from "../../../actions/admin/chef.actions"
import { getUserById, getUsers } from "../../../actions/admin/user.actions"
import ChefImageUpload from "./chef-image-upload"
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
} from '../../Components/animation-component'

// Добавляем функцию formatDate
function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export default function CreateChefFromUser({ onBack }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingUser, setLoadingUser] = useState(false)
  const [formData, setFormData] = useState({
    specialty: '', // изменено
    experience: '',
    status: 'pending',
    description: '',
    address: '',
    avatar: ''
  })
  const [errors, setErrors] = useState({})

  // Загрузка пользователей
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true)
      try {
        const usersData = await getUsers()
        
        // Фильтруем только пользователей без профиля повара
        const availableUsers = usersData.filter(user => !user.chefProfile)
        
        setUsers(availableUsers)
        setFilteredUsers(availableUsers)
        
        if (availableUsers.length === 0) {
          setErrors({ users: 'Нет доступных пользователей для преобразования в поваров' })
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error)
        setErrors({ users: 'Ошибка загрузки списка пользователей' })
      } finally {
        setLoadingUsers(false)
      }
    }
    
    loadUsers()
  }, [])

  // Фильтрация пользователей при изменении поискового запроса
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // Загрузка деталей пользователя при выборе
  useEffect(() => {
    const loadUserDetails = async () => {
      if (!selectedUser) {
        setUserDetails(null)
        return
      }

      setLoadingUser(true)
      try {
        const result = await getUserById(selectedUser.id)
        
        if (result.success) {
          setUserDetails(result.user)
          // Автоматически заполняем некоторые поля из данных пользователя
          setFormData(prev => ({
            ...prev,
            address: result.user.addresses?.[0]?.address || '',
            avatar: result.user.avatar || ''
          }))
        } else {
          setErrors({ user: result.error })
          setUserDetails(null)
        }
      } catch (error) {
        console.error('Ошибка загрузки деталей пользователя:', error)
        setErrors({ user: 'Ошибка загрузки данных пользователя' })
        setUserDetails(null)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUserDetails()
  }, [selectedUser])

  const validateForm = () => {
    const newErrors = {}

    if (!selectedUser) {
      newErrors.user = 'Выберите пользователя'
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Специализация обязательна' // изменено
    }

    // Проверяем, не является ли пользователь уже поваром
    if (userDetails?.chefProfile) {
      newErrors.user = 'Этот пользователь уже является поваром'
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
      const formDataToSend = new FormData()
      formDataToSend.append('userId', selectedUser.id)
      formDataToSend.append('specialty', formData.specialty) // изменено
      formDataToSend.append('experience', formData.experience)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('description', formData.description || '')
      formDataToSend.append('address', formData.address || '')
      formDataToSend.append('avatar', formData.avatar || '')

      const result = await createChefFromUser(formDataToSend)
      
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
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к выбору
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Создать повара из пользователя</h1>
          <p className="text-gray-600 mt-2">Выберите существующего пользователя и заполните информацию о поваре</p>
        </div>
        <FloatingElement speed="slow">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">👤→👨‍🍳</span>
          </div>
        </FloatingElement>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Выбор пользователя */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Выбор пользователя
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({filteredUsers.length} доступно)
              </span>
            </h3>
            
            <div className="space-y-4">
              {/* Поиск пользователей */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Поиск пользователей
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Введите имя, email или телефон пользователя..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              {/* Состояние загрузки */}
              {loadingUsers && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Загрузка пользователей...</span>
                </div>
              )}

              {/* Список пользователей */}
              {!loadingUsers && (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
                    </div>
                  ) : (
                    filteredUsers.map(user => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedUser?.id === user.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {user.firstName || 'Без имени'}
                            </h4>
                            <p className="text-gray-600 text-sm truncate">{user.email}</p>
                            {user.phone && (
                              <p className="text-gray-500 text-sm truncate">{user.phone}</p>
                            )}
                            <p className="text-gray-400 text-xs mt-1">
                              Зарегистрирован: {formatDate(user.createdAt)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">{user._count?.orders || 0}</span> заказов
                            </div>
                            {selectedUser?.id === user.id && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-2">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {errors.user && (
                <p className="text-red-600 text-sm flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.user}
                </p>
              )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Информация о выбранном пользователе */}
        {selectedUser && (
          <AnimatedContainer animation="fadeInUp" delay={150} duration="normal">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Информация о выбранном пользователе
              </h3>
              
              {loadingUser ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="ml-3 text-gray-600">Загрузка данных пользователя...</span>
                </div>
              ) : userDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Основная информация */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Основная информация</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {userDetails.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userDetails.firstName || 'Без имени'}</p>
                        <p className="text-sm text-gray-600">{userDetails.email}</p>
                        {userDetails.phone && (
                          <p className="text-sm text-gray-600">{userDetails.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Зарегистрирован: {formatDate(userDetails.createdAt)}</p>
                      {userDetails.addresses?.[0] && (
                        <p className="mt-1">Адрес: {userDetails.addresses[0].address}</p>
                      )}
                    </div>
                  </div>

                  {/* Статистика */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Статистика</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-blue-600">{userDetails._count?.orders || 0}</p>
                        <p className="text-xs text-gray-600">Заказов</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-green-600">{userDetails._count?.reviews || 0}</p>
                        <p className="text-xs text-gray-600">Отзывов</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
                        <p className="text-2xl font-bold text-purple-600">{userDetails._count?.addresses || 0}</p>
                        <p className="text-xs text-gray-600">Адресов</p>
                      </div>
                    </div>

                    {/* Проверка на существующего повара */}
                    {userDetails.chefProfile && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-sm text-yellow-800">
                            Этот пользователь уже является поваром
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Не удалось загрузить данные пользователя
                </div>
              )}
            </div>
          </AnimatedContainer>
        )}

        {/* Информация о поваре */}
        {selectedUser && (
          <>
            <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Информация о поваре
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Аватар */}
                  <div className="lg:col-span-1">
                    <ChefImageUpload 
                      currentImage={formData.avatar}
                      onImageChange={handleImageChange}
                      chefName={selectedUser?.firstName || 'Повар'}
                    />
                  </div>
                  
                  {/* Основные поля */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label htmlFor="specialty" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Специализация *
                      </label>
                      <input
                        type="text"
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        required
                        disabled={isLoading || userDetails?.chefProfile}
                        className={getInputClasses('specialty')}
                        placeholder="Например: Итальянская кухня, Суши-мастер"
                      />
                      {errors.specialty && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {errors.specialty}
                        </p>
                      )}
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
                        disabled={isLoading || userDetails?.chefProfile}
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

                    <div>
                      <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Статус повара *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={isLoading || userDetails?.chefProfile}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300"
                      >
                        <option value="pending">⏳ На проверке</option>
                        <option value="active">✅ Активен</option>
                        <option value="inactive">⏸️ Неактивен</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Дополнительная информация */}
            <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Дополнительная информация
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="address" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Адрес кухни
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={isLoading || userDetails?.chefProfile}
                      className={getInputClasses('address')}
                      placeholder="Город, улица, дом (адрес для приготовления)"
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
                      disabled={isLoading || userDetails?.chefProfile}
                      className={getInputClasses('description')}
                      placeholder="Расскажите о поваре, его опыте, специализации, образовании..."
                    />
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </>
        )}

        {/* Ошибка отправки формы */}
        {errors.submit && (
          <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {errors.submit}
              </p>
            </div>
          </AnimatedContainer>
        )}

        {/* Кнопки действий */}
        <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <AnimatedButton
              type="button"
              onClick={onBack}
              disabled={isLoading}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Назад
            </AnimatedButton>
            
            <AnimatedButton
              type="submit"
              disabled={isLoading || !selectedUser || userDetails?.chefProfile}
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50"
            >
              {userDetails?.chefProfile ? 'Пользователь уже повар' : 'Создать повара из пользователя'}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  )
}