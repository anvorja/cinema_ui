// src/components/contexts/AuthContext.js
import { createContext } from 'react';

/**
 * Contexto de autenticación para la aplicación Cinema
 *
 * Proporciona el contexto que será usado por el hook useAuth
 * y poblado por el AuthProvider
 */
const AuthContext = createContext({
  // Estado de autenticación
  user: null,
  isAuthenticated: false,
  loading: false,

  // Funciones principales
  login: async () => ({ success: false, error: 'Not implemented' }),
  logout: async () => ({ success: false, error: 'Not implemented' }),
  register: async () => ({ success: false, error: 'Not implemented' }),
  updateProfile: async () => ({ success: false, error: 'Not implemented' }),
  changePassword: async () => ({ success: false, error: 'Not implemented' }),
  deleteAccount: async () => ({ success: false, error: 'Not implemented' }),

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

// Solo exportamos la exportación nombrada
export { AuthContext };

// También exportamos como default para compatibilidad
export default AuthContext;