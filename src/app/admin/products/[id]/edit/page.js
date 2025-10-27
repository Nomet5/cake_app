// src/app/admin/products/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "../../../../actions/admin/product.actions";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    chefId: "",
    categoryId: "",
    isAvailable: "true",
  });

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const result = await getProductById(Number(params.id));
      if (result.error) {
        setError(result.error);
      } else {
        setProduct(result.product);
        setFormData({
          name: result.product.name,
          description: result.product.description || "",
          price: result.product.price.toString(),
          chefId: result.product.chefId.toString(),
          categoryId: result.product.categoryId?.toString() || "",
          isAvailable: result.product.isAvailable.toString(),
        });
      }
    } catch (err) {
      setError("Ошибка при загрузке товара");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("chefId", formData.chefId);
      if (formData.categoryId) {
        formDataToSend.append("categoryId", formData.categoryId);
      }
      formDataToSend.append("isAvailable", formData.isAvailable);

      const result = await updateProduct(Number(params.id), formDataToSend);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (err) {
      setError("Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow border p-6"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Название товара *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Цена *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="chefId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID повара *
            </label>
            <input
              type="number"
              id="chefId"
              name="chefId"
              value={formData.chefId}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID категории
            </label>
            <input
              type="number"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="isAvailable"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Доступность
            </label>
            <select
              id="isAvailable"
              name="isAvailable"
              value={formData.isAvailable}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Доступен</option>
              <option value="false">Не доступен</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
