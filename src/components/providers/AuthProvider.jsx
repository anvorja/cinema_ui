// src/providers/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('cinema_user');
        const storedToken = localStorage.getItem('cinema_token');

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('cinema_user');
        localStorage.removeItem('cinema_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);

      // Simular llamada a la API (reemplazar con tu backend real)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validación básica simulada
      if (!credentials.email || !credentials.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // Mock user data (esto vendrá de tu backend)
      const mockUser = {
        id: 1,
        name: 'Andrés',
        email: credentials.email,
        avatar: null,
        phone: '+57 300 123 4567',
        points: 20, // visitas para ser Cliente Platino
        memberType: 'regular', // regular, platino, premium
        preferences: {
          notifications: true,
          promotions: true
        }
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Actualizar estado
      setUser(mockUser);
      setIsAuthenticated(true);

      // Guardar en localStorage
      localStorage.setItem('cinema_user', JSON.stringify(mockUser));
      localStorage.setItem('cinema_token', mockToken);

      return { success: true, user: mockUser };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);

      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validaciones básicas
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Todos los campos son requeridos');
      }

      if (userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: null,
        phone: userData.phone || null,
        points: 0,
        memberType: 'regular',
        preferences: {
          notifications: true,
          promotions: false
        }
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Actualizar estado
      setUser(newUser);
      setIsAuthenticated(true);

      // Guardar en localStorage
      localStorage.setItem('cinema_user', JSON.stringify(newUser));
      localStorage.setItem('cinema_token', mockToken);

      return { success: true, user: newUser };

    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Error al registrarse'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cinema_user');
    localStorage.removeItem('cinema_token');
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUser = { ...user, ...profileData };

      setUser(updatedUser);
      localStorage.setItem('cinema_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar perfil'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validaciones
      if (!currentPassword || !newPassword) {
        throw new Error('Contraseña actual y nueva contraseña son requeridas');
      }

      if (newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      // Simular validación de contraseña actual
      // En la implementación real, el backend validaría esto
      return { success: true, message: 'Contraseña actualizada correctamente' };

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al cambiar contraseña'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el usuario tiene permisos de admin
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.memberType === 'admin');
  };

  // Función para verificar si el usuario es premium
  const isPremium = () => {
    return user && (user.memberType === 'platino' || user.memberType === 'premium');
  };

  // Función para agregar puntos al usuario
  const addPoints = (points) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      points: user.points + points
    };

    setUser(updatedUser);
    localStorage.setItem('cinema_user', JSON.stringify(updatedUser));
  };

  const value = {
    // Estados
    user,
    isAuthenticated,
    loading,

    // Funciones principales
    login,
    register,
    logout,
    updateProfile,
    changePassword,

    // Utilidades
    isAdmin,
    isPremium,
    addPoints
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};