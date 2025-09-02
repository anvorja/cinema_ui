// src/contexts/AuthContext.js
import { createContext } from 'react';

/**
 * Contexto de autenticación para la aplicación Cinema
 *
 * Proporciona el contexto que será usado por el hook useAuth
 * y poblado por el AuthProvider
 */
export const AuthContext = createContext({
  // Estado de autenticación
  user: null,
  isAuthenticated: false,
  loading: false,

  // Funciones principales
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateProfile: async () => {},

  // Funciones de utilidad
  checkAuth: async () => {},
  refreshAuth: async () => {},
  emergencyLogout: () => {},

  // Estados derivados
  isLoggedIn: false,
  userName: '',
  userEmail: '',
  userRole: 'customer'
});

export default AuthContext;