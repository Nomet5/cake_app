// app/admin/chefs/[id]/components/chef-products.jsx
'use client'

import Link from 'next/link'
import { 
  AnimatedContainer, 
  AnimatedList,
  FloatingElement,
  SubtleHover,
  AnimatedCounter,
  AnimatedButton
} from '../../Components/animation-component'

export default function ChefProducts({ chefId }) {
  // Временные данные продуктов
  const products = [
    { 
      id: 1, 
      name: 'Паста Карбонара', 
      price: 890, 
      status: 'active', 
      image: '/pasta.jpg',
      category: 'Основные блюда',
      rating: 4.8,
      orders: 45,
      description: 'Классическая итальянская паста с беконом и сливочным соусом'
    },
    { 
      id: 2, 
      name: 'Пицца Маргарита', 
      price: 750, 
      status: 'active', 
      image: '/pizza.jpg',
      category: 'Пицца',
      rating: 4.6,
      orders: 32,
      description: 'Традиционная итальянская пицца с томатами и моцареллой'
    },
    { 
      id: 3, 
      name: 'Тирамису', 
      price: 450, 
      status: 'inactive', 
      image: '/tiramisu.jpg',
      category: 'Десерты',
      rating: 4.9,
      orders: 28,
      description: 'Нежный итальянский десерт с кофе и маскарпоне'
    },
  ]

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalRevenue: products.reduce((sum, product) => sum + (product.price * product.orders), 0),
    averageRating: (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Статистика продуктов */}
      <AnimatedContainer animation="fadeInUp" delay={0} duration="normal">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FloatingElement speed="slow">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </FloatingElement>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900">Продукты повара</h3>
                <p className="text-gray-600 mt-1">
                  Обзор меню и продаж
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <AnimatedCounter 
                value={stats.totalProducts}
                duration={2000}
                className="text-3xl font-bold text-green-600"
                format={true}
              />
              <div className="text-sm text-gray-500 font-medium">
                всего продуктов
              </div>
            </div>
          </div>

          {/* Детальная статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-green-200">
            <div className="text-center">
              <AnimatedCounter 
                value={stats.activeProducts}
                duration={1500}
                className="text-2xl font-bold text-green-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Активных</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={stats.totalRevenue}
                duration={2000}
                className="text-2xl font-bold text-blue-600"
                format={true}
              />
              <div className="text-sm text-gray-600 mt-1">Выручка</div>
            </div>
            
            <div className="text-center">
              <AnimatedCounter 
                value={parseFloat(stats.averageRating)}
                duration={1500}
                className="text-2xl font-bold text-yellow-600"
                format={false}
              />
              <div className="text-sm text-gray-600 mt-1">Сред. рейтинг</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((stats.activeProducts / stats.totalProducts) * 100)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Активность</div>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Список продуктов */}
      <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse-gentle"></span>
                Последние продукты
              </h4>
              <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {products.length} товаров
              </span>
            </div>
            
            <AnimatedButton
              as={Link}
              href={`/admin/products?chef=${chefId}`}
              variant="primary"
              size="sm"
              className="group"
            >
              Все продукты
              <svg 
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AnimatedButton>
          </div>
          
          <AnimatedList
            items={products}
            animation="fadeInUp"
            staggerDelay={80}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            renderItem={(product, index) => (
              <FloatingElement speed="normal" key={product.id}>
                <SubtleHover>
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-4 hover-lift hover-glow transition-all duration-300 group h-full flex flex-col">
                    {/* Изображение продукта */}
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">Нет изображения</span>
                        </div>
                      )}
                      
                      {/* Статус продукта */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'active' 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-red-500 text-white shadow-lg'
                      }`}>
                        {product.status === 'active' ? '✅' : '⏸️'}
                      </div>
                    </div>

                    {/* Информация о продукте */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h4>
                      
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="text-xs text-gray-400 mb-3">
                        {product.category}
                      </div>

                      {/* Рейтинг и заказы */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-600 font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.orders} зак.
                        </div>
                      </div>

                      {/* Цена и действия */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-900">
                          {product.price} ₽
                        </span>
                        
                        <div className="flex space-x-1">
                          <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SubtleHover>
              </FloatingElement>
            )}
          />

          {/* Кнопка добавления нового продукта */}
          <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
            <div className="mt-6 pt-6 border-t border-gray-200">
              <AnimatedButton
                as={Link}
                href={`/admin/products/create?chef=${chefId}`}
                variant="success"
                size="md"
                className="w-full justify-center group"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить новый продукт
              </AnimatedButton>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>

      {/* Пустое состояние */}
      {products.length === 0 && (
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center shadow-sm">
            <FloatingElement speed="slow">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </FloatingElement>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Продуктов пока нет</h4>
            <p className="text-gray-500 text-sm mb-6">
              У этого повара еще нет добавленных продуктов
            </p>
            <AnimatedButton
              as={Link}
              href={`/admin/products/create?chef=${chefId}`}
              variant="primary"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить первый продукт
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      )}
    </div>
  )
}