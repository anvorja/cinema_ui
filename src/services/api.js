// // src/services/api.js
// import axios from 'axios';
// import Cookies from 'js-cookie';
//
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
//
// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });
//
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('cinema_token') || Cookies.get('token');
//         console.log('🔑 Interceptor: Token found:', token ? 'YES' : 'NO');
//         console.log('🌐 Interceptor: Request URL:', config.url);
//
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//             console.log('🔑 Interceptor: Added Authorization header');
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
//
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expirado o inválido
//             localStorage.removeItem('cinema_token');
//             localStorage.removeItem('cinema_user');
//             Cookies.remove('token');
//             Cookies.remove('userInfo');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );
//
// export const authService = {
//
//     register: (userData) => api.post('/auth/register', {
//         email: userData.email,
//         phone: userData.phone,
//         first_name: userData.firstName || userData.first_name,
//         last_name: userData.lastName || userData.last_name,
//         password: userData.password
//     }),
//
//     login: (credentials) => {
//         console.log('🌐 Sending login request:', credentials);
//
//         const payload = {
//             email: credentials.email,
//             password: credentials.password
//         };
//
//         console.log('🌐 Login payload:', payload);
//         console.log('🌐 Request URL:', `${API_BASE_URL}/auth/login`);
//
//         return api.post('/auth/login', payload);
//     },
//
//     logout: () => {
//         console.log('🌐 API: Calling logout endpoint');
//         console.log('🌐 API: Request URL:', `${API_BASE_URL}/auth/logout`);
//
//         return api.post('/auth/logout')
//             .then(response => {
//                 console.log('🌐 API: Logout response:', response);
//                 return response;
//             })
//             .catch(error => {
//                 console.error('🌐 API: Logout error:', {
//                     status: error.response?.status,
//                     statusText: error.response?.statusText,
//                     data: error.response?.data
//                 });
//                 // No lanzar el error para que el logout local siempre funcione
//                 return { data: { message: 'Logout completed locally' } };
//             });
//     },
//
//     // Validar token
//     validateToken: () => api.get('/auth/verify-token'),
//
//     // Obtener usuario actual
//     getCurrentUser: () => api.get('/auth/me')
// };
//
// // TAMBIÉN VERIFICA QUE LA URL BASE SEA CORRECTA
// console.log('🌐 API_BASE_URL:', API_BASE_URL);
//
//
// // 🎬 SERVICIOS DE PELÍCULAS
// export const movieService = {
//     // Obtener todas las películas (público)
//     getAll: (params = {}) => api.get('/movies', { params }),
//
//     // Obtener película por ID
//     getById: (id) => api.get(`/movies/${id}`),
//
//     // Buscar películas
//     search: (query) => api.get('/movies/search', { params: { q: query } }),
//
//     // Obtener películas en cartelera
//     getNowPlaying: () => api.get('/movies/now-playing'),
//
//     // Obtener próximos estrenos
//     getUpcoming: () => api.get('/movies/upcoming')
// };
//
// // 🎫 SERVICIOS DE COMPRAS (Requiere autenticación)
// export const purchaseService = {
//     // Crear nueva compra
//     create: (purchaseData) => api.post('/purchases', {
//         movie_id: purchaseData.movieId,
//         showtime_id: purchaseData.showtimeId,
//         seat_numbers: purchaseData.seatNumbers,
//         total_amount: purchaseData.totalAmount
//     }),
//
//     // Obtener historial de compras del usuario
//     getHistory: () => api.get('/purchases'),
//
//     // Obtener detalle de una compra
//     getById: (id) => api.get(`/purchases/${id}`)
// };
//
// // 👤 SERVICIOS DE USUARIO (Requiere autenticación)
// export const userService = {
//     // Obtener perfil del usuario
//     getProfile: () => api.get('/auth/me'),
//
//     // Actualizar perfil
//     updateProfile: (profileData) => api.put('/users/profile', {
//         first_name: profileData.firstName,
//         last_name: profileData.lastName,
//         phone: profileData.phone
//     }),
//
//     // Cambiar contraseña
//     changePassword: (passwordData) => api.put('/users/change-password', {
//         current_password: passwordData.currentPassword,
//         new_password: passwordData.newPassword
//     }),
//
//     // Eliminar cuenta (esto debe implementarse en el backend)
//     deleteAccount: () => api.delete('/users/account')
// };
//
// // 🏢 SERVICIOS DE ADMINISTRACIÓN (Solo admin)
// export const adminService = {
//     // Gestión de películas
//     movies: {
//         getAll: () => api.get('/admin/movies'),
//         create: (movieData) => api.post('/admin/movies', movieData),
//         update: (id, movieData) => api.put(`/admin/movies/${id}`, movieData),
//         delete: (id) => api.delete(`/admin/movies/${id}`),
//         toggle: (id) => api.patch(`/admin/movies/${id}/toggle`)
//     },
//
//     // Gestión de usuarios
//     users: {
//         getAll: () => api.get('/admin/users'),
//         getById: (id) => api.get(`/admin/users/${id}`),
//         toggle: (id) => api.patch(`/admin/users/${id}/toggle`)
//     },
//
//     // Reportes y compras
//     reports: {
//         getSales: () => api.get('/admin/reports/sales'),
//         getPurchases: () => api.get('/admin/purchases'),
//         getPurchasesByMovie: (movieId) => api.get(`/admin/purchases/movie/${movieId}`),
//         getPurchasesByUser: (userId) => api.get(`/admin/purchases/user/${userId}`)
//     }
// };
//
// // Función helper para manejar errores de la API
// export const handleApiError = (error) => {
//     if (error.response) {
//         // El servidor respondió con un código de error
//         const { status, data } = error.response;
//         switch (status) {
//             case 400:
//                 return data.detail || 'Datos inválidos';
//             case 401:
//                 return 'No autorizado. Por favor inicia sesión';
//             case 403:
//                 return 'No tienes permisos para realizar esta acción';
//             case 404:
//                 return 'Recurso no encontrado';
//             case 500:
//                 return 'Error interno del servidor';
//             default:
//                 return data.detail || 'Error inesperado';
//         }
//     } else if (error.request) {
//         // No se recibió respuesta del servidor
//         return 'No se pudo conectar con el servidor';
//     } else {
//         // Error en la configuración de la petición
//         return error.message || 'Error inesperado';
//     }
// };
//
// export default api;


// src/services/api.js
import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para añadir token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinema_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log para debugging
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('🚨 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.detail || error.message
    });

    // Si el token expiró, limpiar autenticación
    if (error.response?.status === 401) {
      console.log('🔓 Token expired, cleaning authentication');
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');

      // Opcional: redirigir a login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// 🔐 SERVICIOS DE AUTENTICACIÓN
export const authService = {
  // Login
  login: (credentials) => {
    console.log('🔐 AuthService: Attempting login for:', credentials.email);
    return api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
  },

  // Registro
  register: (userData) => {
    console.log('📝 AuthService: Attempting registration for:', userData.email);
    return api.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone || null
    });
  },

  // Logout
  logout: () => {
    console.log('🚪 AuthService: Attempting logout');
    return api.post('/auth/logout')
      .catch(error => {
        console.warn('⚠️ Logout error (continuing with local cleanup):', {
          status: error.response?.status,
          message: error.response?.data?.detail
        });
        // No lanzar el error para que el logout local siempre funcione
        return { data: { message: 'Logout completed locally' } };
      });
  },

  // Validar token
  validateToken: () => {
    console.log('🔍 AuthService: Validating token');
    return api.get('/auth/verify-token');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    console.log('👤 AuthService: Getting current user');
    return api.get('/auth/me');
  }
};

// 👤 SERVICIOS DE USUARIO (Requiere autenticación)
export const userService = {
  // Obtener perfil del usuario
  getProfile: () => {
    console.log('👤 UserService: Getting user profile');
    return api.get('/auth/me');
  },

  // Actualizar perfil
  updateProfile: (profileData) => {
    console.log('👤 UserService: Updating profile');
    return api.put('/users/profile', {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone: profileData.phone
    });
  },

  // Cambiar contraseña
  changePassword: (passwordData) => {
    console.log('🔐 UserService: Changing password');
    return api.put('/users/change-password', {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    });
  },

  // Eliminar cuenta
  deleteAccount: () => {
    console.log('🗑️ UserService: Deleting account');
    return api.delete('/users/account');
  }
};

// 🎬 SERVICIOS DE PELÍCULAS
export const movieService = {
  // Obtener todas las películas (público)
  getAll: (params = {}) => {
    console.log('🎬 MovieService: Getting all movies');
    return api.get('/movies', { params });
  },

  // Obtener película por ID
  getById: (id) => {
    console.log('🎬 MovieService: Getting movie by ID:', id);
    return api.get(`/movies/${id}`);
  },

  // Buscar películas
  search: (query) => {
    console.log('🔍 MovieService: Searching movies:', query);
    return api.get('/movies/search', { params: { q: query } });
  },

  // Obtener películas en cartelera
  getNowPlaying: () => {
    console.log('🎬 MovieService: Getting now playing movies');
    return api.get('/movies/now-playing');
  },

  // Obtener próximos estrenos
  getUpcoming: () => {
    console.log('🎬 MovieService: Getting upcoming movies');
    return api.get('/movies/upcoming');
  }
};

// 🎫 SERVICIOS DE COMPRAS (Requiere autenticación)
export const purchaseService = {
  // Crear nueva compra
  create: (purchaseData) => {
    console.log('🎫 PurchaseService: Creating purchase');
    return api.post('/purchases', {
      movie_id: purchaseData.movieId,
      showtime_id: purchaseData.showtimeId,
      seat_numbers: purchaseData.seatNumbers,
      total_amount: purchaseData.totalAmount
    });
  },

  // Obtener historial de compras del usuario
  getHistory: () => {
    console.log('🎫 PurchaseService: Getting purchase history');
    return api.get('/purchases');
  },

  // Obtener detalle de una compra
  getById: (id) => {
    console.log('🎫 PurchaseService: Getting purchase by ID:', id);
    return api.get(`/purchases/${id}`);
  }
};

// 🛠 SERVICIOS DE ADMINISTRACIÓN (Solo admin)
export const adminService = {
  // Gestión de películas
  movies: {
    getAll: () => {
      console.log('🛠 AdminService: Getting all movies (admin)');
      return api.get('/admin/movies');
    },

    create: (movieData) => {
      console.log('🛠 AdminService: Creating movie');
      return api.post('/admin/movies', movieData);
    },

    update: (id, movieData) => {
      console.log('🛠 AdminService: Updating movie:', id);
      return api.put(`/admin/movies/${id}`, movieData);
    },

    delete: (id) => {
      console.log('🛠 AdminService: Deleting movie:', id);
      return api.delete(`/admin/movies/${id}`);
    },

    toggle: (id) => {
      console.log('🛠 AdminService: Toggling movie status:', id);
      return api.patch(`/admin/movies/${id}/toggle`);
    }
  },

  // Gestión de usuarios
  users: {
    getAll: () => {
      console.log('🛠 AdminService: Getting all users');
      return api.get('/admin/users');
    },

    getById: (id) => {
      console.log('🛠 AdminService: Getting user by ID:', id);
      return api.get(`/admin/users/${id}`);
    },

    toggle: (id) => {
      console.log('🛠 AdminService: Toggling user status:', id);
      return api.patch(`/admin/users/${id}/toggle`);
    }
  },

  // Reportes y compras
  reports: {
    getSales: () => {
      console.log('🛠 AdminService: Getting sales reports');
      return api.get('/admin/reports/sales');
    },

    getPurchases: () => {
      console.log('🛠 AdminService: Getting purchases');
      return api.get('/admin/purchases');
    },

    getPurchasesByMovie: (movieId) => {
      console.log('🛠 AdminService: Getting purchases by movie:', movieId);
      return api.get(`/admin/purchases/movie/${movieId}`);
    },

    getPurchasesByUser: (userId) => {
      console.log('🛠 AdminService: Getting purchases by user:', userId);
      return api.get(`/admin/purchases/user/${userId}`);
    }
  }
};

// Función helper para manejar errores de la API
export const handleApiError = (error) => {
  console.error('🚨 Handling API error:', error);

  if (error.response) {
    // El servidor respondió con un código de error
    const { status, data } = error.response;

    // Mensajes de error más específicos
    switch (status) {
      case 400:
        // Error de validación o datos inválidos
        if (data.detail && typeof data.detail === 'object') {
          // Si el detail es un array de errores de validación
          if (Array.isArray(data.detail)) {
            return data.detail.map(err => err.msg).join(', ');
          }
          // Si el detail es un objeto con campos específicos
          return Object.values(data.detail).join(', ');
        }
        return data.detail || data.message || 'Datos inválidos';

      case 401:
        return 'No autorizado. Por favor inicia sesión nuevamente';

      case 403:
        return 'No tienes permisos para realizar esta acción';

      case 404:
        return 'Recurso no encontrado';

      case 422:
        // Error de validación de Pydantic/FastAPI
        if (data.detail && Array.isArray(data.detail)) {
          return data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
        }
        return data.detail || 'Error de validación';

      case 429:
        return 'Demasiadas peticiones. Por favor intenta más tarde';

      case 500:
        return 'Error interno del servidor. Por favor intenta más tarde';

      case 503:
        return 'Servicio no disponible. Por favor intenta más tarde';

      default:
        return data.detail || data.message || `Error ${status}`;
    }
  } else if (error.request) {
    // No se recibió respuesta del servidor
    console.error('🚨 Network error - no response received');
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
  } else {
    // Error en la configuración de la petición
    console.error('🚨 Request setup error:', error.message);
    return error.message || 'Error inesperado al procesar la petición';
  }
};

// Log de configuración al cargar el módulo
console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  timeout: api.defaults.timeout,
  hasToken: !!localStorage.getItem('cinema_token')
});

// Exportar instancia principal
export default api;