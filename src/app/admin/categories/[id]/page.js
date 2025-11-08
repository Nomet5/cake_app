import { getCategoryById } from '../../../actions/admin/category.actions';
import { notFound } from 'next/navigation';
import CategoryInfo from './components/category-info';
import CategoryStats from './components/category-stats';
import CategoryProducts from './components/category-products';
import BackButton from '../../components/back-button';
import Link from 'next/link';

export default async function CategoryDetailPage({ params }) {
  const result = await getCategoryById(Number(params.id));

  if (result.error) {
    notFound();
  }

  const { category } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {category.name}
          </h1>
          <p className="mt-2 text-gray-600">
            ID категории: {category.id}
          </p>
        </div>
        
        <div className="flex gap-3">
          <BackButton href="/admin/categories" />
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover-lift"
          >
            Редактировать
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CategoryInfo category={category} />
          <CategoryProducts products={category.products} />
        </div>
        
        <div className="space-y-6">
          <CategoryStats category={category} />
        </div>
      </div>
    </div>
  );
}