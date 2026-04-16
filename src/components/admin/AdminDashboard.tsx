// src/components/admin/AdminDashboard.jsx con Toasts
import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';
import { useToast } from './hooks/useToast';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import TabNavigation from './TabNavigation';
import MoviesTab from './movies/MoviesTab';
import UsersTab from './users/UsersTab';
import PurchasesTab from './purchases/PurchasesTab';
import TheatersTab from './theaters/TheatersTab';
import TicketsTab from './tickets/TicketsTab';
import AnalyticsTab from './analytics/AnalyticsTab';
import {ToastProvider} from "./providers/ToasProvider.jsx";

const AdminDashboardContent = () => {
  const { user, logout } = useAuth();
  const { adminApi } = useApi();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [_loadError, setLoadError] = useState(false);

  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const loadInitialData = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      await Promise.all([
        loadMovies(),
        loadTheaters(),
        loadUsers(),
        loadPurchases(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoadError(true);
      toast.error('Error cargando datos. Los servicios pueden estar iniciando — intenta de nuevo en unos segundos.', {
        title: 'Error de carga',
        duration: 8000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales al montar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadInitialData(); }, []);

  const loadMovies = async () => {
    try {
      const data = await adminApi.getMovies();
      setMovies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando películas:', error);
      setMovies([]);
    }
  };

  const loadTheaters = async () => {
    try {
      const data = await adminApi.getTheaters();
      setTheaters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando teatros:', error);
      setTheaters([]);
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

      // Toast de éxito
      toast.success(`La película "${movieData.title}" se creó exitosamente`, {
        title: 'Película creada',
        duration: 5000
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error creando película:', error);

      // Toast de error con detalles
      const errorMessage = error.response?.data?.detail || 'Error desconocido al crear la película';
      toast.error(errorMessage, {
        title: 'Error creando película',
        duration: 7000
      });

      throw error;
    }
  };

  const handleUpdateMovie = async (movieId, movieData) => {
    try {
      await adminApi.updateMovie(movieId, movieData);
      await loadMovies(); // Recargar la lista

      // Toast de éxito
      toast.success(`La película "${movieData.title}" se actualizó correctamente`, {
        title: 'Película actualizada'
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error actualizando película:', error);

      // Toast de error
      const errorMessage = error.response?.data?.detail || 'Error desconocido al actualizar la película';
      toast.error(errorMessage, {
        title: 'Error actualizando película',
        duration: 7000
      });

      throw error;
    }
  };

  const handleToggleMovie = async (movieId) => {
    try {
      await adminApi.toggleMovie(movieId);
      await loadMovies(); // Recargar la lista

      // Encontrar la película para mostrar su nombre en el toast
      const movie = movies.find(m => m.id === movieId);
      const movieName = movie ? movie.title : 'Película';
      const action = movie?.is_active ? 'deshabilitada' : 'habilitada';

      toast.success(`${movieName} fue ${action} exitosamente`, {
        title: 'Estado actualizado'
      });

    } catch (error) {
      console.error('Error cambiando estado de película:', error);

      toast.error('Error al cambiar el estado de la película', {
        title: 'Error de actualización'
      });
    }
  };

  // Handlers para teatros
  const handleToggleTheater = async (theaterId) => {
    try {
      await adminApi.toggleTheater(theaterId);
      await loadTheaters();
      const theater = theaters.find(t => t.id === theaterId);
      const theaterName = theater ? theater.name : 'Teatro';
      const action = theater?.is_active ? 'desactivado' : 'activado';
      toast.success(`${theaterName} fue ${action} exitosamente`, {
        title: 'Estado actualizado'
      });
    } catch (error) {
      console.error('Error cambiando estado de teatro:', error);
      toast.error('Error al cambiar el estado del teatro', {
        title: 'Error de actualización'
      });
    }
  };

  // Handlers para usuarios
  const handleToggleUser = async (userId) => {
    try {
      await adminApi.toggleUser(userId);
      await loadUsers(); // Recargar la lista

      // Encontrar el usuario para mostrar su nombre en el toast
      const user = users.find(u => u.id === userId);
      const userName = user ? `${user.first_name} ${user.last_name}` : 'Usuario';
      const action = user?.is_active ? 'deshabilitado' : 'habilitado';

      toast.success(`${userName} fue ${action} exitosamente`, {
        title: 'Estado de usuario actualizado'
      });

    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);

      toast.error('Error al cambiar el estado del usuario', {
        title: 'Error de actualización'
      });
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
      toast.info('Sesión cerrada exitosamente', {
        title: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error durante logout:', error);
      toast.error('Error cerrando sesión', {
        title: 'Error de logout'
      });
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

      case 'theaters':
        return (
          <TheatersTab
            theaters={theaters}
            loading={loading}
            onToggleTheater={handleToggleTheater}
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

      case 'tickets':
        return <TicketsTab />;

      case 'analytics':
        return <AnalyticsTab />;

      default:
        return null;
    }
  };

  // Detectar si todos los datos llegaron vacíos tras cargar (posible cold-start)
  const allEmpty = !loading && movies.length === 0 && users.length === 0 && purchases.length === 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <DashboardHeader
        user={user}
        onLogout={handleLogout}
        onRefresh={loadInitialData}
        loading={loading}
      />

      {/* Main Content */}
      <div className="px-6 py-6">

        {/* Banner cold-start */}
        {allEmpty && (
          <div className="mb-6 flex items-start gap-3 bg-yellow-900/30 border border-yellow-600/40 rounded-lg px-5 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-300">Los servicios del backend están iniciando</p>
              <p className="text-xs text-yellow-400/80 mt-0.5">
                En el plan gratuito de Render los servicios se duermen tras 15 min de inactividad.
                Espera unos segundos y haz clic en <strong>Actualizar</strong>.
              </p>
            </div>
            <button
              onClick={loadInitialData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        )}

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

const AdminDashboard = () => {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
};

export default AdminDashboard;