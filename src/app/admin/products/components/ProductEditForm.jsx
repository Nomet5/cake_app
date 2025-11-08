// src/components/admin/ProductEditForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "../../../actions/admin/product.actions";
import { getChefs } from "../../../actions/admin/chef.actions";
import { getCategories } from "../../../actions/admin/category.actions";
import { 
  AnimatedContainer, 
  AnimatedButton,
  FloatingElement,
  AnimatedCard,
  SubtleHover
} from "../../Components/animation-component";

export default function ProductEditForm({ product, onCancel, onSuccess }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [chefs, setChefs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingChefs, setLoadingChefs] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    chefId: "",
    categoryId: "",
    isAvailable: "true",
  });

  // Загрузка списков поваров и категорий
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загрузка поваров
        const chefsResult = await getChefs();
        console.log("Chefs data:", chefsResult); // Для отладки
        
        // Обрабатываем разные форматы ответа
        const chefsData = Array.isArray(chefsResult) 
          ? chefsResult 
          : chefsResult?.chefs || chefsResult?.data || [];
        setChefs(chefsData);
        
        // Загрузка категорий
        const categoriesResult = await getCategories();
        console.log("Categories data:", categoriesResult); // Для отладки
        
        // Обрабатываем разные форматы ответа
        const categoriesData = Array.isArray(categoriesResult)
          ? categoriesResult
          : categoriesResult?.categories || categoriesResult?.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setError("Ошибка загрузки списков поваров и категорий");
      } finally {
        setLoadingChefs(false);
        setLoadingCategories(false);
      }
    };
    
    loadData();
  }, []);

  // Инициализация формы при получении продукта
  useEffect(() => {
    if (product && chefs.length > 0 && categories.length > 0) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        chefId: product.chefId?.toString() || "",
        categoryId: product.categoryId?.toString() || "",
        isAvailable: product.isAvailable?.toString() || "true",
      });
    }
  }, [product, chefs, categories]);

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

      const result = await updateProduct(product.id, formDataToSend);
      if (result.error) {
        setError(result.error);
      } else {
        if (onSuccess) {
          onSuccess(result.product);
        } else {
          router.push("/admin/products");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Ошибка при обновлении товара");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInputClasses = (fieldName) => {
    return `
      w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      border-gray-200 focus:border-blue-500 focus:ring-blue-100 bg-white hover:border-gray-300
    `
  }

  const getStatusColor = (isAvailable) => {
    return isAvailable 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  }

  const getSelectClasses = () => {
    return `
      w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
      border-gray-200 focus:border-purple-500 focus:ring-purple-100 bg-white hover:border-gray-300
    `
  }

  // Функция для получения имени повара
  const getChefName = (chef) => {
    return chef.businessName || chef.user?.name || `Повар #${chef.id}`;
  }

  // Функция для получения специализации повара
  const getChefSpecialty = (chef) => {
    return chef.specialty || 'Специализация не указана';
  }

  // Функция для получения email повара
  const getChefEmail = (chef) => {
    return chef.user?.email || 'Email не указан';
  }

  // Функция для получения статуса повара
  const getChefStatus = (chef) => {
    if (chef.isActive && chef.isVerified) return '✅ Активен и верифицирован';
    if (chef.isActive) return '✅ Активен';
    if (chef.isVerified) return '🔒 Верифицирован (неактивен)';
    return '⏸️ Неактивен';
  }

  // Функция для безопасного поиска повара
  const getSelectedChef = () => {
    if (!formData.chefId || !chefs.length) return null;
    return chefs.find(c => c.id === parseInt(formData.chefId));
  }

  // Функция для безопасного поиска категории
  const getSelectedCategory = () => {
    if (!formData.categoryId || !categories.length) return null;
    return categories.find(cat => cat.id === parseInt(formData.categoryId));
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Продукт не найден</div>
      </div>
    );
  }

  return (
    <AnimatedContainer
      animation="fadeInUp"
      duration="normal"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto"
    >
      {/* Заголовок формы */}
      <div className="text-center mb-8">
        <FloatingElement speed="slow">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">🍕</span>
          </div>
        </FloatingElement>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Редактирование товара</h1>
        <p className="text-gray-600">Обновите информацию о товаре</p>
        
        {/* Статус товара */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 mt-3 ${getStatusColor(product.isAvailable)}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            product.isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {product.isAvailable ? 'Доступен' : 'Не доступен'}
          </span>
        </div>
      </div>

      {error && (
        <AnimatedContainer animation="fadeInUp" delay={50} duration="normal">
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        </AnimatedContainer>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <AnimatedContainer animation="fadeInUp" delay={100} duration="normal">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse-gentle"></div>
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Название товара *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                  className={getInputClasses('name')}
                  placeholder="Введите название товара"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  disabled={saving}
                  className={getInputClasses('description')}
                  placeholder="Описание товара..."
                />
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Цена и доступность */}
        <AnimatedContainer animation="fadeInUp" delay={200} duration="normal">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Цена и статус
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Цена *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    disabled={saving}
                    className={`${getInputClasses('price')} pr-12`}
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₽
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Статус доступности
                </label>
                <select
                  id="isAvailable"
                  name="isAvailable"
                  value={formData.isAvailable}
                  onChange={handleChange}
                  disabled={saving}
                  className={getSelectClasses()}
                >
                  <option value="true">✅ Доступен</option>
                  <option value="false">⏸️ Не доступен</option>
                </select>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Выбор повара */}
        <AnimatedContainer animation="fadeInUp" delay={300} duration="normal">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Выбор повара *
            </h3>
            
            <div className="space-y-4">
              {loadingChefs ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-600">Загрузка поваров...</span>
                </div>
              ) : (
                <div>
                  <label htmlFor="chefId" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Выберите повара
                  </label>
                  <select
                    id="chefId"
                    name="chefId"
                    value={formData.chefId}
                    onChange={handleChange}
                    required
                    disabled={saving || chefs.length === 0}
                    className={getSelectClasses()}
                  >
                    <option value="">-- Выберите повара --</option>
                    {Array.isArray(chefs) && chefs.map(chef => (
                      <option key={chef.id} value={chef.id}>
                        {getChefName(chef)} - {getChefSpecialty(chef)} ({getChefStatus(chef)})
                      </option>
                    ))}
                  </select>
                  
                  {chefs.length === 0 && !loadingChefs && (
                    <p className="text-sm text-gray-500 mt-2">
                      Нет доступных поваров
                    </p>
                  )}
                  
                  {/* Информация о выбранном поваре */}
                  {formData.chefId && getSelectedChef() && (
                    <SubtleHover>
                      <div className="mt-4 p-4 bg-white rounded-xl border-2 border-purple-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getChefName(getSelectedChef()).charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getChefName(getSelectedChef())}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getChefSpecialty(getSelectedChef())}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getChefEmail(getSelectedChef())}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Опыт: {getSelectedChef()?.yearsOfExperience || 'Не указан'} лет
                            </p>
                          </div>
                        </div>
                      </div>
                    </SubtleHover>
                  )}
                </div>
              )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Выбор категории */}
        <AnimatedContainer animation="fadeInUp" delay={400} duration="normal">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              Выбор категории
            </h3>
            
            <div className="space-y-4">
              {loadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                  <span className="ml-3 text-gray-600">Загрузка категорий...</span>
                </div>
              ) : (
                <div>
                  <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                    Выберите категорию
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={saving || categories.length === 0}
                    className={getSelectClasses()}
                  >
                    <option value="">-- Без категории --</option>
                    {Array.isArray(categories) && categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name || 'Без названия'}
                      </option>
                    ))}
                  </select>
                  
                  {categories.length === 0 && !loadingCategories && (
                    <p className="text-sm text-gray-500 mt-2">
                      Нет доступных категорий
                    </p>
                  )}
                  
                  {/* Информация о выбранной категории */}
                  {formData.categoryId && getSelectedCategory() && (
                    <SubtleHover>
                      <div className="mt-4 p-4 bg-white rounded-xl border-2 border-pink-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center text-white">
                            <span className="text-xl">📁</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getSelectedCategory()?.name || 'Без названия'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getSelectedCategory()?.description || 'Нет описания'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SubtleHover>
                  )}
                </div>
              )}
            </div>
          </div>
        </AnimatedContainer>

        {/* Дополнительная информация */}

        <AnimatedContainer animation="fadeInUp" delay={500} duration="normal">
          <AnimatedCard hoverable={false} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
              Дополнительная информация
            </h3>
                
            {/* Основные метрики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <SubtleHover>
                <div className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-blue-600 mb-2">#{product.id}</div>
                  <div className="text-sm font-medium text-gray-600">ID товара</div>
                </div>
              </SubtleHover>
                
              <SubtleHover>
                <div className="text-center p-5 bg-white rounded-xl border-2 border-green-100 transition-all duration-300">
                  <div className="text-2xl font-bold text-green-600 mb-2">{product.price} ₽</div>
                  <div className="text-sm font-medium text-gray-600">Цена</div>
                </div>
              </SubtleHover>
                
              <SubtleHover>
                <div className="text-center p-5 bg-white rounded-xl border-2 border-emerald-100 transition-all duration-300">
                  <div className={`text-2xl font-bold mb-2 ${
                    product.isAvailable ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {product.isAvailable ? '🟢' : '🔴'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {product.isAvailable ? 'Доступен' : 'Не доступен'}
                  </div>
                </div>
              </SubtleHover>
                
              <SubtleHover>
                <div className="text-center p-5 bg-white rounded-xl border-2 border-orange-100 transition-all duration-300">
                  <div className="text-lg font-bold text-orange-600 mb-2 truncate px-2">
                    {getSelectedChef() ? getChefName(getSelectedChef()) : 'Не выбран'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">Повар</div>
                </div>
              </SubtleHover>
            </div>
                
            {/* Детальная информация */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-2"></div>
                Детальная информация
              </h4>
                
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID повара</span>
                  <span className="text-lg font-bold text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    #{product.chefId}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Категория</span>
                  <span className="text-lg font-bold text-gray-900 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    {getSelectedCategory()?.name || 'Не указана'}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID категории</span>
                  <span className="text-lg font-bold text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                    #{product.categoryId || '—'}
                  </span>
                </div>
              </div>
            </div>
                
            {/* Даты и статус */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Даты */}
              <div className="bg-white rounded-xl border-2 border-blue-100 p-5">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Даты
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Создан</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Обновлен</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
                
              {/* Статус */}
              <div className="bg-white rounded-xl border-2 border-green-100 p-5">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Статус
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Доступность</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      product.isAvailable ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {product.isAvailable ? 'Доступен' : 'Не доступен'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700">Повар</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {getSelectedChef() ? '✅ Выбран' : '❌ Не выбран'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </AnimatedContainer>

        {/* Кнопки действий */}
        <AnimatedContainer animation="fadeInUp" delay={600} duration="normal">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <AnimatedButton
              type="button"
              onClick={onCancel}
              disabled={saving}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Отмена
            </AnimatedButton>
            
            <AnimatedButton
              type="submit"
              disabled={saving || !formData.chefId}
              variant="primary"
              size="lg"
              loading={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Сохранить изменения
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedContainer>
      </form>
    </AnimatedContainer>
  );
}