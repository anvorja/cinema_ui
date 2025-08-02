// src/pages/CarsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import { carService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CarCard from '../components/cars/CarCard';
import CarForm from '../components/cars/CarForm';
import CarFilters from '../components/cars/CarFilters';
import CarStats from '../components/cars/CarStats';
import Modal from '../components/ui/Modal';
import { Search, Filter, BarChart3, Sparkles } from 'lucide-react';

// Componente GlassCard para efectos glassmórficos
const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
      <div
          className={`
        backdrop-blur-xl bg-white/10 dark:bg-white/5
        border border-white/20 dark:border-white/10
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 dark:hover:border-white/20 hover:shadow-3xl hover:-translate-y-1' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
          {...props}
      >
        {children}
      </div>
  );
};

// Componente para efectos de brillo animado
const ShimmerEffect = ({ children, className = "" }) => {
  return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
        {children}
      </div>
  );
};

const CarsPage = () => {
  // Estados principales
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  // Estados de filtros
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    minYear: '',
    maxYear: ''
  });

  // Estados de estadísticas
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const { showToast } = useToast();

  // Cargar lista de autos
  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      const response = await carService.getAll();
      setCars(response.data.data || []);
    } catch (error) {
      console.error('Error cargando autos:', error);
      showToast('Error al cargar los autos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await carService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadCars(),
          loadStats()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    void initializeData();
  }, [loadCars, loadStats]);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = [...cars];

    // Búsqueda por término
    if (searchTerm) {
      filtered = filtered.filter(car =>
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros
    if (filters.brand) {
      filtered = filtered.filter(car => car.brand === filters.brand);
    }
    if (filters.model) {
      filtered = filtered.filter(car => car.model === filters.model);
    }
    if (filters.year) {
      filtered = filtered.filter(car => car.year.toString() === filters.year);
    }
    if (filters.color) {
      filtered = filtered.filter(car => car.color === filters.color);
    }
    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.minYear));
    }
    if (filters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.maxYear));
    }

    setFilteredCars(filtered);
  }, [cars, searchTerm, filters]);

  // Funciones de manejo
  const clearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      year: '',
      color: '',
      minYear: '',
      maxYear: ''
    });
    setSearchTerm('');
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  const handleDelete = async (carId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este auto?')) {
      try {
        await carService.delete(carId);
        showToast('Auto eliminado exitosamente', 'success');
        loadCars();
      } catch (error) {
        console.error('Error eliminando auto:', error);
        showToast('Error al eliminar el auto', 'error');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCar) {
        await carService.update(editingCar.car_id, formData);
        showToast('Auto actualizado exitosamente', 'success');
      } else {
        await carService.create(formData);
        showToast('Auto agregado exitosamente', 'success');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      setEditingCar(null);
      loadCars();
    } catch (error) {
      console.error('Error guardando auto:', error);
      showToast(
          editingCar ? 'Error al actualizar el auto' : 'Error al agregar el auto',
          'error'
      );
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden flex items-center justify-center">
          {/* Efectos de fondo animados */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10">
            <LoadingSpinner size="lg" />
            <p className="text-slate-600 dark:text-slate-300 mt-4 text-center">Cargando tus autos...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
                  Mis Autos
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Gestiona tu colección de autos de forma fácil y organizada
                </p>
              </div>

              <div className="flex gap-3">
                {stats && (
                    <Button
                        variant="ghost"
                        onClick={() => setShowStats(!showStats)}
                        className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Ver Estadísticas
                    </Button>
                )}

                <ShimmerEffect>
                  <Button
                      onClick={() => setShowAddModal(true)}
                      variant="primary"
                      size="lg"
                      className="shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 border-0"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Agregar Auto
                  </Button>
                </ShimmerEffect>


              </div>
            </div>
          </div>

          {/* Estadísticas */}
          {showStats && stats && (
              <div className="mb-8">
                <GlassCard className="p-6">
                  <CarStats stats={stats} />
                </GlassCard>
              </div>
          )}

          {/* Búsqueda */}
          <div className="mb-6">
            <GlassCard className="p-4" hover={false}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <Input
                    type="search"
                    placeholder="Buscar por marca, modelo, placa o color..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-400 dark:focus:border-blue-300 backdrop-blur-sm"
                />
              </div>
            </GlassCard>
          </div>

          {/* Filtros */}
          {cars.length > 0 && (
              <div className="mb-8">
                <GlassCard className="p-6">
                  <CarFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClear={clearFilters}
                      cars={cars}
                  />
                </GlassCard>
              </div>
          )}

          {/* Contador de resultados */}
          {cars.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {filteredCars.length === cars.length
                      ? `Mostrando ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
                      : `Mostrando ${filteredCars.length} de ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
          )}

          {/* Lista de autos o estados vacíos */}
          {filteredCars.length === 0 ? (
              <GlassCard className="p-16 text-center" hover={false}>
                {cars.length === 0 ? (
                    <div>
                      <div className="text-8xl mb-6">🚗</div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        No tienes autos registrados
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                        Comienza agregando tu primer auto para empezar a organizar tu colección
                      </p>
                      <ShimmerEffect>
                        <Button
                            onClick={() => setShowAddModal(true)}
                            variant="primary"
                            size="lg"
                            className="shadow-lg hover:shadow-xl"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Agregar Mi Primer Auto
                        </Button>
                      </ShimmerEffect>
                    </div>
                ) : (
                    <div>
                      <div className="text-8xl mb-6">🔍</div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                        No se encontraron autos
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                        Intenta ajustar tus filtros o términos de búsqueda
                      </p>
                      <Button
                          onClick={clearFilters}
                          variant="secondary"
                          size="lg"
                          className="backdrop-blur-sm bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20"
                      >
                        <Filter className="w-5 h-5 mr-2" />
                        Limpiar Filtros
                      </Button>
                    </div>
                )}
              </GlassCard>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                    <CarCard
                        key={car.car_id}
                        car={car}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
              </div>
          )}

          {/* Modales */}
          <Modal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              title="Agregar Nuevo Auto"
          >
            <CarForm
                onSubmit={handleFormSubmit}
                onCancel={() => setShowAddModal(false)}
            />
          </Modal>

          <Modal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingCar(null);
              }}
              title="Editar Auto"
          >
            <CarForm
                car={editingCar}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingCar(null);
                }}
            />
          </Modal>
        </div>
      </div>
  );
};

export default CarsPage;