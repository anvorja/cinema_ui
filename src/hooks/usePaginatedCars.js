// src/hooks/usePaginatedCars.js
import { useState, useEffect, useCallback } from 'react';
import { carService } from '../services/api';
import { getPaginationSettings, savePaginationSettings } from '../utils/storage';

export const usePaginatedCars = () => {
    const savedSettings = getPaginationSettings();

    const [data, setData] = useState({
        cars: [],
        pageInfo: {
            page: 0,
            size: savedSettings.size,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false,
            first: true,
            last: false
        }
    });

    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        page: 0,
        size: savedSettings.size,
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

    const fetchCars = useCallback(async (params = searchParams, isInitialLoad = false) => {
        if (!isInitialLoad) {
            setLoading(true);
        }

        try {
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
                await fetchCars(searchParams, true);
            } catch (error) {
                console.error('Error loading cars in useEffect:', error);
            }
        };

        void loadCars();
    }, [fetchCars, searchParams]);

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