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
import ImagePreviewModal from '../components/ui/ImagePreviewModal';
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

    const [allUserCars, setAllUserCars] = useState([]);

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

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasEverLoadedCars, setHasEverLoadedCars] = useState(false);

    // Estados de modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    // Estados de estadísticas
    const [stats, setStats] = useState(null);
    const [showStats, setShowStats] = useState(false);

    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [previewCarInfo, setPreviewCarInfo] = useState(null);

    const { showToast } = useToast();

    const handleImagePreview = (imageUrl, carInfo) => {
        setPreviewImageUrl(imageUrl);
        setPreviewCarInfo(carInfo);
        setShowImagePreview(true);
    };

    const handleCloseImagePreview = () => {
        setShowImagePreview(false);
        setPreviewImageUrl('');
        setPreviewCarInfo(null);
    };

    useEffect(() => {
        setIsTransitioning(true); // Marcar inicio de transición

        const timer = setTimeout(() => {
            updateSearchParams({
                searchTerm,
                ...filters
            });
            setIsTransitioning(false);
        }, 500);

        return () => {
            clearTimeout(timer);
            setIsTransitioning(false); // Limpiar al desmontar
        };
    }, [searchTerm, filters, updateSearchParams]);

    useEffect(() => {
        const loadAllCars = async () => {
            try {
                // Obtener todos los carros sin paginación para filtros
                const response = await carService.getAll({ size: 1000 }); // Usar un número alto
                if (response.data && response.data.data) {
                    setAllUserCars(response.data.data);
                }
            } catch (error) {
                console.error('Error cargando todos los carros:', error);
                setAllUserCars([]);
            }
        };

        void loadAllCars();
    }, []);

    useEffect(() => {
        if (pageInfo.totalElements > 0 || allUserCars.length > 0) {
            setHasEverLoadedCars(true);
        }
    }, [pageInfo.totalElements, allUserCars.length]);

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
                // Aquí se podría agregar más lógica de manejo de errores en el futuro
                // Por ejemplo: mostrar un toast, ocultar la sección de stats, etc.
            }
        };

        void loadStats();
    }, []);

    // Para manejar tecla Escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && showImagePreview) {
                handleCloseImagePreview();
            }
        };

        if (showImagePreview) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [showImagePreview]);

    const clearFilters = () => {
        setIsTransitioning(true);
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

    const getUIState = () => {
        // Si está cargando, mostrar loading
        if (loading) {
            return 'loading';
        }

        // Si está en transición, mantener estado actual (evitar parpadeo)
        if (isTransitioning) {
            return cars.length > 0 ? 'with-cars' : 'no-results';
        }

        // Si no hay autos en la página actual
        if (cars.length === 0) {
            // Verificar si es realmente que no hay autos registrados vs no hay resultados
            const hasActiveSearchOrFilters = searchTerm || Object.values(filters).some(filter => filter !== '');

            // Si nunca se han cargado autos Y no hay búsqueda/filtros activos
            if (!hasEverLoadedCars && !hasActiveSearchOrFilters && pageInfo.totalElements === 0) {
                return 'no-cars-registered';
            } else {
                return 'no-results';
            }
        }

        return 'with-cars';
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

                const response = await carService.getAll({ size: 1000 });
                if (response.data && response.data.data) {
                    setAllUserCars(response.data.data);
                }
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

            const response = await carService.getAll({ size: 1000 });
            if (response.data && response.data.data) {
                setAllUserCars(response.data.data);
            }
        } catch (error) {
            console.error('Error guardando auto:', error);
            showToast(
                editingCar ? 'Error al actualizar el auto' : 'Error al agregar el auto',
                'error'
            );
        }
    };

    const uiState = getUIState();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 relative overflow-hidden">
            {/* Efectos de fondo animados */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {uiState === 'loading' ? (
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

                        {pageInfo.totalElements > 0 && (
                            <div className="mb-8">
                                <GlassCard className="p-6">
                                    <CarFilters
                                        filters={filters}
                                        onFiltersChange={setFilters}
                                        onClear={clearFilters}
                                        allCars={allUserCars}
                                    />
                                </GlassCard>
                            </div>
                        )}

                        {/* Contador de resultados y paginación superior */}
                        {pageInfo.totalElements > 0 && (
                            <div className="mb-6">
                                <GlassCard className="p-3 sm:p-4" hover={false}>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                        {/* Información de resultados */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                Mostrando {cars.length} de {pageInfo.totalElements} auto{pageInfo.totalElements !== 1 ? 's' : ''}
                                            </p>

                                            {/* Selector de elementos por página */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm text-slate-500">Por página:</span>
                                                <select
                                                    value={pageInfo.size}
                                                    onChange={(e) => changePageSize(parseInt(e.target.value))}
                                                    className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600
                                                     bg-white dark:bg-slate-800 text-xs sm:text-sm
                                                     focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
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
                                            <div className="flex justify-center sm:justify-end">
                                                <PaginationControls
                                                    pageInfo={pageInfo}
                                                    onPageChange={(page, size) => {
                                                        if (size !== undefined) {
                                                            changePageSize(size);
                                                        } else {
                                                            goToPage(page);
                                                        }
                                                    }}
                                                    compact={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </GlassCard>
                            </div>
                        )}

                        {uiState === 'no-cars-registered' ? (
                            // ✅ CASO 1: No hay autos registrados - 🚗 (carrito)
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
                        ) : uiState === 'no-results' ? (
                            // ✅ CASO 2: No hay resultados de búsqueda/filtros - 🔍 (lupa)
                            <GlassCard className="p-16 text-center" hover={false}>
                                <div>
                                    <div className="text-8xl mb-6">🔍</div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                        No se encontraron autos
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                                        {searchTerm
                                            ? `No se encontraron autos que coincidan con "${searchTerm}"`
                                            : "Intenta ajustar tus filtros o términos de búsqueda"
                                        }
                                    </p>
                                    <Button
                                        onClick={clearFilters}
                                        variant="secondary"
                                        size="lg"
                                        className="backdrop-blur-sm bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20"
                                        disabled={isTransitioning} // 🆕 Deshabilitar durante transición
                                    >
                                        <Filter className="w-5 h-5 mr-2" />
                                        {isTransitioning ? "Limpiando..." : (searchTerm ? "Limpiar búsqueda y filtros" : "Limpiar Filtros")}
                                    </Button>
                                </div>
                            </GlassCard>
                        ) : (
                            // ✅ CASO 3: Hay autos para mostrar
                            <>
                                {/* Grid de autos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                                    {cars.map((car) => (
                                        <CarCard
                                            key={car.car_id}
                                            car={car}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onImagePreview={handleImagePreview}
                                        />
                                    ))}
                                </div>

                                {/* Controles de paginación */}
                                {pageInfo.totalPages > 1 && (
                                    <div className="mt-8">
                                        <GlassCard className="p-4 sm:p-6" hover={false}>
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

                        <ImagePreviewModal
                            isOpen={showImagePreview}
                            onClose={handleCloseImagePreview}
                            imageUrl={previewImageUrl}
                            carInfo={previewCarInfo}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CarsPage;