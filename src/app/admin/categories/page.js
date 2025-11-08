import { getCategories, getCategoryStats } from '../../actions/admin/category.actions';
import StatsOverview from './components/stats-overview';
import CategoriesTable from './components/categories-table';
import SearchFilters from './components/search-filters';
import Link from 'next/link';

export default async function CategoriesPage({ searchParams }) {
  const categories = await getCategories();
  const stats = await getCategoryStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Управление категориями
          </h1>
          <p className="mt-2 text-gray-600 animate-pulse-slow">
            Создавайте и управляйте категориями товаров
          </p>
        </div>
        
        <Link
          href="/admin/categories/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover-lift shadow-blue-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Создать категорию
        </Link>
      </div>

      <StatsOverview stats={stats} />
      
      <div className="bg-white rounded-2xl shadow-glow border border-gray-100 overflow-hidden hover-lift">
        <div className="p-6 border-b border-gray-100 animate-slide-in-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchFilters />
          </div>
        </div>
        
        <CategoriesTable categories={categories} />
      </div>
    </div>
  );
}