// src/providers/AuthProvider.jsx - COMPONENTE REACT CON JSX
import React, { useReducer, useEffect } from 'react';
import AuthContext, { AUTH_STATES } from '../contexts/AuthContext';
import {authService, getErrorMessage} from "../../services/api.js";

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  user: null,
  token: localStorage.getItem('cinema_token'),
  status: AUTH_STATES.LOADING,
  error: null,
  loading: false
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: AUTH_STATES.AUTHENTICATED,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        status: AUTH_STATES.ERROR,
        loading: false
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        token: null,
        status: AUTH_STATES.UNAUTHENTICATED,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Provider del contexto
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para verificar y restaurar sesión al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('cinema_token');

      if (!token) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        return;
      }

      try {
        // Verificar si el token es válido
        await authService.verifyToken();

        // Si el token es válido, obtener datos actualizados del usuario
        const userData = await authService.getCurrentUser();

        // Guardar datos actualizados
        localStorage.setItem('cinema_user', JSON.stringify(userData));

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            user: userData,
            token: token
          }
        });
      } catch (error) {
        console.error('Token inválido o expirado:', error);
        // Token inválido, limpiar y hacer logout
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      console.log('🔐 AuthProvider: Iniciando login...');

      const response = await authService.login(credentials);

      const { access_token, user } = response;

      if (!access_token || !user) {
        throw new Error('Respuesta de login inválida');
      }

      // Guardar token y datos de usuario
      localStorage.setItem('cinema_token', access_token);
      localStorage.setItem('cinema_user', JSON.stringify(user));

      console.log('✅ AuthProvider: Login exitoso', { user: user.email });

      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: user,
          token: access_token
        }
      });

      return { success: true, user };

    } catch (error) {
      console.error('❌ AuthProvider: Error en login:', error);
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Función de registro
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

    try {
      console.log('📝 AuthProvider: Iniciando registro...');

      await authService.register(userData);

      console.log('✅ AuthProvider: Registro exitoso');

      // Después del registro, hacer login automático
      const loginResult = await login({
        email: userData.email,
        password: userData.password
      });

      return loginResult;

    } catch (error) {
      console.error('❌ AuthProvider: Error en registro:', error);
      const errorMessage = getErrorMessage(error);

      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      console.log('🚪 AuthProvider: Iniciando logout...');

      // Llamar al endpoint de logout (invalidar token en servidor)
      await authService.logout();

      console.log('✅ AuthProvider: Logout exitoso');

    } catch (error) {
      console.warn('⚠️ AuthProvider: Error en logout del servidor, pero continuando con limpieza local:', error);
    } finally {
      // Siempre limpiar el estado local
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Función para actualizar datos del usuario
  const refreshUser = async () => {
    if (!state.token) return;

    try {
      const userData = await authService.getCurrentUser();
      localStorage.setItem('cinema_user', JSON.stringify(userData));

      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          user: userData,
          token: state.token
        }
      });

      return userData;
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Si falla, podría ser que el token expiró
      logout();
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Valores computados
  const isAuthenticated = state.status === AUTH_STATES.AUTHENTICATED && !!state.user;
  const isLoading = state.status === AUTH_STATES.LOADING || state.loading;
  const hasError = state.status === AUTH_STATES.ERROR && !!state.error;
  const isAdmin = isAuthenticated && state.user?.role === 'admin';

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    token: state.token,
    error: state.error,
    loading: state.loading,
    status: state.status,

    // Estados computados
    isAuthenticated,
    isLoading,
    hasError,
    isAdmin,

    // Acciones
    login,
    register,
    logout,
    refreshUser,
    clearError,

    // Estados de autenticación
    AUTH_STATES
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;