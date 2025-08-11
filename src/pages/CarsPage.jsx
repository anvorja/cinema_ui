// src/pages/CarsPage.jsx
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import { usePaginatedCars } from '../hooks/usePaginatedCars';
import { carService } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CarCard from '../components/cars/CarCard';
import CarForm from '../components/cars/CarForm';
import CarFilters from '../components/cars/CarFilters';
import CarStats from '../components/cars/CarStats';
import PaginationControls from '../components/ui/PaginationControls';
import Modal from '../components/ui/Modal';
import { Search, Filter, BarChart3, Sparkles } from 'lucide-react';

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

const ShimmerEffect = ({ children, className = "" }) => {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-shimmer" />
            {children}
        </div>
    );
};

const CarsPage = () => {
    const {
        cars,
        pageInfo,
        loading,
        updateSearchParams,
        goToPage,
        changePageSize,
        refresh
    } = usePaginatedCars();

    // Estados locales para búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Estados de filtros
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        year: '',
        color: '',
        minYear: '',
        maxYear: ''
    });

    // Estados de modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    // Estados de estadísticas
    const [stats, setStats] = useState(null);
    const [showStats, setShowStats] = useState(false);

    const { showToast } = useToast();

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            updateSearchParams({
                searchTerm,
                ...filters
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, filters, updateSearchParams]);

    // Cargar estadísticas
    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await carService.getStats();
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
            }
        };
        loadStats();
    }, []);

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
                await refresh();
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
            await refresh();
        } catch (error) {
            console.error('Error guardando auto:', error);
            showToast(
                editingCar ? 'Error al actualizar el auto' : 'Error al agregar el auto',
                'error'
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
            {/* Efectos de fondo animados */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <LoadingSpinner size="lg" />
                        <p className="text-slate-600 dark:text-slate-300 mt-4 text-center">
                            Cargando tus autos...
                        </p>
                    </div>
                ) : (
                    <>
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
                        {pageInfo.totalElements > 0 && (
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

                        {/* Contador de resultados y paginación superior */}
                        {pageInfo.totalElements > 0 && (
                            <div className="mb-6">
                                <GlassCard className="p-4" hover={false}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Información de resultados */}
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                Mostrando {cars.length} de {pageInfo.totalElements} auto{pageInfo.totalElements !== 1 ? 's' : ''}
                                            </p>

                                            {/* Selector de elementos por página */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-500">Por página:</span>
                                                <select
                                                    value={pageInfo.size}
                                                    onChange={(e) => changePageSize(parseInt(e.target.value))}
                                                    className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600
                                                     bg-white dark:bg-slate-800 text-sm
                                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="6">6</option>
                                                    <option value="12">12</option>
                                                    <option value="20">20</option>
                                                    <option value="50">50</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Paginación superior (solo si hay múltiples páginas) */}
                                        {pageInfo.totalPages > 1 && (
                                            <div className="flex-shrink-0">
                                                <PaginationControls
                                                    pageInfo={pageInfo}
                                                    onPageChange={(page, size) => {
                                                        if (size !== undefined) {
                                                            changePageSize(size);
                                                        } else {
                                                            goToPage(page);
                                                        }
                                                    }}
                                                    compact={true} // Prop para versión compacta
                                                />
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {/* Estados de contenido */}
                        {cars.length === 0 && pageInfo.totalElements === 0 ? (
                            <GlassCard className="p-16 text-center" hover={false}>
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
                            </GlassCard>
                        ) : cars.length === 0 ? (
                            <GlassCard className="p-16 text-center" hover={false}>
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
                            </GlassCard>
                        ) : (
                            <>
                                {/* Grid de autos */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {cars.map((car) => (
                                        <CarCard
                                            key={car.car_id}
                                            car={car}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>

                                {/* Controles de paginación */}
                                {pageInfo.totalPages > 1 && (
                                    <div className="mt-8">
                                        <GlassCard className="p-6" hover={false}>
                                            <PaginationControls
                                                pageInfo={pageInfo}
                                                onPageChange={(page, size) => {
                                                    if (size !== undefined) {
                                                        changePageSize(size);
                                                    } else {
                                                        goToPage(page);
                                                    }
                                                }}
                                            />
                                        </GlassCard>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Modales */}
                        <Modal
                            isOpen={showAddModal}
                            onClose={() => setShowAddModal(false)}
                            title="Agregar Nuevo Auto"
                            size="lg"
                        >
                            <CarForm
                                allCars={cars}
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
                            size="lg"
                        >
                            <CarForm
                                initialData={editingCar}
                                allCars={cars}
                                onSubmit={handleFormSubmit}
                                onCancel={() => {
                                    setShowEditModal(false);
                                    setEditingCar(null);
                                }}
                            />
                        </Modal>
                    </>
                )}
            </div>
        </div>
    );
};

export default CarsPage;