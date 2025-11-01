// app/admin/products/[id]/page.js
import { getProductById } from "../../../actions/admin/product.actions"
import { notFound } from 'next/navigation'
import { 
  AnimatedContainer,
  FloatingElement 
} from "../../Components/animation-component"
import ProductDetails from "./components/product-details"
import ProductImages from "./components/product-images"
import ProductReviews from "./components/product-reviews"
import ProductAnalytics from "./components/product-analytics"
import ProductActions from "../create/components/product-actions"

export default async function ProductDetailPage({ params }) {
  const result = await getProductById(parseInt(params.id))

  if (result.error || !result.success) {
    notFound()
  }

  const product = result.product

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <AnimatedContainer animation="fadeIn" delay={100}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <AnimatedContainer animation="fadeInUp" delay={200}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <FloatingElement speed="slow">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0].imageUrl} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl">🍽️</span>
                      )}
                    </div>
                  </FloatingElement>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                      {product.description || 'Продукт без описания'}
                    </p>
                  </div>
                </div>

                {/* Quick Status Badge */}
                <FloatingElement speed="normal">
                  <div className={`px-4 py-2 rounded-xl font-semibold text-white ${
                    product.isAvailable 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-500 to-orange-600'
                  } shadow-lg`}>
                    {product.isAvailable ? '✅ Доступен' : '⏸️ Недоступен'}
                  </div>
                </FloatingElement>
              </div>
            </AnimatedContainer>

            {/* Breadcrumb and Actions */}
            <AnimatedContainer animation="fadeInUp" delay={300}>
              <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <a href="/admin/products" className="hover:text-gray-700 transition-colors duration-200">
                    📦 Продукты
                  </a>
                  <span>›</span>
                  <span className="text-gray-900 font-medium">#{product.id} {product.name}</span>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span>📦</span>
                    <span className="font-medium">{product._count?.orderItems || 0}</span>
                    <span className="text-gray-500">заказов</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span className="font-medium">{product._count?.reviews || 0}</span>
                    <span className="text-gray-500">отзывов</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💰</span>
                    <span className="font-medium">{product.price} ₽</span>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Product Details and Actions */}
            <div className="xl:col-span-2 space-y-6">
              {/* Product Actions */}
              <AnimatedContainer animation="fadeInUp" delay={400}>
                <ProductActions product={product} />
              </AnimatedContainer>

              {/* Product Details */}
              <AnimatedContainer animation="fadeInUp" delay={500}>
                <ProductDetails product={product} />
              </AnimatedContainer>
            </div>

            {/* Right Column - Images and Analytics */}
            <div className="space-y-6">
              {/* Product Images */}
              <AnimatedContainer animation="fadeInUp" delay={600}>
                <ProductImages product={product} />
              </AnimatedContainer>

              {/* Product Analytics */}
              <AnimatedContainer animation="fadeInUp" delay={700}>
                <ProductAnalytics product={product} />
              </AnimatedContainer>
            </div>
          </div>

          {/* Bottom Section - Reviews */}
          <AnimatedContainer animation="fadeInUp" delay={800}>
            <ProductReviews product={product} />
          </AnimatedContainer>

          {/* Additional Info Footer */}
          <AnimatedContainer animation="fadeInUp" delay={900} className="mt-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">Дата создания</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleTimeString('ru-RU')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">Последнее обновление</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(product.updatedAt).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(product.updatedAt).toLocaleTimeString('ru-RU')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">Категория</div>
                  <div className="text-lg font-bold text-gray-900">
                    {product.category?.name || 'Не указана'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.chef?.businessName || 'Повар'}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>
    </div>
  )
}