// src/components/admin/hooks/useApi.js
import { useAuth } from './useAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useApi = () => {
  const { token } = useAuth();

  const apiCall = async (url, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  // Métodos específicos para el admin
  const adminApi = {
    // Movies
    getMovies: (params = {}) => {
      const queryString = new URLSearchParams({
        include_inactive: true,
        limit: 100,
        ...params
      }).toString();
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
        limit: 100,
        ...params
      }).toString();
      return apiCall(`/admin/users?${queryString}`);
    },

    toggleUser: (id) =>
      apiCall(`/admin/users/${id}/toggle`, {
        method: 'PATCH'
      }),

    // Theaters
    getTheaters: (params = {}) => {
      const queryString = new URLSearchParams({
        include_inactive: true,
        limit: 100,
        ...params
      }).toString();
      return apiCall(`/admin/theaters?${queryString}`);
    },

    toggleTheater: (id) =>
      apiCall(`/admin/theaters/${id}/toggle`, { method: 'PATCH' }),

    // Purchases
    getPurchases: (params = {}) => {
      const queryString = new URLSearchParams({
        limit: 100,
        ...params
      }).toString();
      return apiCall(`/admin/purchases?${queryString}`);
    },

    getPurchasesByMovie: (movieId, params = {}) => {
      const queryString = new URLSearchParams({
        limit: 100,
        ...params
      }).toString();
      return apiCall(`/admin/purchases/movie/${movieId}?${queryString}`);
    },

    getPurchasesByUser: (userId, params = {}) => {
      const queryString = new URLSearchParams({
        limit: 100,
        ...params
      }).toString();
      return apiCall(`/admin/purchases/user/${userId}?${queryString}`);
    },

    // Reports
    getSalesReport: () => apiCall('/admin/reports/sales'),

    // Ticket validation
    validateTicket: (ticketCode) =>
      apiCall(`/purchases/tickets/${ticketCode}/validate`, { method: 'POST' }),
  };

  return { apiCall, adminApi };
};