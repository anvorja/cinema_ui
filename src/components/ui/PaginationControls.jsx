// src/components/ui/PaginationControls.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationControls = ({ pageInfo, onPageChange, className = "", compact = false }) => {
    const { page, totalPages, hasNext, hasPrevious, totalElements, size } = pageInfo;

    const getVisiblePages = () => {
        const delta = compact ? 1 : 2; // Menos páginas en versión compacta
        const range = [];
        const start = Math.max(0, page - delta);
        const end = Math.min(totalPages - 1, page + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };

    if (totalPages <= 1) return null;

    const startItem = Math.min((page * size) + 1, totalElements);
    const endItem = Math.min((page + 1) * size, totalElements);

    return (
        <div className={`flex items-center justify-between ${className}`}>
            {/* Información de elementos - solo en versión completa */}
            {!compact && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <span className="font-medium">{startItem}</span> a{' '}
                    <span className="font-medium">{endItem}</span> de{' '}
                    <span className="font-medium">{totalElements}</span> autos
                </div>
            )}

            {/* Controles de navegación */}
            <div className={`flex items-center space-x-1 ${compact ? 'mx-auto' : ''}`}>
                {/* Primera página */}
                <button
                    onClick={() => onPageChange(0)}
                    disabled={!hasPrevious}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-200
                             bg-white dark:bg-gray-800"
                    title="Primera página"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Página anterior */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!hasPrevious}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-200
                             bg-white dark:bg-gray-800"
                    title="Página anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Páginas visibles */}
                {getVisiblePages().map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200
                            ${pageNum === page 
                                ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        {pageNum + 1}
                    </button>
                ))}

                {/* Página siguiente */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasNext}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-200
                             bg-white dark:bg-gray-800"
                    title="Página siguiente"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Última página */}
                <button
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={!hasNext}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-200
                             bg-white dark:bg-gray-800"
                    title="Última página"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>

            {/* Selector de tamaño de página - solo en versión completa */}
            {!compact && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Por página:</span>
                    <select
                        value={size}
                        onChange={(e) => onPageChange(0, parseInt(e.target.value))}
                        className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-white dark:bg-gray-800 text-sm
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 transition-colors duration-200"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default PaginationControls;