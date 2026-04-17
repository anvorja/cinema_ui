// src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';
import { useToast } from './hooks/useToast';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import AdminSidebar from './AdminSidebar';
import DashboardHeader from './DashboardHeader';
import StatsCards from './StatsCards';
import MoviesTab from './movies/MoviesTab';
import UsersTab from './users/UsersTab';
import PurchasesTab from './purchases/PurchasesTab';
import TheatersTab from './theaters/TheatersTab';
import TicketsTab from './tickets/TicketsTab';
import AnalyticsTab from './analytics/AnalyticsTab';
import { ToastProvider } from './providers/ToasProvider.jsx';

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
  const [searchTerm, setSearchTerm] = useState('');

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadMovies(), loadTheaters(), loadUsers(), loadPurchases(), loadStats()]);
    } catch {
      toast.error('Error cargando datos. Los servicios pueden estar iniciando.', {
        title: 'Error de carga', duration: 8000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []); // eslint-disable-line

  const loadMovies    = async () => { try { const d = await adminApi.getMovies();    setMovies(Array.isArray(d) ? d : []);    } catch { setMovies([]); } };
  const loadTheaters  = async () => { try { const d = await adminApi.getTheaters();  setTheaters(Array.isArray(d) ? d : []); } catch { setTheaters([]); } };
  const loadUsers     = async () => { try { const d = await adminApi.getUsers();     setUsers(Array.isArray(d) ? d : []);     } catch { setUsers([]); } };
  const loadPurchases = async () => { try { const d = await adminApi.getPurchases(); setPurchases(Array.isArray(d) ? d : []); } catch { setPurchases([]); } };
  const loadStats     = async () => { try { const d = await adminApi.getSalesReport(); setStats(d || {}); } catch { setStats({}); } };

  // ── Handlers películas ────────────────────────────────────────────────────
  const handleCreateMovie = async (movieData) => {
    try {
      await adminApi.createMovie(movieData);
      await loadMovies();
      toast.success(`"${movieData.title}" creada exitosamente`, { title: 'Película creada', duration: 5000 });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al crear la película', { title: 'Error', duration: 7000 });
      throw error;
    }
  };

  const handleUpdateMovie = async (movieId, movieData) => {
    try {
      await adminApi.updateMovie(movieId, movieData);
      await loadMovies();
      toast.success(`"${movieData.title}" actualizada`, { title: 'Película actualizada' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al actualizar', { title: 'Error', duration: 7000 });
      throw error;
    }
  };

  const handleToggleMovie = async (movieId) => {
    try {
      await adminApi.toggleMovie(movieId);
      await loadMovies();
      const m = movies.find(x => x.id === movieId);
      toast.success(`${m?.title ?? 'Película'} ${m?.is_active ? 'deshabilitada' : 'habilitada'}`, { title: 'Estado actualizado' });
    } catch {
      toast.error('Error al cambiar el estado', { title: 'Error' });
    }
  };

  // ── Handlers teatros ──────────────────────────────────────────────────────
  const handleToggleTheater = async (theaterId) => {
    try {
      await adminApi.toggleTheater(theaterId);
      await loadTheaters();
      const t = theaters.find(x => x.id === theaterId);
      toast.success(`${t?.name ?? 'Teatro'} ${t?.is_active ? 'desactivado' : 'activado'}`, { title: 'Estado actualizado' });
    } catch {
      toast.error('Error al cambiar el estado del teatro', { title: 'Error' });
    }
  };

  // ── Handlers usuarios ─────────────────────────────────────────────────────
  const handleToggleUser = async (userId) => {
    try {
      await adminApi.toggleUser(userId);
      await loadUsers();
      const u = users.find(x => x.id === userId);
      const name = u ? `${u.first_name} ${u.last_name}` : 'Usuario';
      toast.success(`${name} ${u?.is_active ? 'deshabilitado' : 'habilitado'}`, { title: 'Estado actualizado' });
    } catch {
      toast.error('Error al cambiar el estado del usuario', { title: 'Error' });
    }
  };

  const handleTabChange = (tab) => { setActiveTab(tab); setSearchTerm(''); };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Sesión cerrada', { title: 'Logout exitoso' });
    } catch {
      toast.error('Error cerrando sesión', { title: 'Error' });
    }
  };

  const allEmpty = !loading && movies.length === 0 && users.length === 0 && purchases.length === 0;

  const renderTab = () => {
    switch (activeTab) {
      case 'movies':    return <MoviesTab movies={movies} loading={loading} onCreateMovie={handleCreateMovie} onUpdateMovie={handleUpdateMovie} onToggleMovie={handleToggleMovie} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'theaters':  return <TheatersTab theaters={theaters} loading={loading} onToggleTheater={handleToggleTheater} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'users':     return <UsersTab users={users} loading={loading} onToggleUser={handleToggleUser} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'purchases': return <PurchasesTab purchases={purchases} loading={loading} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
      case 'tickets':   return <TicketsTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-zinc-950">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          user={user}
          onLogout={handleLogout}
          onRefresh={loadInitialData}
          loading={loading}
        />

        <SidebarInset className="flex flex-col min-w-0 bg-gray-50 dark:bg-zinc-950">
          <DashboardHeader
            activeTab={activeTab}
            onRefresh={loadInitialData}
            loading={loading}
          />

          <main className="flex-1 px-6 py-6 overflow-auto">
            {/* Banner cold-start */}
            {allEmpty && (
              <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-300">Los servicios están iniciando</p>
                  <p className="text-xs text-amber-400/70 mt-0.5">
                    En el plan gratuito de Render los servicios se duermen tras 15 min de inactividad.
                    Espera unos segundos y pulsa <strong>Actualizar</strong>.
                  </p>
                </div>
              </div>
            )}

            <StatsCards movies={movies} users={users} purchases={purchases} stats={stats} />

            <div className="mt-2">{renderTab()}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AdminDashboard = () => (
  <ToastProvider>
    <AdminDashboardContent />
  </ToastProvider>
);

export default AdminDashboard;
