// src/contexts/AuthContext.js
import { createContext } from 'react';

// Estados posibles de autenticación
export const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Definición del contexto con valores por defecto
const AuthContext = createContext({
  // Estado
  user: null,
  token: null,
  error: null,
  loading: false,
  status: AUTH_STATES.LOADING,

  // Estados computados
  isAuthenticated: false,
  isLoading: false,
  hasError: false,
  isAdmin: false,

  // Acciones
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  clearError: () => {},

  // Estados de autenticación
  AUTH_STATES
});

export default AuthContext;