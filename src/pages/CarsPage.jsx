// src/pages/CarsPage.jsx - Dark Mode optimizado
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
    // ✅ CAMBIO 1: Manejar la Promise correctamente
    loadCars().catch((error) => {
      console.error('Error loading cars on mount:', error);
    });
    loadStats().catch((error) => {
      console.error('Error loading stats on mount:', error);
    });
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
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    if (filters.model) {
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(filters.model.toLowerCase())
      );
    }
    if (filters.year) {
      filtered = filtered.filter(car => car.year.toString() === filters.year);
    }
    if (filters.color) {
      filtered = filtered.filter(car =>
        car.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }
    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.minYear));
    }
    if (filters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.maxYear));
    }

    setFilteredCars(filtered);
  }, [cars, searchTerm, filters]);

  // Funciones CRUD
  const handleCreate = async (carData) => {
    try {
      await carService.create(carData);
      showToast('Auto creado exitosamente', 'success');
      setShowAddModal(false);
      loadCars();
      loadStats();
    } catch (error) {
      console.error('Error creando auto:', error);
      const message = error.response?.data?.message || 'Error al crear el auto';
      showToast(message, 'error');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  const handleUpdate = async (carData) => {
    try {
      await carService.update(editingCar.car_id, carData);
      showToast('Auto actualizado exitosamente', 'success');
      setShowEditModal(false);
      setEditingCar(null);
      loadCars();
      loadStats();
    } catch (error) {
      console.error('Error actualizando auto:', error);
      const message = error.response?.data?.message || 'Error al actualizar el auto';
      showToast(message, 'error');
    }
  };

  const handleDelete = async (carId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este auto?')) return;

    try {
      await carService.delete(carId);
      showToast('Auto eliminado exitosamente', 'success');
      loadCars();
      loadStats();
    } catch (error) {
      console.error('Error eliminando auto:', error);
      const message = error.response?.data?.message || 'Error al eliminar el auto';
      showToast(message, 'error');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header mejorado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-200">
              Mis Autos
            </h1>
            <p className="mt-2 text-gray-600 dark:text-slate-300 transition-colors duration-200 font-medium">
              Gestiona tu colección de autos de forma fácil y organizada
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="secondary"
              className="bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              📊 Ver Estadísticas
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Agregar Auto
            </Button>
          </div>
        </div>

        {/* Estadísticas mejoradas */}
        {showStats && stats && (
          <div className="mb-8">
            <CarStats stats={stats} />
          </div>
        )}

        {/* Búsqueda mejorada */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="🔍 Buscar por marca, modelo, placa o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors duration-200"
          />
        </div>

        {/* ✅ CAMBIO 2: Filtros solo cuando hay datos */}
        {cars.length > 0 && (
          <div className="mb-8">
            <CarFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
              cars={cars}
            />
          </div>
        )}

        {/* ✅ CAMBIO 3: Contador solo cuando hay datos */}
        {cars.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-slate-400 transition-colors duration-200 font-medium">
              {filteredCars.length === cars.length
                ? `Mostrando ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
                : `Mostrando ${filteredCars.length} de ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        )}

        {/* Lista de autos / Estados vacíos mejorados */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-200">
            {cars.length === 0 ? (
              <div>
                <div className="text-8xl mb-6">🚗</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-colors duration-200">
                  No tienes autos registrados
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed transition-colors duration-200">
                  Comienza agregando tu primer auto para empezar a organizar tu colección
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  🚀 Agregar Mi Primer Auto
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3 transition-colors duration-200">
                  No se encontraron autos
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed transition-colors duration-200">
                  Intenta ajustar tus filtros o términos de búsqueda
                </p>
                <Button
                  onClick={clearFilters}
                  variant="secondary"
                  size="lg"
                  className="bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  🗑️ Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
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
          title="🚗 Agregar Nuevo Auto"
        >
          <CarForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingCar(null);
          }}
          title="✏️ Editar Auto"
        >
          <CarForm
            initialData={editingCar}
            onSubmit={handleUpdate}
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