// // src/hooks/useFilterOptions.js
// import { useState, useEffect, useCallback } from 'react';
// import { carService } from '../services/api';
//
// export const useFilterOptions = () => {
//     const [filterOptions, setFilterOptions] = useState({
//         brands: [],
//         models: [],
//         colors: [],
//         years: []
//     });
//
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [stats, setStats] = useState(null);
//
//     // Función para cargar todas las opciones
//     const loadFilterOptions = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError(null);
//
//             const response = await carService.getFilterOptions();
//
//             if (response.data.success) {
//                 setFilterOptions(response.data.data);
//                 setStats(response.data.stats);
//             } else {
//                 throw new Error(response.data.message || 'Error al cargar opciones de filtros');
//             }
//         } catch (err) {
//             console.error('Error loading filter options:', err);
//             setError(err.message || 'Error al cargar opciones de filtros');
//             // Valores por defecto en caso de error
//             setFilterOptions({
//                 brands: [],
//                 models: [],
//                 colors: [],
//                 years: []
//             });
//         } finally {
//             setLoading(false);
//         }
//     }, []);
//
//     // Cargar opciones al montar el componente
//     useEffect(() => {
//         loadFilterOptions();
//     }, [loadFilterOptions]);
//
//     // Función para refrescar las opciones (útil después de agregar/editar carros)
//     const refreshOptions = useCallback(() => {
//         loadFilterOptions();
//     }, [loadFilterOptions]);
//
//     // Generar opciones formateadas para componentes Select
//     const getFormattedOptions = useCallback((type, includeEmpty = true) => {
//         const options = filterOptions[type] || [];
//         const formattedOptions = [];
//
//         if (includeEmpty) {
//             const emptyLabels = {
//                 brands: 'Todas las marcas',
//                 models: 'Todos los modelos',
//                 colors: 'Todos los colores',
//                 years: 'Todos los años'
//             };
//             formattedOptions.push({ value: '', label: emptyLabels[type] });
//         }
//
//         return [
//             ...formattedOptions,
//             ...options.map(option => ({
//                 value: option.toString(),
//                 label: option.toString()
//             }))
//         ];
//     }, [filterOptions]);
//
//     // Helpers específicos para cada tipo de filtro
//     const getBrandOptions = useCallback((includeEmpty = true) =>
//         getFormattedOptions('brands', includeEmpty), [getFormattedOptions]);
//
//     const getModelOptions = useCallback((includeEmpty = true) =>
//         getFormattedOptions('models', includeEmpty), [getFormattedOptions]);
//
//     const getColorOptions = useCallback((includeEmpty = true) =>
//         getFormattedOptions('colors', includeEmpty), [getFormattedOptions]);
//
//     const getYearOptions = useCallback((includeEmpty = true) =>
//         getFormattedOptions('years', includeEmpty), [getFormattedOptions]);
//
//     // Función para verificar si hay opciones disponibles
//     const hasOptions = useCallback(() => {
//         return filterOptions.brands.length > 0 ||
//                filterOptions.models.length > 0 ||
//                filterOptions.colors.length > 0 ||
//                filterOptions.years.length > 0;
//     }, [filterOptions]);
//
//     // Función para obtener estadísticas
//     const getStats = useCallback(() => {
//         if (!stats) return null;
//
//         return {
//             totalCars: stats.total_cars || 0,
//             uniqueBrands: stats.unique_brands || 0,
//             uniqueModels: stats.unique_models || 0,
//             uniqueColors: stats.unique_colors || 0,
//             yearRange: stats.year_range || null
//         };
//     }, [stats]);
//
//     return {
//         // Datos
//         filterOptions,
//         loading,
//         error,
//         stats: getStats(),
//
//         // Funciones
//         refreshOptions,
//         hasOptions: hasOptions(),
//
//         // Opciones formateadas para Select
//         getBrandOptions,
//         getModelOptions,
//         getColorOptions,
//         getYearOptions,
//
//         // Helper para todos los tipos
//         getFormattedOptions
//     };
// };


// src/hooks/useFilterOptions.js
import { useState, useEffect, useCallback } from 'react';
import { carService } from '../services/api';

export const useFilterOptions = () => {
    const [filterOptions, setFilterOptions] = useState({
        brands: [],
        models: [],
        colors: [],
        years: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    // Función para cargar todas las opciones
    const loadFilterOptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await carService.getFilterOptions();

            if (response.data.success) {
                setFilterOptions(response.data.data);
                setStats(response.data.stats);
            } else {
                throw new Error(response.data.message || 'Error al cargar opciones de filtros');
            }
        } catch (err) {
            console.error('Error loading filter options:', err);
            setError(err.message || 'Error al cargar opciones de filtros');
            // Valores por defecto en caso de error
            setFilterOptions({
                brands: [],
                models: [],
                colors: [],
                years: []
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar opciones al montar el componente
    useEffect(() => {
        loadFilterOptions();
    }, [loadFilterOptions]);

    // Función para refrescar las opciones (útil después de agregar/editar carros)
    const refreshOptions = useCallback(() => {
        loadFilterOptions();
    }, [loadFilterOptions]);

    // Generar opciones formateadas para componentes Select
    const getFormattedOptions = useCallback((type, includeEmpty = true) => {
        const options = filterOptions[type] || [];
        const formattedOptions = [];

        if (includeEmpty) {
            const emptyLabels = {
                brands: 'Todas las marcas',
                models: 'Todos los modelos',
                colors: 'Todos los colores',
                years: 'Todos los años'
            };
            formattedOptions.push({ value: '', label: emptyLabels[type] });
        }

        return [
            ...formattedOptions,
            ...options.map(option => ({
                value: option.toString(),
                label: option.toString()
            }))
        ];
    }, [filterOptions]);

    // 🎯 NUEVO: Obtener opciones filtradas en cascada
    const getFilteredOptions = useCallback((type, currentFilters = {}) => {
        if (!filterOptions[type]) return [];

        // Si no hay filtros aplicados, retornar todas las opciones
        if (!currentFilters.brand && !currentFilters.model) {
            return getFormattedOptions(type, true);
        }

        // Simular el filtrado basado en los filtros actuales
        // Nota: En una implementación real, esto vendría del backend
        let availableOptions = filterOptions[type];

        // Filtrar según el contexto
        if (type === 'models' && currentFilters.brand) {
            // Solo modelos de la marca seleccionada
            // En implementación real: llamada al backend con brand parameter
            availableOptions = filterOptions[type]; // Temporal
        } else if ((type === 'years' || type === 'colors') && (currentFilters.brand || currentFilters.model)) {
            // Solo años/colores de la marca/modelo seleccionado
            // En implementación real: llamada al backend con brand/model parameters
            availableOptions = filterOptions[type]; // Temporal
        }

        const formattedOptions = [];
        const emptyLabels = {
            brands: 'Todas las marcas',
            models: 'Todos los modelos',
            colors: 'Todos los colores',
            years: 'Todos los años'
        };
        formattedOptions.push({ value: '', label: emptyLabels[type] });

        return [
            ...formattedOptions,
            ...availableOptions.map(option => ({
                value: option.toString(),
                label: option.toString()
            }))
        ];
    }, [filterOptions, getFormattedOptions]);

    // Función para verificar si hay opciones disponibles
    const hasOptions = useCallback(() => {
        return filterOptions.brands.length > 0 ||
               filterOptions.models.length > 0 ||
               filterOptions.colors.length > 0 ||
               filterOptions.years.length > 0;
    }, [filterOptions]);

    // Función para obtener estadísticas
    const getStats = useCallback(() => {
        if (!stats) return null;

        return {
            totalCars: stats.total_cars || 0,
            uniqueBrands: stats.unique_brands || 0,
            uniqueModels: stats.unique_models || 0,
            uniqueColors: stats.unique_colors || 0,
            yearRange: stats.year_range || null
        };
    }, [stats]);

    // Helpers específicos para cada tipo de filtro
    const getBrandOptions = useCallback((includeEmpty = true) =>
        getFormattedOptions('brands', includeEmpty), [getFormattedOptions]);

    const getModelOptions = useCallback((includeEmpty = true) =>
        getFormattedOptions('models', includeEmpty), [getFormattedOptions]);

    const getColorOptions = useCallback((includeEmpty = true) =>
        getFormattedOptions('colors', includeEmpty), [getFormattedOptions]);

    const getYearOptions = useCallback((includeEmpty = true) =>
        getFormattedOptions('years', includeEmpty), [getFormattedOptions]);

    return {
        // Datos
        filterOptions,
        loading,
        error,
        stats: getStats(),

        // Funciones
        refreshOptions,
        hasOptions: hasOptions(),

        // Opciones formateadas para Select
        getBrandOptions,
        getModelOptions,
        getColorOptions,
        getYearOptions,
        
        // 🎯 NUEVO: Opciones filtradas en cascada
        getFilteredOptions,

        // Helper para todos los tipos
        getFormattedOptions
    };
};