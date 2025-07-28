// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Plus,
  Eye,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3, CarIcon, TrendingUpIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { carService } from '../services/api';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { cn } from '../utils';
import {ChartBarIcon, EyeIcon, PlusIcon} from "@heroicons/react/24/outline";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar datos reales de la API
      const carsResponse = await carService.getCars();
      const cars = carsResponse.data.data || [];

      // Calcular estadísticas
      const totalCars = cars.length;
      const availableCars = cars.filter(car => car.is_available !== false).length;

      // Obtener marcas más comunes
      const brandCounts = cars.reduce((acc, car) => {
        acc[car.brand] = (acc[car.brand] || 0) + 1;
        return acc;
      }, {});
      const topBrand = Object.keys(brandCounts).reduce((a, b) =>
        brandCounts[a] > brandCounts[b] ? a : b, 'N/A'
      ) || 'N/A';

      setStats({
        totalCars,
        availableCars,
        totalValue: cars.length * 50000000, // Valor estimado
        topBrand
      });

      // Ordenar por fecha de creación y tomar los 5 más recientes
      const sortedCars = cars.sort((a, b) =>
        new Date(b.created_at || b.createdAt || Date.now()) -
        new Date(a.created_at || a.createdAt || Date.now())
      );
      setRecentCars(sortedCars.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Error al cargar datos del dashboard', 'error');

      // Datos de fallback en caso de error
      setStats({
        totalCars: 0,
        availableCars: 0,
        totalValue: 0,
        topBrand: 'N/A'
      });
      setRecentCars([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, change, icon: Icon, trend = 'stable', color = 'blue' }) => {
    const getColorClasses = () => {
      switch (color) {
        case 'green':
          return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
        case 'purple':
          return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
        case 'amber':
          return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
        default:
          return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      }
    };

    const getIconBg = () => {
      switch (color) {
        case 'green': return 'from-green-500 to-emerald-600';
        case 'purple': return 'from-purple-500 to-violet-600';
        case 'amber': return 'from-amber-500 to-yellow-600';
        default: return 'from-blue-500 to-cyan-600';
      }
    };

    const getTrendIcon = () => {
      if (trend === 'up') return '↗️';
      if (trend === 'down') return '↘️';
      return '→';
    };

    return (
      <GlassCard className={cn('p-6', getColorClasses())} hover>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-xl bg-gradient-to-br shadow-lg',
              getIconBg()
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {change !== undefined && (
            <div className="text-right">
              <div className="text-lg">{getTrendIcon()}</div>
              <p className={cn(
                'text-sm font-medium',
                trend === 'up' && 'text-green-400',
                trend === 'down' && 'text-red-400',
                trend === 'stable' && 'text-gray-400'
              )}>
                {change > 0 ? '+' : ''}{change}%
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    );
  };

  const RecentCarsCard = ({ cars }) => (
    <GlassCard className="p-6" hover>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-400" />
          Autos Recientes
        </h3>
        <Link to="/cars">
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            Ver todos
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {cars.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay autos registrados</p>
            <Link to="/cars">
              <Button variant="outline" size="sm" className="mt-2">
                <PlusIcon className="w-4 h-4 mr-1" />
                Agregar primer auto
              </Button>
            </Link>
          </div>
        ) : (
          cars.map((car) => (
            <div key={car.car_id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600 relative">
                <div className="w-full h-full flex items-center justify-center">
                  <CarIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{car.brand} {car.model}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Disponible
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {car.year} • {car.color} • {car.plate_number}
                </p>
              </div>

              <Button variant="ghost" size="sm" className="hover:bg-white/10">
                <EyeIcon className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );

  const QuickActionsCard = () => {
    const actions = [
      {
        title: 'Agregar Auto',
        description: 'Registrar nuevo vehículo',
        href: '/cars',
        icon: PlusIcon,
        color: 'green'
      },
      {
        title: 'Ver Inventario',
        description: 'Gestionar autos existentes',
        href: '/cars',
        icon: CarIcon,
        color: 'blue'
      },
      {
        title: 'Estadísticas',
        description: 'Análisis y reportes',
        href: '/cars',
        icon: ChartBarIcon,
        color: 'purple'
      }
    ];

    return (
      <GlassCard className="p-6" hover>
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5 text-purple-400" />
          Acciones Rápidas
        </h3>

        <div className="grid gap-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
            >
              <div className={cn(
                'p-3 rounded-lg bg-gradient-to-br shadow-lg',
                action.color === 'green' && 'from-green-500 to-emerald-600',
                action.color === 'blue' && 'from-blue-500 to-cyan-600',
                action.color === 'purple' && 'from-purple-500 to-violet-600'
              )}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium group-hover:text-white transition-colors">
                  {action.title}
                </p>
                <p className="text-sm text-gray-400">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </GlassCard>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-white/10 rounded-lg"></div>
            </GlassCard>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ¡Bienvenido, {user?.first_name || 'Usuario'}!
          </h1>
          <p className="text-gray-400 mt-1">
            Resumen de tu inventario de vehículos
          </p>
        </div>

        <Link to="/cars">
          <Button
            variant="primary"
            className="shadow-lg bg-gradient-to-r from-blue-500 via-purple-600 to-amber-500 hover:from-blue-600 hover:via-purple-700 hover:to-amber-600"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Agregar Auto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Autos"
            value={stats.totalCars}
            change={12}
            icon={CarIcon}
            trend="up"
            color="blue"
          />
          <StatCard
            title="Disponibles"
            value={stats.availableCars}
            change={8}
            icon={TrendingUpIcon}
            trend="up"
            color="green"
          />
          <StatCard
            title="Valor Estimado"
            value={`${(stats.totalValue / 1000000).toFixed(1)}M`}
            change={15}
            icon={CurrencyDollarIcon}
            trend="up"
            color="amber"
          />
          <StatCard
            title="Marca Top"
            value={stats.topBrand}
            icon={UsersIcon}
            color="purple"
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCarsCard cars={recentCars} />
        </div>
        <div>
          <QuickActionsCard />
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {stats?.totalCars === 0 && (
        <GlassCard className="p-8 text-center" variant="primary">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-amber-500 flex items-center justify-center mx-auto mb-4">
              <CarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">¡Comienza tu inventario!</h3>
            <p className="text-gray-400 mb-6">
              Aún no tienes autos registrados. Agrega tu primer vehículo para comenzar a gestionar tu inventario.
            </p>
            <Link to="/cars">
              <Button variant="primary" size="lg">
                <PlusIcon className="w-5 h-5 mr-2" />
                Agregar mi primer auto
              </Button>
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default DashboardPage;