// src/hooks/usePaginatedCars.js
import { useState, useEffect, useCallback } from 'react';
import { carService } from '../services/api';
import { getPaginationSettings, savePaginationSettings } from '../utils/storage';

export const usePaginatedCars = () => {
    // Obtener configuración guardada
    const savedSettings = getPaginationSettings();

    const [data, setData] = useState({
        cars: [],
        pageInfo: {
            page: 0,
            size: savedSettings.size, // Usar configuración guardada
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false,
            first: true,
            last: false
        }
    });

    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        page: 0,
        size: savedSettings.size, // Usar configuración guardada
        sortBy: savedSettings.sortBy || 'createdAt',
        sortDirection: savedSettings.sortDirection || 'desc',
        searchTerm: '',
        brand: '',
        model: '',
        year: '',
        color: '',
        minYear: '',
        maxYear: '',
    });

    const fetchCars = useCallback(async (params = searchParams) => {
        setLoading(true);
        try {
            // Limpiar parámetros vacíos
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([, value]) =>
                    value !== null && value !== undefined && value !== ''
                )
            );

            const response = await carService.searchPaginated(cleanParams);

            if (response.success) {
                setData({
                    cars: response.data.content,
                    pageInfo: response.data.pageInfo
                });
            }
        } catch (error) {
            console.error('Error fetching paginated cars:', error);
            setData(prev => ({ ...prev, cars: [] }));
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadCars = async () => {
            try {
                await fetchCars();
            } catch (error) {
                console.error('Error loading cars in useEffect:', error);
                // Aquí podrías agregar más lógica de manejo de errores en el futuro
                // Por ejemplo: mostrar un toast, reintentar, etc.
            }
        };

        void loadCars(); // Indica intencionalmente que ignoramos la promesa retornada
    }, [fetchCars]);

    const updateSearchParams = useCallback((newParams) => {
        setSearchParams(prev => ({
            ...prev,
            ...newParams,
            page: newParams.page !== undefined ? newParams.page : 0 // Reset page if search changes
        }));
    }, []);

    const goToPage = useCallback((page) => {
        setSearchParams(prev => ({ ...prev, page }));
    }, []);

    const changePageSize = useCallback((size) => {
        // Guardar configuración en localStorage
        savePaginationSettings({ size });

        setSearchParams(prev => ({ ...prev, size, page: 0 }));
    }, []);

    const sort = useCallback((sortBy, sortDirection = 'asc') => {
        // Guardar configuración de ordenamiento si se desea persistir
        savePaginationSettings({ sortBy, sortDirection });

        setSearchParams(prev => ({
            ...prev,
            sortBy,
            sortDirection,
            page: 0
        }));
    }, []);

    return {
        ...data,
        loading,
        searchParams,
        updateSearchParams,
        goToPage,
        changePageSize,
        sort,
        refresh: () => fetchCars()
    };
};