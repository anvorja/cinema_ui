// src/providers/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import {authService} from "../../services/api.js";

// Función auxiliar para manejar errores de API
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || error.response.data?.detail || 'Error en el servidor';
  }
  if (error.request) {
    return 'No se pudo conectar con el servidor';
  }
  return error.message || 'Error inesperado';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      console.log('🔍 Verificando estado de autenticación...');

      const token = localStorage.getItem('cinema_token') || Cookies.get('token');

      if (!token) {
        console.log('❌ No hay token disponible');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verificar si el token sigue siendo válido
      try {
        const userResponse = await authService.getCurrentUser();
        const userInfo = userResponse.data;

        const userData = {
          id: userInfo.id,
          name: userInfo.full_name,
          email: userInfo.email,
          phone: userInfo.phone,
          firstName: userInfo.first_name,
          lastName: userInfo.last_name,
          role: userInfo.role,
          avatar: null
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('cinema_user', JSON.stringify(userData));

        console.log('✅ Usuario autenticado correctamente:', userData.email);

      } catch {
        console.warn('⚠️ Token inválido o expirado, limpiando sesión...');

        // Limpiar datos inválidos
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
        Cookies.remove('token');
        Cookies.remove('userInfo');

        setIsAuthenticated(false);
        setUser(null);
      }

    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Función de login mejorada - CON AUTO LOGIN DESPUÉS DE REGISTRO
  const login = async (credentials, isAutoLoginAfterRegister = false) => {
    try {
      setLoading(true);
      console.log('🔐 Iniciando login...', isAutoLoginAfterRegister ? '(auto después de registro)' : '');

      const response = await authService.login(credentials);
      const { access_token } = response.data;

      // Guardar token primero
      localStorage.setItem('cinema_token', access_token);

      // Pequeña pausa para asegurar que el token esté disponible
      await new Promise(resolve => setTimeout(resolve, 100));

      // Obtener información del usuario
      const userResponse = await authService.getCurrentUser();
      const userInfo = userResponse.data;

      const newUser = {
        id: userInfo.id,
        name: userInfo.full_name,
        email: userInfo.email,
        phone: userInfo.phone,
        firstName: userInfo.first_name,
        lastName: userInfo.last_name,
        role: userInfo.role,
        avatar: null
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('cinema_user', JSON.stringify(newUser));

      console.log('✅ Login exitoso:', newUser.email);

      return { success: true, user: newUser };

    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout mejorada y robusta
  const logout = useCallback(async () => {
    console.log('🚪 Iniciando proceso de logout...');

    try {
      setLoading(true);

      // 1. Intentar logout en el backend (con timeout)
      try {
        console.log('🌐 Llamando endpoint de logout del backend...');

        const logoutPromise = authService.logout();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );

        await Promise.race([logoutPromise, timeoutPromise]);
        console.log('✅ Logout del backend exitoso');

      } catch (backendError) {
        console.warn('⚠️ Error en logout del backend (continuando con limpieza local):', backendError);
        // No fallar el logout si el backend falla
      }

      // 2. Limpieza local SIEMPRE
      console.log('🧹 Limpiando estado local...');

      // Limpiar React state
      setUser(null);
      setIsAuthenticated(false);

      // Limpiar localStorage
      try {
        localStorage.removeItem('cinema_user');
        localStorage.removeItem('cinema_token');
        console.log('✅ localStorage limpiado');
      } catch (localStorageError) {
        console.warn('⚠️ Error limpiando localStorage:', localStorageError);
      }

      // Limpiar cookies
      try {
        Cookies.remove('token');
        Cookies.remove('userInfo');

        // Limpiar cookies del dominio actual también
        const cookies = document.cookie.split(";");
        cookies.forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name.includes('token') || name.includes('cinema') || name.includes('auth')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          }
        });

        console.log('✅ Cookies limpiadas');
      } catch (cookiesError) {
        console.warn('⚠️ Error limpiando cookies:', cookiesError);
      }

      // 3. Limpiar sessionStorage también
      try {
        sessionStorage.removeItem('cinema_user');
        sessionStorage.removeItem('cinema_token');
        console.log('✅ sessionStorage limpiado');
      } catch (sessionStorageError) {
        console.warn('⚠️ Error limpiando sessionStorage:', sessionStorageError);
      }

      // 4. Limpiar cache del navegador si está disponible
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          const cinemaCaches = cacheNames.filter(name =>
            name.includes('cinema') || name.includes('auth')
          );
          await Promise.all(cinemaCaches.map(name => caches.delete(name)));
          console.log('✅ Cache del navegador limpiado');
        }
      } catch (cacheError) {
        console.warn('⚠️ Error limpiando cache:', cacheError);
      }

      console.log('✅ Logout completado exitosamente');

    } catch (error) {
      console.error('❌ Error durante logout:', error);

      // Limpieza de emergencia - SIEMPRE debe funcionar
      try {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('cinema_user');
        localStorage.removeItem('cinema_token');
        Cookies.remove('token');
        Cookies.remove('userInfo');
        console.log('🚨 Limpieza de emergencia completada');
      } catch (emergencyError) {
        console.error('💥 Error crítico en limpieza de emergencia:', emergencyError);
        // Como último recurso, recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para logout de emergencia
  const emergencyLogout = useCallback(() => {
    console.log('🚨 Ejecutando logout de emergencia...');

    try {
      // Limpieza inmediata sin llamadas al backend
      setUser(null);
      setIsAuthenticated(false);

      // Limpiar todo el storage
      localStorage.clear();
      sessionStorage.clear();

      // Limpiar todas las cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });

      // Recargar página para garantizar estado limpio
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);

    } catch (error) {
      console.error('💥 Error crítico en logout de emergencia:', error);
      // Último recurso
      window.location.reload();
    }
  }, []);

  // Función para registro CON AUTO LOGIN
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Iniciando registro...');

      // 1. Registrar usuario
      await authService.register(userData);
      console.log('✅ Registro exitoso');

      // 2. Auto login después del registro
      console.log('🔄 Iniciando auto login después del registro...');
      const loginResult = await login({
        email: userData.email,
        password: userData.password
      }, true);

      if (loginResult.success) {
        return {
          success: true,
          message: 'Usuario registrado e ingresado exitosamente.',
          user: loginResult.user
        };
      } else {
        return {
          success: true,
          message: 'Usuario registrado exitosamente. Por favor inicia sesión.',
          requiresLogin: true
        };
      }

    } catch (error) {
      console.error('❌ Error en registro:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      // TODO: Implementar llamada al backend cuando esté disponible
      // const response = await userService.updateProfile(profileData);

      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        name: `${profileData.firstName} ${profileData.lastName}`
      };

      setUser(updatedUser);
      localStorage.setItem('cinema_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar token
  const refreshAuth = useCallback(async () => {
    console.log('🔄 Refrescando autenticación...');
    await checkAuth();
  }, [checkAuth]);

  // Valores del contexto
  const value = {
    // Estado
    user,
    isAuthenticated,
    loading,

    // Funciones principales
    login,
    logout,
    register,
    updateProfile,

    // Funciones de utilidad
    checkAuth,
    refreshAuth,
    emergencyLogout,

    // Estados derivados
    isLoggedIn: isAuthenticated && user,
    userName: user?.name || user?.firstName || 'Usuario',
    userEmail: user?.email || '',
    userRole: user?.role || 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
