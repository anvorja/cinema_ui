// src/components/auth/AuthProvider.jsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../hooks/useAuth';
import { authService } from '../../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.data.success) {
        const { access_token, user_info } = response.data.data;

        // Guardar token y info del usuario
        Cookies.set('token', access_token, { expires: 1 });
        Cookies.set('userInfo', JSON.stringify(user_info), { expires: 1 });

        setUser(user_info);
        setIsAuthenticated(true);

        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.data.success) {
        const { access_token, user_info } = response.data.data;

        // Guardar token y info del usuario
        Cookies.set('token', access_token, { expires: 1 });
        Cookies.set('userInfo', JSON.stringify(user_info), { expires: 1 });

        setUser(user_info);
        setIsAuthenticated(true);

        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear la cuenta';
      return { success: false, error: message };
    }
  };

  const logout = () => {
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
  };

  const updateUser = (newUserInfo) => {
    setUser(newUserInfo);
    Cookies.set('userInfo', JSON.stringify(newUserInfo), { expires: 1 });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};