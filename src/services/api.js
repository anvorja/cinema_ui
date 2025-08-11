import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL ||'http://localhost:8080/api';
// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            Cookies.remove('token');
            Cookies.remove('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const authService = {
    register: (userData) => api.post('/v1/auth/register', userData),
    login: (credentials) => api.post('/v1/auth/login', credentials),
    logout: () => api.post('/v1/auth/logout'),
    validateToken: () => api.post('/v1/auth/validate'),
};

// Servicios de autos
export const carService = {
    // CRUD básico
    getAll: (params = {}) => api.get('/v1/cars', { params }),
    getById: (id) => api.get(`/v1/cars/${id}`),
    create: (carData) => api.post('/v1/cars', carData),
    update: (id, carData) => api.put(`/v1/cars/${id}`, carData),
    delete: (id) => api.delete(`/v1/cars/${id}`),

    // Búsquedas y filtros
    search: (searchTerm) => api.get('/v1/cars/search', { params: { q: searchTerm } }),
    filterByBrand: (brand) => api.get('/v1/cars/filter/brand', { params: { brand } }),
    filterByModel: (model) => api.get('/v1/cars/filter/model', { params: { model } }),
    filterByYear: (year) => api.get('/v1/cars/filter/year', { params: { year } }),
    filterByColor: (color) => api.get('/v1/cars/filter/color', { params: { color } }),
    filterByYearRange: (minYear, maxYear) => api.get('/v1/cars/filter/year-range', {
        params: { minYear, maxYear }
    }),

    // NUEVOS ENDPOINTS PARA OPCIONES DE FILTROS
    getFilterOptions: () => api.get('/v1/cars/filter-options'),
    getBrandOptions: () => api.get('/v1/cars/filter-options/brands'),
    getModelOptions: () => api.get('/v1/cars/filter-options/models'),
    getColorOptions: () => api.get('/v1/cars/filter-options/colors'),
    getYearOptions: () => api.get('/v1/cars/filter-options/years'),

    // NUEVO: Método paginado principal
    searchPaginated: async (params = {}) => {
        const queryParams = new URLSearchParams();

        // Parámetros de paginación
        queryParams.append('page', String(params.page || 0));
        queryParams.append('size', String(params.size || 20));

        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
            queryParams.append('sortDirection', params.sortDirection || 'asc');
        }

        // Parámetros de búsqueda
        if (params.searchTerm?.trim()) {
            queryParams.append('searchTerm', params.searchTerm.trim());
        }

        if (params.brand?.trim()) {
            queryParams.append('brand', params.brand.trim());
        }

        if (params.model?.trim()) {
            queryParams.append('model', params.model.trim());
        }

        if (params.year) {
            queryParams.append('year', String(params.year));
        }

        if (params.color?.trim()) {
            queryParams.append('color', params.color.trim());
        }

        if (params.minYear) {
            queryParams.append('minYear', String(params.minYear));
        }

        if (params.maxYear) {
            queryParams.append('maxYear', String(params.maxYear));
        }

        const response = await api.get(`/v1/cars/search/paginated?${queryParams.toString()}`);
        return response.data;
    },

    // Métodos específicos para casos comunes
    getByPage: async (page = 0, size = 20, sortBy = 'createdAt', sortDirection = 'desc') => {
        return carService.searchPaginated({ page, size, sortBy, sortDirection });
    },

    searchByTerm: async (searchTerm, page = 0, size = 20) => {
        return carService.searchPaginated({ searchTerm, page, size });
    },

    filterBy: async (filters, page = 0, size = 20) => {
        return carService.searchPaginated({ ...filters, page, size });
    },

    // Categorías especiales
    getVintage: () => api.get('/v1/cars/vintage'),
    getNew: () => api.get('/v1/cars/new'),

    // Estadísticas
    getStats: () => api.get('/v1/cars/stats'),

    // Verificaciones
    checkPlateAvailability: (plateNumber) =>
        api.get('/v1/cars/plate-available', { params: { plateNumber } }),

    // Búsqueda avanzada
    advancedSearch: (searchData) => api.post('/v1/cars/search', searchData),
};

// Servicios de usuario
export const userService = {
    getProfile: () => api.get('/v1/users/profile'),

    updateProfile: (userData) => {
        const requestData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };
        return api.put('/v1/users/profile', requestData);
    },

    changePassword: (passwordData) => {
        const requestData = {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.newPassword // Debe ser igual a newPassword
        };
        return api.post('/v1/users/change-password', requestData);
    },
    deleteAccount: () => api.delete('/v1/users/profile'),
    getStats: () => api.get('/v1/users/stats'),
    checkEmailAvailability: (email) =>
        api.get('/v1/users/email-available', { params: { email } }),
};

export default api;