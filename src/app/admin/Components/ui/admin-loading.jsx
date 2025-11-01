// src/app/admin/Components/ui/admin-loading.jsx
"use client";

import { useEffect, useState } from 'react';

export default function AdminLoading() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [lockOpened, setLockOpened] = useState(false);

  const loadingSteps = [
    { text: "Загрузка модулей безопасности...", percent: 20 },
    { text: "Инициализация базы данных...", percent: 45 },
    { text: "Проверка прав доступа...", percent: 70 },
    { text: "Загрузка интерфейса...", percent: 85 },
    { text: "Готово! Запуск панели...", percent: 100 }
  ];

  useEffect(() => {
    // Симуляция прогресса загрузки
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Обновляем текущий шаг
        const currentStepIndex = loadingSteps.findIndex(step => newProgress <= step.percent);
        if (currentStepIndex !== -1 && currentStepIndex !== currentStep) {
          setCurrentStep(currentStepIndex);
        }

        // Анимация открытия замка при 75%
        if (newProgress >= 70 && !lockOpened) {
          setLockOpened(true);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [currentStep, lockOpened]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center animate-fade-in">
      <div className="text-center w-full max-w-2xl mx-4 p-8">
        
        {/* Анимированный заголовок */}
        <div className="mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cake Admin
          </h1>
          <p className="text-slate-600 text-lg">Система управления контентом</p>
        </div>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-12">
          
          {/* Анимированный замочек */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-gentle relative overflow-hidden">
                
                {/* Замок */}
                <div className={`relative transition-all duration-1000 ${lockOpened ? 'scale-110' : 'scale-100'}`}>
                  
                  {/* Основа замка */}
                  <div className="w-16 h-16 bg-white rounded-xl relative shadow-inner">
                    
                    {/* Дужка замка */}
                    <div className={`
                      absolute -top-4 left-1/2 transform -translate-x-1/2
                      w-12 h-8 border-4 border-white rounded-t-full
                      transition-all duration-1000
                      ${lockOpened 
                        ? 'opacity-0 scale-0 rotate-90' 
                        : 'opacity-100 scale-100 rotate-0'
                      }
                    `}></div>
                    
                    {/* Ключевое отверстие */}
                    <div className={`
                      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      w-3 h-3 bg-blue-500 rounded-full
                      transition-all duration-500
                      ${lockOpened ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}
                    `}></div>
                    
                    {/* Линия замка */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                  
                  {/* Эффект открытия */}
                  {lockOpened && (
                    <>
                      <div className="absolute inset-0 bg-yellow-300 rounded-xl animate-ping opacity-40"></div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Анимированные частицы */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Прогресс и информация */}
          <div className="flex-1 max-w-md">
            
            {/* Текущий статус с фиксированной высотой */}
            <div className="h-20 mb-6 flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-700 text-xl font-semibold mb-2 animate-pulse-gentle">
                  {loadingSteps[currentStep]?.text}
                </p>
                <div className="flex items-center justify-center space-x-2 text-slate-500">
                  <div className="loader-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span className="text-sm">Загрузка...</span>
                </div>
              </div>
            </div>

            {/* Прогресс-бар */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Прогресс инициализации</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Эффект shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/50 rounded-lg p-3 shadow-sm">
                <div className="text-slate-500">Модули</div>
                <div className="font-semibold text-slate-700">12/12</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 shadow-sm">
                <div className="text-slate-500">Безопасность</div>
                <div className="font-semibold text-green-600">✓ Активна</div>
              </div>
            </div>
          </div>
        </div>

        {/* Анимированные элементы фона */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-8 h-8 bg-purple-200 rounded-full opacity-30 animate-float-slow"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-indigo-300 rounded-full opacity-10 animate-bounce-slow"></div>
          <div className="absolute bottom-40 right-10 w-10 h-10 bg-blue-300 rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Футер */}
        <div className="mt-12 animate-fade-in-up">
          <p className="text-slate-500 text-sm">
            © 2025 Cake Admin System • v1.1.0
          </p>
        </div>
      </div>
    </div>
  );
}