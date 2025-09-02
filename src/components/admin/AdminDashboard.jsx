// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';

// Componentes
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import TabNavigation from './TabNavigation';
import MoviesTab from './movies/MoviesTab';
import UsersTab from './users/UsersTab';
import PurchasesTab from './purchases/PurchasesTab';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { adminApi } = useApi();

  // Estados principales
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMovies(),
        loadUsers(),
        loadPurchases(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      const data = await adminApi.getMovies();
      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando películas:', error);
      setMovies([]);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsers([]);
    }
  };

  const loadPurchases = async () => {
    try {
      const data = await adminApi.getPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando compras:', error);
      setPurchases([]);
    }
  };

  const loadStats = async () => {
    try {
      const salesReport = await adminApi.getSalesReport();
      setStats(salesReport || {});
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({});
    }
  };

  // Handlers para películas
  const handleCreateMovie = async (movieData) => {
    try {
      await adminApi.createMovie(movieData);
      await loadMovies(); // Recargar la lista
      return Promise.resolve();
    } catch (error) {
      console.error('Error creando película:', error);
      throw error;
    }
  };

  const handleUpdateMovie = async (movieId, movieData) => {
    try {
      await adminApi.updateMovie(movieId, movieData);
      await loadMovies(); // Recargar la lista
      return Promise.resolve();
    } catch (error) {
      console.error('Error actualizando película:', error);
      throw error;
    }
  };

  const handleToggleMovie = async (movieId) => {
    try {
      await adminApi.toggleMovie(movieId);
      await loadMovies(); // Recargar la lista
    } catch (error) {
      console.error('Error cambiando estado de película:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Handlers para usuarios
  const handleToggleUser = async (userId) => {
    try {
      await adminApi.toggleUser(userId);
      await loadUsers(); // Recargar la lista
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Handler para cambio de tab
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchTerm(''); // Limpiar búsqueda al cambiar de tab
  };

  // Handler para logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'movies':
        return (
          <MoviesTab
            movies={movies}
            loading={loading}
            onCreateMovie={handleCreateMovie}
            onUpdateMovie={handleUpdateMovie}
            onToggleMovie={handleToggleMovie}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );

      case 'users':
        return (
          <UsersTab
            users={users}
            loading={loading}
            onToggleUser={handleToggleUser}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );

      case 'purchases':
        return (
          <PurchasesTab
            purchases={purchases}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <DashboardHeader user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <StatsCards
          movies={movies}
          users={users}
          purchases={purchases}
          stats={stats}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;