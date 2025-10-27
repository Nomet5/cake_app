// app/admin/chefs/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getChefs, deleteChef } from "../../actions/admin/chef.actions";
import CreateChefModal from "../components/CreateChefModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

export default function ChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    chefId: null,
    chefName: "",
    loading: false,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const fetchChefs = async () => {
    try {
      const chefsData = await getChefs();
      setChefs(chefsData);
    } catch (error) {
      console.error("Error fetching chefs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleSuccess = () => {
    fetchChefs();
    setIsCreateModalOpen(false);
  };

  // Открыть модальное окно удаления
  const openDeleteModal = (chefId, chefName) => {
    setDeleteModal({
      isOpen: true,
      chefId,
      chefName,
      loading: false,
    });
  };

  // Закрыть модальное окно удаления
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      chefId: null,
      chefName: "",
      loading: false,
    });
  };

  // Подтверждение удаления
  const handleDeleteConfirm = async () => {
    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      const result = await deleteChef(deleteModal.chefId);

      if (result.error) {
        // Показываем ошибку в модальном окне
        setDeleteModal((prev) => ({
          ...prev,
          loading: false,
        }));
        alert(result.error); // Временное решение для ошибок
      } else {
        // Успешное удаление
        setSuccessMessage(result.message);
        closeDeleteModal();
        fetchChefs(); // Обновляем список

        // Автоматически скрываем сообщение об успехе через 3 секунды
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      setDeleteModal((prev) => ({
        ...prev,
        loading: false,
      }));
      alert("Ошибка при удалении повара");
      console.error("Error deleting chef:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление поварами</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Добавить повара
        </button>
      </div>

      {/* Сообщение об успехе */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <svg
              className="h-4 w-4 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Повар
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистика
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chefs.map((chef) => (
              <tr key={chef.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {chef.businessName}
                      </div>
                      {chef.specialty && (
                        <div className="text-sm text-gray-500">
                          {chef.specialty}
                        </div>
                      )}
                      <div className="text-sm text-gray-400">ID: {chef.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {chef.user.firstName}
                  </div>
                  <div className="text-sm text-gray-500">{chef.user.email}</div>
                  {chef.user.phone && (
                    <div className="text-sm text-gray-500">
                      {chef.user.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Товары: {chef._count.products}
                  </div>
                  <div className="text-sm text-gray-500">
                    Заказы: {chef._count.orders}
                  </div>
                  <div className="text-sm text-gray-500">
                    Отзывы: {chef._count.reviews}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {chef.isVerified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Верифицирован
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        chef.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {chef.isActive ? "Активен" : "Неактивен"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/chefs/${chef.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => openDeleteModal(chef.id, chef.businessName)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {chefs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Повары не найдены. Создайте первого повара!
          </div>
        )}
      </div>

      {/* Модальное окно создания повара */}
      <CreateChefModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        chefName={deleteModal.chefName}
        loading={deleteModal.loading}
      />
    </div>
  );
}
