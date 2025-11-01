// app/admin/products/page.js
import { getProducts, getProductStats } from "../../actions/admin/product.actions";
import ProductsTable from "./components/products-table";
import ProductsFilters from "./components/products-filters";
import StatsOverview from "./components/stats-overview";
import SearchFilters from "./components/search-filters";
import BulkActions from "./components/bulk-actions";
import ProductCard from "./components/product-card";
import Link from 'next/link';

export default async function ProductsPage({ searchParams = {} }) {
  const [products, stats] = await Promise.all([
    getProducts(),
    getProductStats()
  ]);
  
  const searchQuery = searchParams.search || '';
  const categoryFilter = searchParams.category || '';
  const statusFilter = searchParams.status || '';
  const viewMode = searchParams.view || 'table'; // 'table' или 'card'

  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query) ||
        product.chef?.businessName?.toLowerCase().includes(query) ||
        product.chef?.user?.firstName?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (categoryFilter && categoryFilter !== 'all' && product.category?.name !== categoryFilter) return false;
    
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'available' && !product.isAvailable) return false;
      if (statusFilter === 'unavailable' && product.isAvailable) return false;
    }

    return true;
  });

  // Получаем уникальные категории для фильтров
  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  return (
    <div className="p-6 space-y-6 admin-transition">
      {/* Заголовок с анимацией */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">
            Продукты
          </h1>
          <p className="text-gray-600 mt-1 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            Управление каталогом продуктов ({filteredProducts.length} из {products.length})
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Переключение вида */}
          <div className="flex bg-gray-100 rounded-xl p-1 animate-scale-in" style={{ animationDelay: '0.15s' }}>
            <Link
              href={`/admin/products?view=table${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Таблица
            </Link>
            <Link
              href={`/admin/products?view=card${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'card' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🃏 Карточки
            </Link>
          </div>

          <Link 
            href="/admin/products/create"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 group animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Добавить продукт</span>
          </Link>
        </div>
      </div>

      {/* Статистика с анимацией */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <StatsOverview stats={stats} />
      </div>

      {/* Mass Actions с анимацией */}
      <div className="animate-slide-in-down" style={{ animationDelay: '0.35s' }}>
        <BulkActions />
      </div>

      {/* Поиск с анимацией */}
      <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
        <SearchFilters />
      </div>

      {/* Фильтры с анимацией */}
      <div className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
        <ProductsFilters categories={categories} />
      </div>

      {/* Результаты в виде таблицы */}
      {viewMode === 'table' && (
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <ProductsTable products={filteredProducts} />
        </div>
      )}

      {/* Результаты в виде карточек */}
      {viewMode === 'card' && (
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Продукты не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          )}
        </div>
      )}

      {/* Пустое состояние когда нет продуктов вообще */}
      {filteredProducts.length === 0 && products.length === 0 && (
        <div className="text-center py-20 animate-bounce">
          <div className="w-32 h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Нет продуктов</h3>
          <p className="text-gray-600 mb-6">Создайте первый продукт чтобы начать работу</p>
          <Link 
            href="/admin/products/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block animate-pulse"
          >
            Создать продукт
          </Link>
        </div>
      )}

      {/* Информация о фильтрации */}
      {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && filteredProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-blue-800">
              <span>🔍 Применены фильтры:</span>
              {searchQuery && (
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  Поиск: "{searchQuery}"
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  Категория: {categoryFilter}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  Статус: {statusFilter === 'available' ? 'Доступные' : 'Недоступные'}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-blue-800">
              Найдено: {filteredProducts.length} продуктов
            </span>
          </div>
        </div>
      )}
    </div>
  );
}