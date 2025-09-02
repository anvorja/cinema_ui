// src/components/contexts/AuthProvider.jsx
import { useState, useCallback, useEffect } from 'react';
import { authService, userService, handleApiError } from '../../services/api.js';

import { AuthContext } from '../contexts/AuthContext.js'; // Ruta corregida

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      // Verificar token en localStorage
      const token = localStorage.getItem('cinema_token');
      const storedUser = localStorage.getItem('cinema_user');

      if (!token || !storedUser) {
        console.log('🔍 No hay token o usuario guardado');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        // Verificar token con el backend
        console.log('🔍 Verificando token con backend...');
        const response = await authService.validateToken();

        if (response.data) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ Token válido, usuario autenticado:', parsedUser.email);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch {
        console.log('❌ Token inválido, limpiando almacenamiento');
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
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

  // Verificar autenticación al cargar componente
  useEffect(() => {
    // Usar .then() para evitar el warning de Promise ignored
    checkAuth().then(() => {
      console.log('🏁 Verificación de autenticación completada');
    }).catch((error) => {
      console.error('❌ Error en verificación inicial:', error);
    });
  }, [checkAuth]);

  // Función de login
  const login = async (credentials, skipLoading = false) => {
    try {
      if (!skipLoading) setLoading(true);

      console.log('🔐 Iniciando login para:', credentials.email);

      const response = await authService.login(credentials);

      if (response.data?.access_token && response.data?.user) {
        const { access_token, user: userData } = response.data;

        // Guardar token y usuario
        localStorage.setItem('cinema_token', access_token);
        localStorage.setItem('cinema_user', JSON.stringify(userData));

        console.log('✅ Login exitoso para:', userData.email);

        setUser(userData);
        setIsAuthenticated(true);

        return {
          success: true,
          user: userData,
          message: 'Login exitoso'
        };
      } else {
        throw new Error('Respuesta del servidor incompleta');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      console.log('🚪 Iniciando logout...');

      // Intentar logout en backend (no crítico si falla)
      try {
        await authService.logout();
        console.log('✅ Logout exitoso en backend');
      } catch (error) {
        console.warn('⚠️ Error en logout backend (continuando):', error);
      }

      // Limpiar almacenamiento local
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');

      // Actualizar estado
      setUser(null);
      setIsAuthenticated(false);

      console.log('✅ Logout completado');
      return { success: true };

    } catch (error) {
      console.error('❌ Error en logout:', error);

      // Forzar logout local incluso si hay error
      localStorage.removeItem('cinema_token');
      localStorage.removeItem('cinema_user');
      setUser(null);
      setIsAuthenticated(false);

      return { success: true }; // Siempre retorna éxito para logout local
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('📝 Iniciando registro para:', userData.email);

      const response = await authService.register(userData);

      if (response.data) {
        console.log('✅ Registro exitoso');

        // Auto login después del registro
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
      console.log('📝 Actualizando perfil...');

      const response = await userService.updateProfile(profileData);

      if (response.data?.user) {
        const updatedUser = {
          ...user,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          phone: response.data.user.phone,
          full_name: response.data.user.full_name,
          // Mantener compatibilidad con frontend
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          name: response.data.user.full_name
        };

        setUser(updatedUser);
        localStorage.setItem('cinema_user', JSON.stringify(updatedUser));

        console.log('✅ Perfil actualizado exitosamente');
        return {
          success: true,
          user: updatedUser,
          message: response.data.message
        };
      } else {
        throw new Error('Respuesta del servidor incompleta');
      }
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

  // Función para cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      console.log('🔐 Cambiando contraseña...');

      const response = await userService.changePassword({
        currentPassword,
        newPassword
      });

      if (response.data) {
        console.log('✅ Contraseña cambiada exitosamente');
        return {
          success: true,
          message: response.data.message || 'Contraseña cambiada exitosamente'
        };
      } else {
        throw new Error('Respuesta del servidor incompleta');
      }
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar cuenta
  const deleteAccount = async () => {
    try {
      setLoading(true);
      console.log('🗑️ Eliminando cuenta...');

      const response = await userService.deleteAccount();

      if (response.data) {
        console.log('✅ Cuenta eliminada exitosamente');

        // Limpiar todo después de eliminar
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');
        setUser(null);
        setIsAuthenticated(false);

        return {
          success: true,
          message: response.data.message || 'Cuenta eliminada exitosamente'
        };
      } else {
        throw new Error('Respuesta del servidor incompleta');
      }
    } catch (error) {
      console.error('❌ Error eliminando cuenta:', error);
      return {
        success: false,
        error: handleApiError(error)
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout de emergencia (sin backend)
  const emergencyLogout = useCallback(() => {
    console.log('🚨 Logout de emergencia ejecutado');
    localStorage.removeItem('cinema_token');
    localStorage.removeItem('cinema_user');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  // Función para refrescar autenticación
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
    changePassword,
    deleteAccount,

    // Funciones de utilidad
    checkAuth,
    refreshAuth,
    emergencyLogout,

    // Estados derivados
    isLoggedIn: isAuthenticated && user,
    userName: user?.name || user?.firstName || user?.full_name || 'Usuario',
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