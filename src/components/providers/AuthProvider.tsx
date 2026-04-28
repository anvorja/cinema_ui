// src/providers/AuthProvider.jsx - COMPONENTE REACT CON JSX
import React, { useReducer, useEffect, useRef } from 'react';
import AuthContext, { AUTH_STATES } from '../contexts/AuthContext';
import { authService, userService, getErrorMessage } from "../../services/api.js";

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

  // Guard against React 18 Strict Mode double-invocation.
  // Without this, the effect runs twice in development, firing verifyToken
  // and getCurrentUser twice before the first call has resolved.
  const initialized = useRef(false);

  // Función para verificar y restaurar sesión al cargar
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

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

      const { access_token, refresh_token, user } = response;

      if (!access_token || !user) {
        throw new Error('Respuesta de login inválida');
      }

      // Guardar tokens y datos de usuario
      localStorage.setItem('cinema_token', access_token);
      if (refresh_token) {
        localStorage.setItem('cinema_refresh_token', refresh_token);
      }
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
      localStorage.removeItem('cinema_refresh_token');
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

  // Actualizar perfil (nombre, apellido, teléfono) en user-service → cinema_users
  const updateProfile = async (formData) => {
    try {
      const updated = await userService.updateProfile(formData);
      // Refrescar datos del usuario en el contexto
      const currentUser = state.user;
      const newUser = {
        ...currentUser,
        firstName: updated.first_name ?? formData.firstName,
        first_name: updated.first_name ?? formData.firstName,
        lastName: updated.last_name ?? formData.lastName,
        last_name: updated.last_name ?? formData.lastName,
        phone: updated.phone ?? formData.phone,
      };
      localStorage.setItem('cinema_user', JSON.stringify(newUser));
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user: newUser, token: state.token },
      });
      return { success: true, message: 'Perfil actualizado correctamente' };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  // Cambiar contraseña — va a auth-service (dueño de las credenciales)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await userService.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Contraseña cambiada correctamente' };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  };

  // Eliminar cuenta (soft-delete) + logout automático
  const deleteAccount = async () => {
    try {
      await userService.deleteAccount();
      await logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
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

    // Acciones de autenticación
    login,
    register,
    logout,
    refreshUser,
    clearError,

    // Acciones de perfil (user-service / auth-service)
    updateProfile,
    changePassword,
    deleteAccount,

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