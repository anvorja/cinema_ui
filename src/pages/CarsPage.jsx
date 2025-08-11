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
                // Aquí se podría agregar más lógica de manejo de errores en el futuro
                // Por ejemplo: mostrar un toast, ocultar la sección de stats, etc.
            }
        };

        void loadStats(); // Indica intencionalmente que ignoramos la promesa retornada
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
                                {/* Grid de autos - Mejorado para responsive */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
                                    {cars.map((car) => (
                                        <CarCard
                                            key={car.car_id}
                                            car={car}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>

                                {/* Controles de paginación - Mejorado para móvil */}
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




// // v2
// // src/pages/CarsPage.jsx
// import { useState, useEffect } from 'react';
// import { PlusIcon } from '@heroicons/react/24/outline';
// import { useToast } from '../hooks/useToast';
// import { usePaginatedCars } from '../hooks/usePaginatedCars';
// import { carService } from '../services/api';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import CarCard from '../components/cars/CarCard';
// import CarForm from '../components/cars/CarForm';
// import CarFilters from '../components/cars/CarFilters';
// import CarStats from '../components/cars/CarStats';
// import PaginationControls from '../components/ui/PaginationControls';
// import Modal from '../components/ui/Modal';
// import ImagePreviewModal from '../components/ui/ImagePreviewModal'; // Nuevo import
// import { Search, Filter, BarChart3, Sparkles } from 'lucide-react';
//
// const GlassCard = ({ children, className = "", hover = true, ...props }) => {
//     return (
//         <div
//             className={`
//         backdrop-blur-xl bg-white/10 dark:bg-white/5
//         border border-white/20 dark:border-white/10
//         rounded-2xl shadow-2xl
//         ${hover ? 'hover:shadow-3xl hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-500 group cursor-pointer hover:scale-[1.02]' : ''}
//         ${className}
//       `}
//             {...props}
//         >
//             {children}
//         </div>
//     );
// };
//
// const CarsPage = () => {
//     // Estados existentes
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingCar, setEditingCar] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentFilters, setCurrentFilters] = useState({});
//     const [showFilters, setShowFilters] = useState(false);
//     const [showStats, setShowStats] = useState(false);
//
//     // NUEVOS ESTADOS para el modal de vista previa de imagen
//     const [showImagePreview, setShowImagePreview] = useState(false);
//     const [previewImageUrl, setPreviewImageUrl] = useState('');
//     const [previewCarInfo, setPreviewCarInfo] = useState(null);
//
//     const { showToast } = useToast();
//
//     const {
//         cars,
//         loading,
//         error,
//         totalPages,
//         currentPage,
//         totalCars,
//         hasNextPage,
//         hasPreviousPage,
//         goToPage,
//         goToNextPage,
//         goToPreviousPage,
//         refreshCars,
//         searchCars,
//         filterCars
//     } = usePaginatedCars();
//
//     // Función para manejar el clic en imagen
//     const handleImagePreview = (imageUrl, carInfo) => {
//         setPreviewImageUrl(imageUrl);
//         setPreviewCarInfo(carInfo);
//         setShowImagePreview(true);
//     };
//
//     // Función para cerrar el modal de vista previa
//     const handleCloseImagePreview = () => {
//         setShowImagePreview(false);
//         setPreviewImageUrl('');
//         setPreviewCarInfo(null);
//     };
//
//     // Resto de funciones existentes...
//     const handleSearch = (term) => {
//         setSearchTerm(term);
//         if (term.trim()) {
//             searchCars(term);
//         } else {
//             refreshCars();
//         }
//     };
//
//     const handleFilterChange = (filters) => {
//         setCurrentFilters(filters);
//         filterCars(filters);
//     };
//
//     const handleEdit = (car) => {
//         setEditingCar(car);
//         setShowEditModal(true);
//     };
//
//     const handleDelete = async (carId) => {
//         if (!confirm('¿Estás seguro de que quieres eliminar este auto?')) {
//             return;
//         }
//
//         try {
//             await carService.deleteCar(carId);
//             showToast('Auto eliminado exitosamente', 'success');
//             refreshCars();
//         } catch (error) {
//             console.error('Error eliminando auto:', error);
//             showToast('Error al eliminar el auto', 'error');
//         }
//     };
//
//     const handleFormSubmit = async (formData) => {
//         try {
//             if (editingCar) {
//                 await carService.updateCar(editingCar.car_id, formData);
//                 showToast('Auto actualizado exitosamente', 'success');
//                 setShowEditModal(false);
//                 setEditingCar(null);
//             } else {
//                 await carService.createCar(formData);
//                 showToast('Auto creado exitosamente', 'success');
//                 setShowAddModal(false);
//             }
//             refreshCars();
//         } catch (error) {
//             console.error('Error guardando auto:', error);
//             showToast(error.response?.data?.message || 'Error al guardar el auto', 'error');
//         }
//     };
//
//     // Efecto para manejar tecla Escape en el modal de imagen
//     useEffect(() => {
//         const handleEscapeKey = (event) => {
//             if (event.key === 'Escape' && showImagePreview) {
//                 handleCloseImagePreview();
//             }
//         };
//
//         if (showImagePreview) {
//             document.addEventListener('keydown', handleEscapeKey);
//             document.body.style.overflow = 'hidden'; // Prevenir scroll
//         }
//
//         return () => {
//             document.removeEventListener('keydown', handleEscapeKey);
//             document.body.style.overflow = 'unset';
//         };
//     }, [showImagePreview]);
//
//     if (error) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//                 <GlassCard className="p-8 text-center max-w-md mx-4">
//                     <div className="text-red-400 text-lg font-semibold mb-4">
//                         Error al cargar los datos
//                     </div>
//                     <p className="text-slate-300 mb-6">{error}</p>
//                     <Button onClick={refreshCars}>
//                         Reintentar
//                     </Button>
//                 </GlassCard>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header con título y botón agregar */}
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//                     <div className="mb-4 sm:mb-0">
//                         <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
//                             Mis Autos
//                         </h1>
//                         <p className="text-slate-300 text-lg">
//                             Gestiona tu colección de vehículos
//                         </p>
//                     </div>
//
//                     <div className="flex flex-col sm:flex-row gap-3">
//                         <Button
//                             onClick={() => setShowStats(!showStats)}
//                             variant="secondary"
//                             className="glassmorphism"
//                         >
//                             <BarChart3 className="h-5 w-5 mr-2" />
//                             {showStats ? 'Ocultar' : 'Ver'} Estadísticas
//                         </Button>
//
//                         <Button
//                             onClick={() => setShowAddModal(true)}
//                             className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25"
//                         >
//                             <PlusIcon className="h-5 w-5 mr-2" />
//                             Agregar Auto
//                         </Button>
//                     </div>
//                 </div>
//
//                 {/* Estadísticas */}
//                 {showStats && (
//                     <div className="mb-8">
//                         <CarStats cars={cars} />
//                     </div>
//                 )}
//
//                 {/* Barra de búsqueda y filtros */}
//                 <div className="mb-8 space-y-4">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="flex-1 relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
//                             <Input
//                                 type="text"
//                                 placeholder="Buscar por marca, modelo o placa..."
//                                 value={searchTerm}
//                                 onChange={(e) => handleSearch(e.target.value)}
//                                 className="pl-10 glassmorphism"
//                             />
//                         </div>
//
//                         <Button
//                             onClick={() => setShowFilters(!showFilters)}
//                             variant="secondary"
//                             className="glassmorphism whitespace-nowrap"
//                         >
//                             <Filter className="h-5 w-5 mr-2" />
//                             {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
//                         </Button>
//                     </div>
//
//                     {showFilters && (
//                         <CarFilters
//                             cars={cars}
//                             onFilterChange={handleFilterChange}
//                             currentFilters={currentFilters}
//                         />
//                     )}
//                 </div>
//
//                 {/* Lista de autos o estado de carga */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <LoadingSpinner size="lg" />
//                     </div>
//                 ) : cars.length === 0 ? (
//                     <GlassCard className="p-12 text-center">
//                         <div className="text-slate-400 mb-4">
//                             <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                         </div>
//                         <h3 className="text-2xl font-semibold text-white mb-2">
//                             {searchTerm || Object.keys(currentFilters).length > 0
//                                 ? 'No se encontraron autos'
//                                 : 'No tienes autos registrados'
//                             }
//                         </h3>
//                         <p className="text-slate-300 mb-6">
//                             {searchTerm || Object.keys(currentFilters).length > 0
//                                 ? 'Intenta ajustar los filtros de búsqueda'
//                                 : 'Comienza agregando tu primer vehículo a la colección'
//                             }
//                         </p>
//                         {!searchTerm && Object.keys(currentFilters).length === 0 && (
//                             <Button
//                                 onClick={() => setShowAddModal(true)}
//                                 className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
//                             >
//                                 <PlusIcon className="h-5 w-5 mr-2" />
//                                 Agregar Primer Auto
//                             </Button>
//                         )}
//                     </GlassCard>
//                 ) : (
//                     <>
//                         {/* Grid de autos */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                             {cars.map((car) => (
//                                 <CarCard
//                                     key={car.car_id}
//                                     car={car}
//                                     onEdit={handleEdit}
//                                     onDelete={handleDelete}
//                                     onImagePreview={handleImagePreview} // Nueva prop
//                                 />
//                             ))}
//                         </div>
//
//                         {/* Controles de paginación */}
//                         {totalPages > 1 && (
//                             <div className="flex justify-center">
//                                 <PaginationControls
//                                     currentPage={currentPage}
//                                     totalPages={totalPages}
//                                     hasNextPage={hasNextPage}
//                                     hasPreviousPage={hasPreviousPage}
//                                     onPageChange={goToPage}
//                                     onNextPage={goToNextPage}
//                                     onPreviousPage={goToPreviousPage}
//                                     totalItems={totalCars}
//                                 />
//                             </div>
//                         )}
//                     </>
//                 )}
//
//                 {/* Modales existentes */}
//                 <Modal
//                     isOpen={showAddModal}
//                     onClose={() => setShowAddModal(false)}
//                     title="Agregar Nuevo Auto"
//                     size="lg"
//                 >
//                     <CarForm
//                         allCars={cars}
//                         onSubmit={handleFormSubmit}
//                         onCancel={() => setShowAddModal(false)}
//                     />
//                 </Modal>
//
//                 <Modal
//                     isOpen={showEditModal}
//                     onClose={() => {
//                         setShowEditModal(false);
//                         setEditingCar(null);
//                     }}
//                     title="Editar Auto"
//                     size="lg"
//                 >
//                     <CarForm
//                         initialData={editingCar}
//                         allCars={cars}
//                         onSubmit={handleFormSubmit}
//                         onCancel={() => {
//                             setShowEditModal(false);
//                             setEditingCar(null);
//                         }}
//                     />
//                 </Modal>
//
//                 {/* NUEVO: Modal de vista previa de imagen */}
//                 <ImagePreviewModal
//                     isOpen={showImagePreview}
//                     onClose={handleCloseImagePreview}
//                     imageUrl={previewImageUrl}
//                     carInfo={previewCarInfo}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default CarsPage;