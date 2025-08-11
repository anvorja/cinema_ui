// src/hooks/usePaginatedCars.js
import { useState, useEffect, useCallback } from 'react';
import { carService } from '../services/api';

export const usePaginatedCars = () => {
    const [data, setData] = useState({
        cars: [],
        pageInfo: {
            page: 0,
            size: 20,
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
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
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
        fetchCars();
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
        setSearchParams(prev => ({ ...prev, size, page: 0 }));
    }, []);

    const sort = useCallback((sortBy, sortDirection = 'asc') => {
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