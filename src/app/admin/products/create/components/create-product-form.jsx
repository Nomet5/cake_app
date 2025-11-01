// app/admin/products/components/create-product-form.jsx
'use client'

import { useState, useEffect } from 'react'
import ProductImageUpload from './product-image-upload'
import ProductActions from './product-actions'
import { 
  AnimatedContainer,
  FloatingElement,
  SubtleHover
} from "../../../Components/animation-component"

const CreateProductForm = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    chefId: '',
    isAvailable: true,
    images: []
  })

  const [categories, setCategories] = useState([])
  const [chefs, setChefs] = useState([])

  const isEditing = !!product

  // Загрузка категорий и поваров
  useEffect(() => {
    // Здесь будет запрос к API для получения категорий и поваров
    const loadFormData = async () => {
      // Заглушки данных
      setCategories([
        { id: 1, name: 'Десерты' },
        { id: 2, name: 'Основные блюда' },
        { id: 3, name: 'Закуски' },
        { id: 4, name: 'Напитки' }
      ])
      
      setChefs([
        { id: 1, businessName: 'Ресторан "Вкусно"' },
        { id: 2, businessName: 'Кафе "Уют"' },
        { id: 3, businessName: 'Повар Иванов' }
      ])
    }

    loadFormData()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryId: product.category?.id || '',
        chefId: product.chef?.id || '',
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        images: product.images || []
      })
    }
  }, [product])

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formData)
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      // Здесь будет вызов функции удаления
      console.log('Удаление товара:', product.id)
    }
  }

  return (
    <AnimatedContainer animation="fadeInUp" delay={200}>
      <div className="max-w-4xl mx-auto">
        {/* Заголовок формы */}
        <div className="mb-8">
          <FloatingElement speed="slow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">
                  {isEditing ? '✏️' : '➕'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Редактирование продукта' : 'Создание нового продукта'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isEditing 
                    ? `Изменение информации о продукте "${product.name}"`
                    : 'Заполните информацию о новом продукте'
                  }
                </p>
              </div>
            </div>
          </FloatingElement>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация */}
          <AnimatedContainer animation="fadeInUp" delay={300}>
            <FloatingElement speed="normal">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Основная информация
                </h2>
                
                <div className="space-y-6">
                  {/* Название товара */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Название продукта *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="Введите название продукта"
                    />
                  </div>

                  {/* Описание */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Описание продукта
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                      placeholder="Опишите продукт, его особенности и состав..."
                    />
                  </div>
                </div>
              </div>
            </FloatingElement>
          </AnimatedContainer>

          {/* Детали продукта */}
          <AnimatedContainer animation="fadeInUp" delay={400}>
            <FloatingElement speed="normal">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Детали продукта
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Цена */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                      Цена (₽) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                        placeholder="0.00"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-500 font-medium">₽</span>
                      </div>
                    </div>
                  </div>

                  {/* Категория */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Категория *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Повар */}
                  <div>
                    <label htmlFor="chefId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Повар *
                    </label>
                    <select
                      id="chefId"
                      name="chefId"
                      value={formData.chefId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-gray-50 hover:bg-white appearance-none"
                    >
                      <option value="">Выберите повара</option>
                      {chefs.map(chef => (
                        <option key={chef.id} value={chef.id}>
                          {chef.businessName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Статус доступности */}
                  <div className="flex items-center justify-center md:justify-start">
                    <SubtleHover>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300">
                        <input
                          type="checkbox"
                          id="isAvailable"
                          name="isAvailable"
                          checked={formData.isAvailable}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2 transition-all duration-300"
                        />
                        <div>
                          <label htmlFor="isAvailable" className="block text-sm font-semibold text-gray-700 cursor-pointer">
                            Продукт доступен
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.isAvailable ? 'Можно заказывать' : 'Временно недоступен'}
                          </p>
                        </div>
                      </div>
                    </SubtleHover>
                  </div>
                </div>
              </div>
            </FloatingElement>
          </AnimatedContainer>

          {/* Изображения продукта */}
          <AnimatedContainer animation="fadeInUp" delay={500}>
            <FloatingElement speed="normal">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Изображения продукта
                </h2>
                
                <ProductImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                />
              </div>
            </FloatingElement>
          </AnimatedContainer>

          {/* Предпросмотр продукта */}
          <AnimatedContainer animation="fadeInUp" delay={600}>
            <FloatingElement speed="normal">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Предпросмотр продукта
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="text-blue-600 font-semibold">Название</div>
                    <div className="text-gray-900 mt-1 truncate">{formData.name || 'Не указано'}</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="text-blue-600 font-semibold">Цена</div>
                    <div className="text-gray-900 mt-1">
                      {formData.price ? `${formData.price} ₽` : 'Не указана'}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <div className="text-blue-600 font-semibold">Статус</div>
                    <div className={`mt-1 font-semibold ${
                      formData.isAvailable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.isAvailable ? '✅ Доступен' : '⏸️ Недоступен'}
                    </div>
                  </div>
                </div>
                
                {formData.description && (
                  <div className="mt-4 bg-white rounded-xl p-4 border border-blue-200">
                    <div className="text-blue-600 font-semibold mb-2">Описание</div>
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {formData.description}
                    </div>
                  </div>
                )}
              </div>
            </FloatingElement>
          </AnimatedContainer>

          {/* Действия формы */}
          <AnimatedContainer animation="fadeInUp" delay={700}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <ProductActions
                product={product}
                onSave={handleSubmit}
                onDelete={handleDelete}
                onCancel={onCancel}
                isEditing={isEditing}
                isLoading={isLoading}
              />
            </div>
          </AnimatedContainer>
        </form>
      </div>
    </AnimatedContainer>
  )
}

export default CreateProductForm