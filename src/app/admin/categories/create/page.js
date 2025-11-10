// app/admin/categories/create/page.js
'use client';

import { useRouter } from 'next/navigation';
import CreateCategoryForm from '../components/create-category-form';

export default function CreateCategoryPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/admin/categories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <CreateCategoryForm onBack={handleBack} />
      </div>
    </div>
  );
}