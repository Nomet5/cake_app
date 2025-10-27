// app/admin/chefs/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChefById, updateChef } from "../../../actions/admin/chef.actions";

export default function EditChefPage() {
  const params = useParams();
  const router = useRouter();
  const chefId = parseInt(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    specialty: "",
    yearsOfExperience: "",
    userId: "",
    isActive: true,
    isVerified: false,
  });

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const result = await getChefById(chefId);
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          const chef = result.chef;
          setFormData({
            businessName: chef.businessName || "",
            description: chef.description || "",
            specialty: chef.specialty || "",
            yearsOfExperience: chef.yearsOfExperience?.toString() || "",
            userId: chef.userId?.toString() || "",
            isActive: chef.isActive,
            isVerified: chef.isVerified,
          });
        }
      } catch (err) {
        setError("Ошибка при загрузке данных повара");
        console.error("Error fetching chef:", err);
      } finally {
        setLoading(false);
      }
    };

    if (chefId) {
      fetchChef();
    }
  }, [chefId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("businessName", formData.businessName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("specialty", formData.specialty);
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("isVerified", formData.isVerified.toString());

      const result = await updateChef(chefId, formDataToSend);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Повар успешно обновлен!");
        setTimeout(() => {
          router.push("/admin/chefs");
        }, 2000);
      }
    } catch (err) {
      setError("Произошла ошибка при обновлении повара");
      console.error("Error updating chef:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Редактировать повара</h1>
          <button
            onClick={() => router.push("/admin/chefs")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Назад к списку
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Название бизнеса *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите название бизнеса"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Описание повара или бизнеса"
              />
            </div>

            <div>
              <label
                htmlFor="specialty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Специализация
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Итальянская кухня, Десерты"
              />
            </div>

            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Опыт работы (лет)
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID пользователя *
              </label>
              <input
                type="number"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите ID пользователя"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Активный
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isVerified"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Верифицирован
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/chefs")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
