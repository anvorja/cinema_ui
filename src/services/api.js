// src/services/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Cambiar la URL base para conectar con FastAPI
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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
        const token = localStorage.getItem('cinema_token') || Cookies.get('token');
        console.log('🔑 Interceptor: Token found:', token ? 'YES' : 'NO');
        console.log('🌐 Interceptor: Request URL:', config.url);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Interceptor: Added Authorization header');
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
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');
            Cookies.remove('token');
            Cookies.remove('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    // Registro de usuario (mantener como está)
    register: (userData) => api.post('/auth/register', {
        email: userData.email,
        phone: userData.phone,
        first_name: userData.firstName || userData.first_name,
        last_name: userData.lastName || userData.last_name,
        password: userData.password
    }),

    // Login - CORREGIDO para coincidir exactamente con el backend
    login: (credentials) => {
        console.log('🌐 Sending login request:', credentials);

        // Asegurar que se envíe exactamente como espera el backend
        const payload = {
            email: credentials.email,
            password: credentials.password
        };

        console.log('🌐 Login payload:', payload);
        console.log('🌐 Request URL:', `${API_BASE_URL}/auth/login`);

        return api.post('/auth/login', payload);
    },

    // Logout
    logout: () => {
        console.log('🌐 API: Calling logout endpoint');
        console.log('🌐 API: Request URL:', `${API_BASE_URL}/auth/logout`);

        return api.post('/auth/logout')
            .then(response => {
                console.log('🌐 API: Logout response:', response);
                return response;
            })
            .catch(error => {
                console.error('🌐 API: Logout error:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
                // No lanzar el error para que el logout local siempre funcione
                return { data: { message: 'Logout completed locally' } };
            });
    },

    // Validar token
    validateToken: () => api.get('/auth/verify-token'),

    // Obtener usuario actual
    getCurrentUser: () => api.get('/auth/me')
};

// TAMBIÉN VERIFICA QUE LA URL BASE SEA CORRECTA
console.log('🌐 API_BASE_URL:', API_BASE_URL);


// 🎬 SERVICIOS DE PELÍCULAS
export const movieService = {
    // Obtener todas las películas (público)
    getAll: (params = {}) => api.get('/movies', { params }),

    // Obtener película por ID
    getById: (id) => api.get(`/movies/${id}`),

    // Buscar películas
    search: (query) => api.get('/movies/search', { params: { q: query } }),

    // Obtener películas en cartelera
    getNowPlaying: () => api.get('/movies/now-playing'),

    // Obtener próximos estrenos
    getUpcoming: () => api.get('/movies/upcoming')
};

// 🎫 SERVICIOS DE COMPRAS (Requiere autenticación)
export const purchaseService = {
    // Crear nueva compra
    create: (purchaseData) => api.post('/purchases', {
        movie_id: purchaseData.movieId,
        showtime_id: purchaseData.showtimeId,
        seat_numbers: purchaseData.seatNumbers,
        total_amount: purchaseData.totalAmount
    }),

    // Obtener historial de compras del usuario
    getHistory: () => api.get('/purchases'),

    // Obtener detalle de una compra
    getById: (id) => api.get(`/purchases/${id}`)
};

// 👤 SERVICIOS DE USUARIO (Requiere autenticación)
export const userService = {
    // Obtener perfil del usuario
    getProfile: () => api.get('/auth/me'),

    // Actualizar perfil
    updateProfile: (profileData) => api.put('/users/profile', {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone
    }),

    // Cambiar contraseña
    changePassword: (passwordData) => api.put('/users/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
    }),

    // Eliminar cuenta (esto debe implementarse en el backend)
    deleteAccount: () => api.delete('/users/account')
};

// 🏢 SERVICIOS DE ADMINISTRACIÓN (Solo admin)
export const adminService = {
    // Gestión de películas
    movies: {
        getAll: () => api.get('/admin/movies'),
        create: (movieData) => api.post('/admin/movies', movieData),
        update: (id, movieData) => api.put(`/admin/movies/${id}`, movieData),
        delete: (id) => api.delete(`/admin/movies/${id}`),
        toggle: (id) => api.patch(`/admin/movies/${id}/toggle`)
    },

    // Gestión de usuarios
    users: {
        getAll: () => api.get('/admin/users'),
        getById: (id) => api.get(`/admin/users/${id}`),
        toggle: (id) => api.patch(`/admin/users/${id}/toggle`)
    },

    // Reportes y compras
    reports: {
        getSales: () => api.get('/admin/reports/sales'),
        getPurchases: () => api.get('/admin/purchases'),
        getPurchasesByMovie: (movieId) => api.get(`/admin/purchases/movie/${movieId}`),
        getPurchasesByUser: (userId) => api.get(`/admin/purchases/user/${userId}`)
    }
};

// Función helper para manejar errores de la API
export const handleApiError = (error) => {
    if (error.response) {
        // El servidor respondió con un código de error
        const { status, data } = error.response;
        switch (status) {
            case 400:
                return data.detail || 'Datos inválidos';
            case 401:
                return 'No autorizado. Por favor inicia sesión';
            case 403:
                return 'No tienes permisos para realizar esta acción';
            case 404:
                return 'Recurso no encontrado';
            case 500:
                return 'Error interno del servidor';
            default:
                return data.detail || 'Error inesperado';
        }
    } else if (error.request) {
        // No se recibió respuesta del servidor
        return 'No se pudo conectar con el servidor';
    } else {
        // Error en la configuración de la petición
        return error.message || 'Error inesperado';
    }
};

export default api;