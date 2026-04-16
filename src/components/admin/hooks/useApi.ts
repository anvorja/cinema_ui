// src/components/admin/hooks/useApi.js
import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Máximo de reintentos y delay base (ms) para errores de cold-start en Render
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useApi = () => {
  const { token } = useAuth();

  // useCallback garantiza referencia estable — solo cambia si cambia el token.
  // Sin esto, adminApi se recrea en cada render y los useEffect de AnalyticsTab
  // disparan un bucle infinito de requests.
  const apiCall = useCallback(async (url: string, options: Record<string, any> = {}, _retries = MAX_RETRIES) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {}),
      },
      ...options,
    };

    for (let attempt = 1; attempt <= _retries; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const err = new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
          (err as any).status = response.status;
          // No reintentar errores de cliente (4xx)
          if (response.status >= 400 && response.status < 500) throw err;
          // Reintentar errores de servidor (5xx) si quedan intentos
          if (attempt < _retries) {
            await sleep(RETRY_DELAY_MS);
            continue;
          }
          throw err;
        }

        return response.json();
      } catch (err) {
        // Si ya tiene status (fue lanzado por nosotros) o se agotaron los intentos, propagar
        if ((err as any).status || attempt >= _retries) throw err;
        // Error de red (fetch falló completamente) — reintentar
        await sleep(RETRY_DELAY_MS);
      }
    }
  }, [token]);

  // useMemo mantiene referencia estable de adminApi mientras apiCall no cambie
  const adminApi = useMemo(() => ({
    // Movies
    getMovies: (params = {}) => {
      const queryString = new URLSearchParams({
        include_inactive: 'true',
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/movies?${queryString}`);
    },

    createMovie: (movieData) =>
      apiCall('/admin/movies', {
        method: 'POST',
        body: JSON.stringify(movieData)
      }),

    updateMovie: (id, movieData) =>
      apiCall(`/admin/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(movieData)
      }),

    toggleMovie: (id) =>
      apiCall(`/admin/movies/${id}/toggle`, {
        method: 'PATCH'
      }),

    // Users
    getUsers: (params = {}) => {
      const queryString = new URLSearchParams({
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/users?${queryString}`);
    },

    toggleUser: (id) =>
      apiCall(`/admin/users/${id}/toggle`, {
        method: 'PATCH'
      }),

    // Theaters
    getTheaters: (params = {}) => {
      const queryString = new URLSearchParams({
        include_inactive: 'true',
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/theaters?${queryString}`);
    },

    toggleTheater: (id) =>
      apiCall(`/admin/theaters/${id}/toggle`, { method: 'PATCH' }),

    // Purchases
    getPurchases: (params = {}) => {
      const queryString = new URLSearchParams({
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/purchases?${queryString}`);
    },

    getPurchasesByMovie: (movieId, params = {}) => {
      const queryString = new URLSearchParams({
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/purchases/movie/${movieId}?${queryString}`);
    },

    getPurchasesByUser: (userId, params = {}) => {
      const queryString = new URLSearchParams({
        limit: '100',
        ...params
      } as Record<string, string>).toString();
      return apiCall(`/admin/purchases/user/${userId}?${queryString}`);
    },

    // Reports
    getSalesReport: () => apiCall('/admin/reports/sales'),
    getReportByMovie: () => apiCall('/admin/reports/by-movie'),
    getReportByDate: (period = 'daily') => apiCall(`/admin/reports/by-date?period=${period}`),

    // Ticket validation
    validateTicket: (ticketCode) =>
      apiCall(`/purchases/tickets/${ticketCode}/validate`, { method: 'POST' }),
  }), [apiCall]);

  return { apiCall, adminApi };
};