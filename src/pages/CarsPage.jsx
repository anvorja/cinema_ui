// src/pages/CarsPage.jsx
import { useState, useEffect } from 'react';
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

  // Cargar datos iniciales
  useEffect(() => {
    loadCars();
    loadStats();
  }, []);

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

  // Cargar lista de autos
  const loadCars = async () => {
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
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const response = await carService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  // Crear auto
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

  // Editar auto
  const handleEdit = (car) => {
    setEditingCar(car);
    setShowEditModal(true);
  };

  // Actualizar auto
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

  // Eliminar auto
  const handleDelete = async (carId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este auto?')) {
      return;
    }

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

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      brand: '',
      model: '',
      year: '',
      color: '',
      minYear: '',
      maxYear: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🚗 Mis Autos
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona tu colección de autos de forma fácil y organizada
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              onClick={() => setShowStats(!showStats)}
              variant="secondary"
            >
              📊 {showStats ? 'Ocultar' : 'Ver'} Estadísticas
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Agregar Auto
            </Button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {showStats && stats && (
        <div className="mb-8">
          <CarStats stats={stats} />
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="max-w-lg">
          <Input
            type="text"
            placeholder="🔍 Buscar por marca, modelo, placa o color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <CarFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
          cars={cars}
        />
      </div>

      {/* Contador de resultados */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {filteredCars.length === cars.length
            ? `Mostrando ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
            : `Mostrando ${filteredCars.length} de ${cars.length} auto${cars.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* Lista de autos */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          {cars.length === 0 ? (
            <div>
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes autos registrados
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza agregando tu primer auto para empezar a organizar tu colección
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                🚀 Agregar Mi Primer Auto
              </Button>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron autos
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters} variant="secondary">
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

      {/* Modal para agregar auto */}
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

      {/* Modal para editar auto */}
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
  );
};

export default CarsPage;