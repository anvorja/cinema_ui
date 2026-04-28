// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinema_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas y errores — con silent refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Solo intentar refresh si:
    //  • 401 en ruta que no sea de auth
    //  • no es ya un reintento (evitar loop)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cinema_refresh_token');

      if (refreshToken) {
        try {
          const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });
          const newToken = data.access_token;
          localStorage.setItem('cinema_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);   // retry with new token
        } catch {
          // Refresh failed — session truly expired
          localStorage.removeItem('cinema_token');
          localStorage.removeItem('cinema_refresh_token');
          localStorage.removeItem('cinema_user');
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
      } else {
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const detail = (data?.detail || data?.message || '').toLowerCase();

    switch (status) {
      case 400:
        return data.detail || data.message || 'Datos inválidos';
      case 401: {
        // Distinguir entre contraseña incorrecta y usuario no encontrado
        if (detail.includes('password') || detail.includes('contraseña') ||
            detail.includes('incorrect') || detail.includes('wrong') ||
            detail.includes('invalid credential')) {
          return 'Contraseña incorrecta';
        }
        if (detail.includes('user not found') || detail.includes('usuario no encontrado') ||
            detail.includes('no existe') || detail.includes('not exist') ||
            detail.includes('not registered')) {
          return 'No existe una cuenta con ese correo electrónico';
        }
        if (detail.includes('email') && (detail.includes('not') || detail.includes('no'))) {
          return 'No existe una cuenta con ese correo electrónico';
        }
        return 'Email o contraseña incorrectos';
      }
      case 403:
        return 'No tienes permisos para realizar esta acción';
      case 404:
        return 'No existe una cuenta con ese correo electrónico';
      case 422: {
        // FastAPI devuelve detail como array de errores Pydantic
        if (Array.isArray(data.detail)) {
          return data.detail
            .map(err => {
              const field = err.loc?.slice(1).join('.') || '';
              return field ? `${field}: ${err.msg}` : err.msg;
            })
            .join(' | ');
        }
        return data.detail || data.message || 'Error de validación';
      }
      case 500:
        return 'Error interno del servidor. Inténtalo más tarde.';
      default:
        return data.detail || data.message || `Error ${status}`;
    }
  } else if (error.request) {
    return 'Sin conexión con el servidor. Verifica tu internet e inténtalo de nuevo.';
  } else {
    return error.message || 'Error inesperado';
  }
};

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

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', {
      first_name: data.firstName || data.first_name,
      last_name: data.lastName || data.last_name,
      phone: data.phone,
    });
    return response.data;
  },

  // Cambio de contraseña va a auth-service (dueño de credenciales)
  changePassword: async (currentPassword, newPassword) => {
    await api.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  deleteAccount: async () => {
    await api.delete('/users/me');
  },
};

export const movieService = {
  getAll: async (params = {}) => {
    const response = await api.get('/movies', { params });
    return response.data;
  },

  getPaginated: async (skip = 0, limit = 20, filters = {}) => {
    const params = { skip, limit, ...filters };
    const response = await api.get('/movies', { params });
    return response.data;
  },

  search: async (query, filters = {}) => {
    const params = { q: query, ...filters };
    const response = await api.get('/movies/search', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getHomeData: async ({ cartelera_limit = 8, coming_soon_limit = 4, presales_limit = 4 } = {}) => {
    const response = await api.get('/movies/home', {
      params: { cartelera_limit, coming_soon_limit, presales_limit },
    });
    return response.data;
  },

  getComingSoon: async () => {
    const response = await api.get('/movies/coming-soon');
    return response.data;
  },

  getPresales: async () => {
    const response = await api.get('/movies/presales');
    return response.data;
  },

  getShowtimes: async (movieId, params = {}) => {
    const response = await api.get(`/movies/${movieId}/showtimes`, { params });
    return response.data;
  },

  getTheaters: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/theaters`);
    return response.data;
  },

  // Obtener disponibilidad completa
  getAvailability: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/availability`);
    return response.data;
  },

  // Calificar una película (1-5 estrellas)
  rate: async (movieId, score, review = null) => {
    const response = await api.post(`/movies/${movieId}/rate`, { score, review });
    return response.data;
  },

  // Listado de reseñas de una película
  getRatings: async (movieId, skip = 0, limit = 20) => {
    const response = await api.get(`/movies/${movieId}/ratings`, { params: { skip, limit } });
    return response.data;
  },

  // Calificación del usuario autenticado para una película (null si no ha calificado)
  getMyRating: async (movieId) => {
    const response = await api.get(`/movies/${movieId}/my-rating`);
    return response.data; // null | { score, review, author, created_at }
  },
};

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

export const purchaseService = {
  create: async (purchaseData) => {
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

    console.log('purchaseService.create payload:', payload);
    const response = await api.post('/purchases', payload);
    return response.data;
  },

  // Historial enriquecido (movie info + tickets) desde user-service
  getMyPurchases: async (params = {}) => {
    const response = await api.get('/users/me/purchases', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  cancel: async (id) => {
    const response = await api.post(`/purchases/${id}/cancel`);
    return response.data;
  },
};

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

export const adminService = {
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

    getAll: async (params = {}) => {
      const response = await api.get('/admin/theaters', { params });
      return response.data;
    },

    toggle: async (id) => {
      const response = await api.patch(`/admin/theaters/${id}/toggle`);
      return response.data;
    },
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

export const logApiCall = (method, url, data = null) => {
  console.log(`API Call: ${method.toUpperCase()} ${url}`, data ? { data } : '');
};

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return { status: 'ok', data: response.data };
  } catch (error) {
    return { status: 'error', message: getErrorMessage(error) };
  }
};

console.log('API Configuration:', {
  baseURL: API_BASE_URL,
  timeout: api.defaults.timeout,
  hasToken: !!localStorage.getItem('cinema_token')
});


export const searchMovies = async (query = '', options = {}) => {
  try {
    // Usar el servicio existente
      return await movieService.search(query, options);
  } catch (error) {
    console.error('Error en búsque de películas para sidebar:', error);
    throw error;
  }
};

export const getMovies = async (options = {}) => {
  try {
    // Usar el servicio existente
      return await movieService.getAll(options);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
      return await movieService.getById(movieId);
  } catch (error) {
    console.error('Error al obtener detalles de películas:', error);
    throw error;
  }
};

export default api;