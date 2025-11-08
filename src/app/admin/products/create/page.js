// app/admin/products/create/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductForm from './components/create-product-form';
import { createProduct } from '../../../actions/admin/product.actions';
import { getChefs } from '../../../actions/admin/chef.actions';
import { getActiveCategories } from '../../../actions/admin/category.actions';
import { 
  AnimatedContainer,
  FloatingElement,
  SubtleHover 
} from "../../Components/animation-component";

const CreateProductPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chefs, setChefs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoadingData(true);
        console.log('🔄 Starting to load form data...');
        
        // Параллельная загрузка поваров и категорий
        const [chefsData, categoriesData] = await Promise.all([
          getChefs(),
          getActiveCategories()
        ]);

        console.log('📥 Raw chefs data:', chefsData);
        console.log('📥 Raw categories data:', categoriesData);
        console.log('📊 Chefs data type:', typeof chefsData);
        console.log('📊 Categories data type:', typeof categoriesData);
        console.log('🔍 Chefs is array:', Array.isArray(chefsData));
        console.log('🔍 Categories is array:', Array.isArray(categoriesData));

        // Обрабатываем разные форматы данных
        const processedChefs = processData(chefsData, 'chefs');
        const processedCategories = processData(categoriesData, 'categories');

        console.log('✅ Processed chefs:', processedChefs);
        console.log('✅ Processed categories:', processedCategories);

        setChefs(processedChefs);
        setCategories(processedCategories);
        
      } catch (err) {
        console.error('❌ Error loading form data:', err);
        setError('Ошибка загрузки данных для формы');
      } finally {
        setIsLoadingData(false);
      }
    };

    // Функция для обработки разных форматов данных
    const processData = (data, type) => {
      console.log(`🔄 Processing ${type} data:`, data);
      
      if (!data) {
        console.warn(`❌ ${type} data is null or undefined`);
        return [];
      }
      
      // Если это уже массив, возвращаем как есть
      if (Array.isArray(data)) {
        console.log(`✅ ${type} data is array, length:`, data.length);
        return data;
      }
      
      // Если это объект с данными
      if (typeof data === 'object') {
        console.log(`🔄 ${type} data is object, checking structure...`);
        
        // Проверяем разные возможные структуры
        if (data.chefs && Array.isArray(data.chefs)) {
          console.log(`✅ Found ${type} in data.chefs`);
          return data.chefs;
        }
        if (data.categories && Array.isArray(data.categories)) {
          console.log(`✅ Found ${type} in data.categories`);
          return data.categories;
        }
        if (data.data && Array.isArray(data.data)) {
          console.log(`✅ Found ${type} in data.data`);
          return data.data;
        }
        if (data.items && Array.isArray(data.items)) {
          console.log(`✅ Found ${type} in data.items`);
          return data.items;
        }
        if (data.success && Array.isArray(data.data)) {
          console.log(`✅ Found ${type} in data.data (success structure)`);
          return data.data;
        }
        if (data.success && Array.isArray(data.categories)) {
          console.log(`✅ Found ${type} in data.categories (success structure)`);
          return data.categories;
        }
        if (data.success && Array.isArray(data.chefs)) {
          console.log(`✅ Found ${type} in data.chefs (success structure)`);
          return data.chefs;
        }
        
        // Проверяем ключи объекта
        const keys = Object.keys(data);
        console.log(`📋 ${type} object keys:`, keys);
        
        // Ищем любой массив в объекте
        for (const key of keys) {
          if (Array.isArray(data[key])) {
            console.log(`✅ Found array in ${type}.${key}`);
            return data[key];
          }
        }
        
        // Если объект имеет структуру { success: true, data: [...] }
        if (data.success && data.data && typeof data.data === 'object') {
          console.log(`🔄 ${type} has success structure, checking data...`);
          return processData(data.data, `${type}.data`);
        }
      }
      
      // Если данные в неподдерживаемом формате
      console.warn(`❌ Unsupported ${type} data format:`, data);
      return [];
    };

    loadFormData();
  }, []);

  // Обработчик создания товара
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Создаем FormData для передачи в server action
      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description || '');
      submitFormData.append("price", formData.price.toString());
      submitFormData.append("chefId", formData.chefId.toString());
      
      // Добавляем categoryId только если он выбран
      if (formData.categoryId) {
        submitFormData.append("categoryId", formData.categoryId.toString());
      }
      
      submitFormData.append("isAvailable", formData.isAvailable.toString());

      console.log('📤 Submitting product data:', formData);

      // Вызов server action для создания продукта
      const result = await createProduct(submitFormData);
      
      console.log('📥 Create product result:', result);
      
      if (result.success) {
        // Успешное создание - переход к списку товаров
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.error || 'Произошла ошибка при создании товара');
      }
      
    } catch (err) {
      setError(err.message || 'Произошла непредвиденная ошибка');
      console.error('Error creating product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить создание товара? Все несохраненные данные будут потеряны.')) {
      router.push('/admin/products');
    }
  };

  // Отладочная информация
  useEffect(() => {
    console.log('📊 Current state:');
    console.log('chefs:', chefs);
    console.log('categories:', categories);
    console.log('chefs length:', chefs.length);
    console.log('categories length:', categories.length);
    console.log('isLoadingData:', isLoadingData);
  }, [chefs, categories, isLoadingData]);

  // Статистика для информационных блоков
  const stats = {
    requiredFields: 5,
    maxImages: 10
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <AnimatedContainer animation="fadeIn" delay={100}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Заголовок страницы */}
          <div className="mb-8">
            <AnimatedContainer animation="fadeInUp" delay={200}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FloatingElement speed="slow">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white text-2xl">➕</span>
                    </div>
                  </FloatingElement>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Создание нового продукта
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                      Заполните информацию о новом продукте для вашего меню
                    </p>
                    
                    {/* Отладочная информация */}
                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      <button
                        onClick={() => {
                          console.log('=== DEBUG INFO ===');
                          console.log('Chefs:', chefs);
                          console.log('Categories:', categories);
                          console.log('Chefs count:', chefs.length);
                          console.log('Categories count:', categories.length);
                        }}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-700"
                      >
                        Показать отладку
                      </button>
                      <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">
                        Поваров: {chefs.length}
                      </span>
                      <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                        Категорий: {categories.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Кнопка назад */}
                <SubtleHover>
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Назад к списку
                  </button>
                </SubtleHover>
              </div>
            </AnimatedContainer>
          </div>

          {/* Сообщение об ошибке */}
          {error && (
            <AnimatedContainer animation="fadeInUp" delay={400}>
              <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800">
                      Ошибка создания продукта
                    </h3>
                    <p className="text-red-700 mt-2">
                      {error}
                    </p>
                    <div className="mt-3 text-sm text-red-600">
                      Проверьте правильность заполнения всех обязательных полей
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Сообщение об отсутствии данных */}
          {!isLoadingData && (chefs.length === 0 || categories.length === 0) && (
            <AnimatedContainer animation="fadeInUp" delay={400}>
              <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Внимание: отсутствуют данные
                    </h3>
                    <div className="text-yellow-700 mt-2 space-y-1">
                      {chefs.length === 0 && <p>• Нет доступных поваров</p>}
                      {categories.length === 0 && <p>• Нет доступных категорий</p>}
                    </div>
                    <div className="mt-3 text-sm text-yellow-600">
                      Для создания продукта необходимы повара и категории. 
                      Проверьте консоль браузера для подробной информации.
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          )}

          {/* Основной контент */}
          <AnimatedContainer animation="fadeInUp" delay={500}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                {/* Форма создания товара */}
                {isLoadingData ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка данных...</p>
                  </div>
                ) : (
                  <CreateProductForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                    chefs={chefs}
                    categories={categories}
                  />
                )}
              </div>
            </div>
          </AnimatedContainer>

          {/* Дополнительная информация */}
          <AnimatedContainer animation="fadeInUp" delay={600} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Подсказки */}
              <FloatingElement speed="normal">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    💡 Полезные подсказки
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Поля помеченные <span className="text-red-500">*</span> обязательны для заполнения</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Выберите повара из доступного списка</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Категория помогает организовать продукты в меню</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Укажите реалистичную цену для привлечения клиентов</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Описание помогает клиентам понять особенности продукта</span>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Статистика создания */}
              <FloatingElement speed="normal">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    📊 Информация о данных
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{chefs.length}</div>
                      <div className="text-green-700 font-medium">Доступных поваров</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                      <div className="text-green-700 font-medium">Активных категорий</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{stats.requiredFields}</div>
                      <div className="text-green-700 font-medium">Обязательных полей</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{stats.maxImages}</div>
                      <div className="text-green-700 font-medium">Макс. изображений</div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </AnimatedContainer>

          {/* Футер с информацией */}
          <AnimatedContainer animation="fadeInUp" delay={700} className="mt-8">
            <div className="text-center text-sm text-gray-500">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Все данные защищены</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Доступно поваров: {chefs.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Активных категорий: {categories.length}</span>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default CreateProductPage;