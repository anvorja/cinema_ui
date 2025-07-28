// src/pages/CarsPage.jsx - SOLUCIÓN del problema de timing
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

      if (response.data.success) {
        const carsData = response.data.data || [];
        setCars(carsData);

        // ✅ DEBUG: Verificar que los datos lleguen
        console.log('🚗 Cars loaded:', carsData.length, carsData[0]);

        showToast('Autos cargados correctamente', 'success');
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      showToast('Error al cargar los autos', 'error');
      setCars([]); // ✅ Asegurar que cars sea un array
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadCars();
  }, [loadCars]);

  // ✅ APLICAR FILTROS - Efecto para filtrar autos
  useEffect(() => {
    let filtered = [...cars];

    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.plate_number.toLowerCase().includes(searchLower) ||
        car.color.toLowerCase().includes(searchLower)
      );
    }

    // Filtros específicos
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

    // Filtros de rango de años
    if (filters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.minYear));
    }

    if (filters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.maxYear));
    }

    setFilteredCars(filtered);
  }, [cars, filters, searchTerm]);

  // Limpiar filtros
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

  // Agregar auto
  const handleAddCar = async (carData) => {
    try {
      const response = await carService.create(carData);

      if (response.data.success) {
        await loadCars(); // Recargar la lista
        setShowAddModal(false);
        showToast('Auto agregado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      const message = error.response?.data?.message || 'Error al agregar el auto';
      showToast(message, 'error');
    }
  };

  // Editar auto
  const handleEditCar = (car) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  const handleUpdateCar = async (carData) => {
    try {
      const response = await carService.update(editingCar.car_id, carData);

      if (response.data.success) {
        await loadCars(); // Recargar la lista
        setShowEditModal(false);
        setEditingCar(null);
        showToast('Auto actualizado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      const message = error.response?.data?.message || 'Error al actualizar el auto';
      showToast(message, 'error');
    }
  };

  // Eliminar auto
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      return;
    }

    try {
      const response = await carService.delete(carId);

      if (response.data.success) {
        await loadCars(); // Recargar la lista
        showToast('Auto eliminado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      const message = error.response?.data?.message || 'Error al eliminar el auto';
      showToast(message, 'error');
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const response = await carService.getStats();
      if (response.data.success) {
        setStats(response.data.data);
        setShowStats(true);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      showToast('Error al cargar estadísticas', 'error');
    }
  };

  // Mostrar loading spinner mientras carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg text-gray-600">
          Cargando tus autos...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mis Autos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tu colección de autos de forma fácil y organizada
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadStats}
            variant="secondary"
            className="flex items-center"
          >
            📊 Ver Estadísticas
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar Auto
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Input
          type="text"
          placeholder="🔍 Buscar por marca, modelo, placa o color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* ✅ SOLUCIÓN: Solo renderizar CarFilters si hay datos */}
      {cars.length > 0 && (
        <CarFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
          cars={cars}
        />
      )}

      {/* ✅ Mensaje si no hay autos cargados */}
      {cars.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tienes autos registrados
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comienza agregando tu primer auto a la colección
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar tu primer auto
          </Button>
        </div>
      )}

      {/* Lista de autos */}
      {cars.length > 0 && (
        <div className="space-y-4">
          {/* Contador de resultados */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {filteredCars.length} de {cars.length} autos
            </p>
            {(Object.values(filters).some(v => v !== '') || searchTerm) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Grid de autos */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.car_id}
                  car={car}
                  onEdit={handleEditCar}
                  onDelete={handleDeleteCar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron autos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Intenta ajustar los filtros o la búsqueda
              </p>
              <Button
                onClick={clearFilters}
                variant="secondary"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal para agregar auto */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Agregar Nuevo Auto"
        size="lg"
      >
        <CarForm
          onSubmit={handleAddCar}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Modal para editar auto */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCar(null);
        }}
        title="Editar Auto"
        size="lg"
      >
        <CarForm
          initialData={editingCar}
          onSubmit={handleUpdateCar}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCar(null);
          }}
        />
      </Modal>

      {/* Modal de estadísticas */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Estadísticas de tu Colección"
        size="lg"
      >
        {stats && <CarStats stats={stats} />}
      </Modal>
    </div>
  );
};

export default CarsPage;