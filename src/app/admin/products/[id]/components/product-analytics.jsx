// app/admin/products/[id]/components/product-analytics.jsx
'use client'

import { 
  AnimatedContainer,
  AnimatedCounter,
  FloatingElement,
  SubtleHover,
  AnimatedButton 
} from '../../../../Components/animation-component'

export default function ProductAnalytics({ product }) {
  const calculateAverageRating = () => {
    if (!product.reviews?.length) return 0
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0)
    return Number((sum / product.reviews.length).toFixed(1))
  }

  const calculateRevenue = () => {
    return (product._count?.orderItems || 0) * product.price
  }

  const getTrendInfo = (trend) => {
    return {
      up: { color: 'from-green-500 to-emerald-500', icon: '↗️', bg: 'bg-green-100', text: 'text-green-700' },
      down: { color: 'from-red-500 to-orange-500', icon: '↘️', bg: 'bg-red-100', text: 'text-red-700' },
      neutral: { color: 'from-gray-500 to-gray-600', icon: '➡️', bg: 'bg-gray-100', text: 'text-gray-700' }
    }[trend]
  }

  const analytics = [
    {
      label: 'Всего заказов',
      value: product._count?.orderItems || 0,
      icon: '📦',
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      trend: 'up',
      description: 'За все время',
      delay: 0
    },
    {
      label: 'Средний рейтинг',
      value: calculateAverageRating(),
      valueSuffix: '/5',
      icon: '⭐',
      color: 'from-yellow-500 to-amber-500',
      change: '+0.3',
      trend: 'up',
      description: `${product._count?.reviews || 0} отзывов`,
      delay: 100
    },
    {
      label: 'В корзинах',
      value: product._count?.cartItems || 0,
      icon: '🛒',
      color: 'from-green-500 to-emerald-500',
      change: '-2',
      trend: 'down',
      description: 'Активные корзины',
      delay: 200
    },
    {
      label: 'Общий доход',
      value: calculateRevenue(),
      valueSuffix: ' ₽',
      icon: '💰',
      color: 'from-purple-500 to-pink-500',
      change: '+15%',
      trend: 'up',
      description: 'С начала продаж',
      delay: 300
    }
  ]

  const quickActions = [
    {
      label: 'Детальная статистика',
      icon: '📈',
      description: 'Подробные графики и метрики',
      color: 'from-blue-500 to-cyan-500',
      delay: 400
    },
    {
      label: 'Генерация отчетов',
      icon: '📊',
      description: 'Создать аналитический отчет',
      color: 'from-green-500 to-emerald-500',
      delay: 450
    },
    {
      label: 'История заказов',
      icon: '📋',
      description: 'Просмотр всех заказов',
      color: 'from-purple-500 to-pink-500',
      delay: 500
    },
    {
      label: 'Анализ отзывов',
      icon: '💬',
      description: 'Статистика по отзывам',
      color: 'from-orange-500 to-amber-500',
      delay: 550
    }
  ]

  return (
    <AnimatedContainer animation="fadeInUp" delay={400} className="h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FloatingElement speed="slow">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">📊</span>
              </div>
            </FloatingElement>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Аналитика продукта</h3>
              <p className="text-sm text-gray-600">Ключевые метрики и показатели</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Обновлено</div>
            <div className="text-xs text-gray-400">только что</div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {analytics.map((stat, index) => {
            const trendInfo = getTrendInfo(stat.trend)
            
            return (
              <AnimatedContainer
                key={stat.label}
                animation="fadeInUp"
                delay={stat.delay}
              >
                <FloatingElement speed="normal">
                  <SubtleHover>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group h-full">
                      <div className="flex items-start justify-between mb-3">
                        {/* Icon */}
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                          <span className="text-white text-xl">{stat.icon}</span>
                        </div>
                        
                        {/* Trend Indicator */}
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${trendInfo.bg} ${trendInfo.text} flex items-center space-x-1`}>
                          <span>{trendInfo.icon}</span>
                          <span>{stat.change}</span>
                        </div>
                      </div>

                      {/* Value */}
                      <div className="mb-1">
                        <div className="text-2xl font-bold text-gray-900">
                          {typeof stat.value === 'number' ? (
                            <AnimatedCounter 
                              value={stat.value}
                              duration={2000}
                              format={stat.label.includes('Доход')}
                            />
                          ) : (
                            stat.value
                          )}
                          {stat.valueSuffix}
                        </div>
                      </div>

                      {/* Label and Description */}
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-700">
                          {stat.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stat.description}
                        </div>
                      </div>

                      {/* Progress Bar for Rating */}
                      {stat.label.includes('рейтинг') && stat.value > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full transition-all duration-1000"
                              style={{ width: `${(stat.value / 5) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>5</span>
                          </div>
                        </div>
                      )}

                      {/* Hover Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                    </div>
                  </SubtleHover>
                </FloatingElement>
              </AnimatedContainer>
            )
          })}
        </div>

        {/* Performance Summary */}
        <AnimatedContainer animation="fadeInUp" delay={350} className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🚀</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Производительность</div>
                  <div className="text-sm text-gray-600">
                    {product._count?.orderItems > 10 ? 'Высокая' : 
                     product._count?.orderItems > 5 ? 'Средняя' : 'Низкая'} активность
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round((product._count?.orderItems || 0) / Math.max(1, product._count?.reviews || 1) * 100)}%
                </div>
                <div className="text-xs text-blue-600">конверсия</div>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Quick Actions */}
        <AnimatedContainer animation="fadeInUp" delay={600} className="mt-auto">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Быстрые действия
              </h4>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Аналитика
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <AnimatedContainer
                  key={action.label}
                  animation="fadeInUp"
                  delay={action.delay}
                >
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    className="h-16 flex flex-col items-center justify-center text-center p-2 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-white text-sm">{action.icon}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-700 leading-tight">
                      {action.label}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {action.description}
                    </div>
                  </AnimatedButton>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {/* Footer Info */}
        <AnimatedContainer animation="fadeInUp" delay={700} className="mt-4">
          <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Данные обновляются в реальном времени</span>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </AnimatedContainer>
  )
}