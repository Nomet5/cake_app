import CreateCategoryForm from '../components/create-category-modal';
import BackButton from '../components/back-button';

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center animate-slide-in-right">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Создание категории
          </h1>
          <p className="mt-2 text-gray-600 animate-pulse-slow">
            Заполните информацию о новой категории
          </p>
        </div>
        
        <BackButton href="/admin/categories" />
      </div>

      <div className="bg-white rounded-2xl shadow-glow border border-gray-100 overflow-hidden hover-lift animate-scale-in">
        <div className="p-6">
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  );
}