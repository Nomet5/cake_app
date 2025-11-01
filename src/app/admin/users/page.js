// app/admin/users/page.js
import { getUsers } from "../../actions/admin/user.actions";
import UsersTable from "./components/users-table";
import UsersFilters from "./components/users-filters";
import StatsOverview from "./components/stats-overview";
import SearchFilters from "./components/search-filters";
import CreateUserButton from "./components/create-user-button"; // Измените импорт

export default async function UsersPage({ searchParams = {} }) {
  const users = await getUsers();
  
  // Безопасное извлечение параметров
  const searchQuery = searchParams.search || '';
  const roleFilter = searchParams.role || '';

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    // Фильтр по поиску
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.firstName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase()?.includes(query);
      if (!matchesSearch) return false;
    }

    // Фильтр по роли
    if (roleFilter === 'chef' && !user.chefProfile) return false;
    if (roleFilter === 'customer' && user.chefProfile) return false;

    return true;
  });

  return (
    <div className="p-6 space-y-6 admin-transition">
      {/* Заголовок с анимацией */}
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Пользователи
          </h1>
          <p className="text-gray-600 mt-1 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            Управление пользователями системы
          </p>
        </div>
        <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CreateUserButton /> {/* Используйте новый компонент */}
        </div>
      </div>

      {/* Статистика с ступенчатой анимацией */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <StatsOverview users={filteredUsers} />
      </div>

      {/* Поиск с анимацией */}
      <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
        <SearchFilters />
      </div>

      {/* Фильтры с анимацией */}
      <div className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
        <UsersFilters />
      </div>

      {/* Таблица с анимацией */}
      <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <UsersTable users={filteredUsers} />
      </div>

      {/* Пустое состояние с анимацией */}
      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="text-center py-12 animate-pulse">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      )}

      {/* Анимация при первом запуске */}
      {filteredUsers.length === 0 && users.length === 0 && (
        <div className="text-center py-20 animate-bounce">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Нет пользователей</h3>
          <p className="text-gray-600 mb-6">Создайте первого пользователя чтобы начать работу</p>
          <div className="animate-pulse">
            <CreateUserButton /> {/* Используйте новый компонент */}
          </div>
        </div>
      )}
    </div>
  );
}