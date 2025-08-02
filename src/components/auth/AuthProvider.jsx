// src/components/auth/AuthProvider.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../hooks/useAuth';
import { authService } from '../../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function para manejar autenticación exitosa
  const handleAuthSuccess = useCallback((access_token, user_info) => {
    // Guardar token e info del usuario
    Cookies.set('token', access_token, { expires: 1 });
    Cookies.set('userInfo', JSON.stringify(user_info), { expires: 1 });

    // Actualizar estados
    setUser(user_info);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    // Intentar logout en el servidor
    try {
      authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }

    // Limpiar datos locales
    Cookies.remove('token');
    Cookies.remove('userInfo');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Verificar autenticación al iniciar
  useEffect(() => {
    const token = Cookies.get('token');
    const userInfo = Cookies.get('userInfo');

    if (token && userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user info:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.data.success) {
        const { access_token, user_info } = response.data.data;
        handleAuthSuccess(access_token, user_info);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  }, [handleAuthSuccess]);

  const register = useCallback(async (userData) => {
    try {

      // Asegurar que los datos estén en el formato correcto
      const formattedData = {
        firstName: userData.firstName || userData.first_name,
        lastName: userData.lastName || userData.last_name,
        email: userData.email,
        password: userData.password
      };

      const response = await authService.register(formattedData);

      if (response.data.success) {
        const { access_token, user_info } = response.data.data;
        handleAuthSuccess(access_token, user_info);
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Error al crear la cuenta' };
      }
    } catch (error) {
      console.error('AuthProvider - Error completo:', error);
      console.error('AuthProvider - Response data:', error.response?.data);

      const message = error.response?.data?.message || 'Error al crear la cuenta';
      return { success: false, error: message };
    }
  }, [handleAuthSuccess]);

  const updateUser = useCallback((newUserInfo) => {
    setUser(newUserInfo);
    Cookies.set('userInfo', JSON.stringify(newUserInfo), { expires: 1 });
  }, []);

  // Memoizar el value para evitar re-renders innecesarios
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }), [user, isAuthenticated, isLoading, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};