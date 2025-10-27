// app/admin/categories/[id]/page.js
import { getCategoryById } from "../../../actions/admin/category.actions";
import { notFound } from "next/navigation";

export default async function CategoryDetailPage({ params }) {
  // Ожидаем params
  const { id } = await params;

  // Проверяем что id существует и валиден
  if (!id || isNaN(Number(id))) {
    notFound();
  }

  const categoryId = Number(id);

  try {
    const result = await getCategoryById(categoryId);

    if (result.error || !result.category) {
      notFound();
    }

    const { category } = result;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-2">ID: {category.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Основная информация
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Название
                  </label>
                  <p className="text-lg">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Описание
                  </label>
                  <p className="text-lg">
                    {category.description || "Нет описания"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Статус
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Активна" : "Неактивна"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Статистика</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Количество товаров
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {category._count?.products || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Дата создания
                  </label>
                  <p className="text-lg">
                    {new Date(category.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Последнее обновление
                  </label>
                  <p className="text-lg">
                    {new Date(category.updatedAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="mt-6 flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Редактировать категорию
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Назад к списку
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
}
