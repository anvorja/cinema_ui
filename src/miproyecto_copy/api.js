// src/services/api.js - SERVICIOS API CON EXPORTACIONES CORREGIDAS
import axios from 'axios';

// Configuración base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinema_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Manejar token expirado
    if (error.response?.status === 401) {
      console.log('🔒 Token expired, clearing local storage');
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ⚠️ FUNCIÓN DE MANEJO DE ERRORES - EXPORTADA CORRECTAMENTE
export const getErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.detail || data.message || 'Datos inválidos';
      case 401:
        return 'Por favor inicia sesión';
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'Recurso no encontrado';
      case 422:
        return data.detail || data.message || 'Error de validación';
      case 500:
        return 'Error interno del servidor';
      default:
        return data.detail || data.message || `Error ${status}`;
    }
  } else if (error.request) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
  } else {
    return error.message || 'Error inesperado';
  }
};

// 🔐 SERVICIOS DE AUTENTICACIÓN
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      email: userData.email,
      phone: userData.phone,
      first_name: userData.firstName || userData.first_name,
      last_name: userData.lastName || userData.last_name,
      password: userData.password
    });
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      console.warn('Logout API call failed, but continuing with local cleanup');
    } finally {
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify-token');
    return response.data;
  }
};

// 🎬 SERVICIOS DE PELÍCULAS
export const movieService = {
  // Obtener todas las películas con paginación
  getAll: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  // Obtener películas con paginación específica
  getPaginated: async (skip = 0, limit = 20, filters = {}) => {
    const params = { skip, limit, ...filters };
    const response = await api.get('/movies', { params });
    return response.data;
  },

  // Buscar películas
  search: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const response = await api.get('/movies/search', { params });
    return response.data;
  },

  // Obtener película por ID
  getById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  // Obtener próximos estrenos
  getComingSoon: async () => {
    const response = await api.get('/movies/coming-soon');
    return response.data;
  },

  // Obtener preventas
  getPresales: async () => {
    const response = await api.get('/movies/presales');
    return response.data;
  },

  // Obtener horarios de una película
  getShowtimes: async (movieId, params = {}) => {
    const response = await api.get(`/movies/${movieId}/showtimes`, { params });
    return response.data;
  },

  // Obtener teatros de una película
  getTheaters: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/theaters`);
    return response.data;
  },

  // Obtener disponibilidad completa
  getAvailability: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/availability`);
    return response.data;
  }
};

// 🏢 SERVICIOS DE TEATROS
export const theaterService = {
  getAll: async () => {
    const response = await api.get('/theaters');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/theaters/${id}`);
    return response.data;
  },

  getMovies: async (theaterId) => {
    const response = await api.get(`/theaters/${theaterId}/movies`);
    return response.data;
  },

  getSchedule: async (theaterId, date) => {
    const params = date ? { date } : {};
    const response = await api.get(`/theaters/${theaterId}/schedule`, { params });
    return response.data;
  }
};

// 🎫 SERVICIOS DE COMPRAS
export const purchaseService = {
  create: async (purchaseData) => {
    // Asegurar que el payload tenga el formato exacto que espera el backend
    const payload = {
      movie_id: purchaseData.movie_id,
      quantity: purchaseData.quantity,
      payment_info: {
        card_number: purchaseData.payment_info.card_number,
        card_holder: purchaseData.payment_info.card_holder,
        expiry_month: purchaseData.payment_info.expiry_month,
        expiry_year: purchaseData.payment_info.expiry_year,
        cvv: purchaseData.payment_info.cvv
      }
    };

    console.log('📦 purchaseService.create payload:', payload);
    const response = await api.post('/purchases', payload);
    return response.data;
  },

  getMyPurchases: async () => {
    const response = await api.get('/purchases');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  }
};

// 📅 SERVICIOS DE CALENDARIO
export const calendarService = {
  getWeekCalendar: async (startDate) => {
    const params = startDate ? { start_date: startDate } : {};
    const response = await api.get('/calendar/week', { params });
    return response.data;
  },

  getTheaterSchedule: async (theaterName) => {
    const response = await api.get(`/calendar/theater/${theaterName}`);
    return response.data;
  },

  getMovieSchedule: async (movieId) => {
    const response = await api.get(`/calendar/movie/${movieId}/schedule`);
    return response.data;
  }
};

// 👑 SERVICIOS DE ADMINISTRACIÓN
export const adminService = {
  // Películas
  movies: {
    create: async (movieData) => {
      const response = await api.post('/admin/movies', movieData);
      return response.data;
    },

    getAll: async (params = {}) => {
      const response = await api.get('/admin/movies', { params });
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`/admin/movies/${id}`);
      return response.data;
    },

    update: async (id, movieData) => {
      const response = await api.put(`/admin/movies/${id}`, movieData);
      return response.data;
    },

    toggle: async (id) => {
      const response = await api.patch(`/admin/movies/${id}/toggle`);
      return response.data;
    }
  },

  // Teatros
  theaters: {
    create: async (theaterData) => {
      const response = await api.post('/admin/theaters', theaterData);
      return response.data;
    },

    getAll: async () => {
      const response = await api.get('/admin/theaters');
      return response.data;
    }
  },

  // Usuarios
  users: {
    getAll: async () => {
      const response = await api.get('/admin/users');
      return response.data;
    },

    getById: async (id) => {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    },

    toggle: async (id) => {
      const response = await api.patch(`/admin/users/${id}/toggle`);
      return response.data;
    }
  },

  // Compras
  purchases: {
    getAll: async () => {
      const response = await api.get('/admin/purchases');
      return response.data;
    },

    getByMovie: async (movieId) => {
      const response = await api.get(`/admin/purchases/movie/${movieId}`);
      return response.data;
    },

    getByUser: async (userId) => {
      const response = await api.get(`/admin/purchases/user/${userId}`);
      return response.data;
    },

    getSalesReport: async () => {
      const response = await api.get('/admin/reports/sales');
      return response.data;
    }
  }
};

// Función helper adicional para debugging
export const logApiCall = (method, url, data = null) => {
  console.log(`📡 API Call: ${method.toUpperCase()} ${url}`, data ? { data } : '');
};

// Función helper para verificar conectividad
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return { status: 'ok', data: response.data };
  } catch (error) {
    return { status: 'error', message: getErrorMessage(error) };
  }
};

// Log de configuración
console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  timeout: api.defaults.timeout,
  hasToken: !!localStorage.getItem('cinema_token')
});

// Exportar instancia por defecto
export default api;