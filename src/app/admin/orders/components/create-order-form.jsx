// app/admin/orders/components/create-order-form.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  createOrder, 
  getActiveUsers, 
  getActiveChefs, 
  getAvailableProducts 
} from "../../../actions/admin/order.actions" 
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement
} from '../../Components/animation-component'

export default function CreateOrderForm({ onBack }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [users, setUsers] = useState([])
  const [chefs, setChefs] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  
  const [formData, setFormData] = useState({
    userId: '',
    chefId: '',
    deliveryAddress: '',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    subtotal: '0',
    deliveryFee: '0',
    totalAmount: '0',
    // УБИРАЕМ notes из начального состояния
  })
  const [errors, setErrors] = useState({})

  // Загрузка данных для формы через Server Actions
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoadingData(true)
        
        // Загрузка пользователей
        const usersResult = await getActiveUsers()
        if (usersResult.success) {
          setUsers(usersResult.users)
        } else {
          console.error('Error loading users:', usersResult.error)
        }

        // Загрузка поваров
        const chefsResult = await getActiveChefs()
        if (chefsResult.success) {
          setChefs(chefsResult.chefs)
        } else {
          console.error('Error loading chefs:', chefsResult.error)
        }

        // Загрузка товаров
        const productsResult = await getAvailableProducts()
        if (productsResult.success) {
          setProducts(productsResult.products)
        } else {
          console.error('Error loading products:', productsResult.error)
        }
      } catch (error) {
        console.error('Error loading form data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    loadFormData()
  }, [])

  // Расчет общей суммы при изменении товаров или стоимости доставки
  useEffect(() => {
    const subtotal = selectedProducts.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    )
    const deliveryFee = parseFloat(formData.deliveryFee) || 0
    const totalAmount = subtotal + deliveryFee

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    }))
  }, [selectedProducts, formData.deliveryFee])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.userId) {
      newErrors.userId = 'Выберите пользователя'
    }

    if (!formData.chefId) {
      newErrors.chefId = 'Выберите повара'
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Адрес доставки обязателен'
    }

    if (selectedProducts.length === 0) {
      newErrors.products = 'Добавьте хотя бы один товар'
    }

    if (parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Сумма заказа должна быть больше 0'
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
      formDataToSend.append('userId', formData.userId)
      formDataToSend.append('chefId', formData.chefId)
      formDataToSend.append('deliveryAddress', formData.deliveryAddress.trim())
      formDataToSend.append('status', formData.status)
      formDataToSend.append('paymentStatus', formData.paymentStatus)
      formDataToSend.append('subtotal', formData.subtotal)
      formDataToSend.append('deliveryFee', formData.deliveryFee)
      formDataToSend.append('totalAmount', formData.totalAmount)
      // УБИРАЕМ отправку notes

      // Добавляем товары
      selectedProducts.forEach((product, index) => {
        formDataToSend.append(`products[${index}][id]`, product.id.toString())
        formDataToSend.append(`products[${index}][quantity]`, product.quantity.toString())
      })

      const result = await createOrder(formDataToSend)
      
      if (result.success) {
        router.push('/admin/orders')
        router.refresh()
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Произошла ошибка при создании заказа' })
      console.error('Create order error:', error)
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

  const addProduct = (productId) => {
    const product = products.find(p => p.id === parseInt(productId))
    if (product && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, {
        ...product,
        quantity: 1
      }])
    }
  }

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const updateProductQuantity = (productId, quantity) => {
    if (quantity < 1) return
    
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, quantity } : p
      )
    )
  }

  const getInputClasses = (fieldName) => {
    return `
      w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      ${errors[fieldName] 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300'
      }
    `
  }

  const getSelectClasses = (fieldName) => {
    return `
      w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      ${errors[fieldName] 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50' 
        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300'
      }
    `
  }

  if (loadingData) {
    return (
      <AnimatedContainer
        animation="fadeInUp"
        duration="normal"
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных...</p>
          </div>
        </div>
      </AnimatedContainer>
    )
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto"
    >
      {/* Заголовок формы */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку заказов
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Создать новый заказ</h1>
          <p className="text-gray-600 mt-2">Создайте заказ вручную для пользователя</p>
        </div>
        <FloatingElement speed="slow">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">📦</span>
          </div>
        </FloatingElement>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Информация о клиенте и поваре */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></div>
              Информация о заказе
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userId" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Клиент *
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  disabled={isLoading || users.length === 0}
                  className={getSelectClasses('userId')}
                >
                  <option value="">{users.length === 0 ? 'Нет доступных пользователей' : 'Выберите клиента'}</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.email} {/* Убираем lastName */}
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.userId}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chefId" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Повар *
                </label>
                <select
                  id="chefId"
                  name="chefId"
                  value={formData.chefId}
                  onChange={handleChange}
                  required
                  disabled={isLoading || chefs.length === 0}
                  className={getSelectClasses('chefId')}
                >
                  <option value="">{chefs.length === 0 ? 'Нет доступных поваров' : 'Выберите повара'}</option>
                  {chefs.map(chef => (
                    <option key={chef.id} value={chef.id}>
                      {chef.businessName} ({chef.user?.firstName})
                    </option>
                  ))}
                </select>
                {errors.chefId && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.chefId}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="deliveryAddress" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Адрес доставки *
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  disabled={isLoading}
                  className={getInputClasses('deliveryAddress')}
                  placeholder="Введите полный адрес доставки"
                />
                {errors.deliveryAddress && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Товары в заказе */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Товары в заказе
            </h3>
            
            {/* Добавление товара */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Добавить товар
              </label>
              <div className="flex gap-4">
                <select
                  onChange={(e) => addProduct(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  disabled={isLoading || products.length === 0}
                >
                  <option value="">{products.length === 0 ? 'Нет доступных товаров' : 'Выберите товар'}</option>
                  {products
                    .filter(product => !selectedProducts.find(p => p.id === product.id))
                    .map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price} ₽
                      </option>
                    ))
                  }
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const select = document.querySelector('select')
                    if (select.value) addProduct(select.value)
                  }}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || products.length === 0}
                >
                  Добавить
                </button>
              </div>
              {errors.products && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {errors.products}
                </p>
              )}
            </div>

            {/* Список выбранных товаров */}
            {selectedProducts.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Выбранные товары:</h4>
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.price} ₽ за шт.</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                          disabled={product.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{product.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="font-semibold text-gray-900 min-w-20 text-right">
                        {product.price * product.quantity} ₽
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedContainer>

        {/* Стоимость и настройки */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Стоимость и настройки
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="subtotal" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Сумма товаров
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subtotal"
                    name="subtotal"
                    value={formData.subtotal}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">₽</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="deliveryFee" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
                  Стоимость доставки
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="deliveryFee"
                    name="deliveryFee"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    className={getInputClasses('deliveryFee')}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">₽</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="totalAmount" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                  Итоговая сумма
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl bg-orange-50 text-orange-700 font-semibold"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-orange-500 font-semibold">₽</span>
                  </div>
                </div>
                {errors.totalAmount && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                    {errors.totalAmount}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Статус заказа
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={getSelectClasses('status')}
                >
                  <option value="PENDING">Ожидает подтверждения</option>
                  <option value="CONFIRMED">Подтвержден</option>
                  <option value="PREPARING">Готовится</option>
                  <option value="READY">Готов к выдаче</option>
                  <option value="DELIVERED">Доставлен</option>
                  <option value="CANCELLED">Отменен</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentStatus" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Статус оплаты
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={getSelectClasses('paymentStatus')}
                >
                  <option value="PENDING">Ожидает оплаты</option>
                  <option value="PAID">Оплачен</option>
                  <option value="FAILED">Ошибка оплаты</option>
                  <option value="REFUNDED">Возврат</option>
                </select>
              </div>

              {/* УБИРАЕМ блок с notes */}
            </div>
          </div>
        </AnimatedContainer>

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
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад
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
                  Создание заказа...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать заказ
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  )
}