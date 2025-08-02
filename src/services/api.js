import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api';

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