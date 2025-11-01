import { getCategoryById } from '../../../../actions/admin/category.actions';
import { notFound } from 'next/navigation';
import EditCategoryForm from '../../components/edit-category-form';
import BackButton from '../../components/back-button';

export default async function EditCategoryPage({ params }) {
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
            Редактирование категории
          </h1>
          <p className="mt-2 text-gray-600">
            ID категории: {category.id}
          </p>
        </div>
        
        <BackButton href={`/admin/categories/${category.id}`} />
      </div>

      <div className="bg-white rounded-2xl shadow-glow border border-gray-100 overflow-hidden hover-lift animate-scale-in">
        <div className="p-6">
          <EditCategoryForm category={category} />
        </div>
      </div>
    </div>
  );
}