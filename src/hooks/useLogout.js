// src/hooks/useLogout.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejar logout con opciones avanzadas
 *
 * @param {Object} options - Opciones de configuración
 * @param {string} options.redirectTo - Ruta a la que redirigir después del logout (default: '/login')
 * @param {boolean} options.showNotification - Mostrar notificación de logout exitoso (default: true)
 * @param {Function} options.onSuccess - Callback ejecutado después del logout exitoso
 * @param {Function} options.onError - Callback ejecutado si hay error en logout
 * @param {boolean} options.clearAllStorage - Limpiar todo el storage incluyendo sessionStorage (default: true)
 * @param {number} options.redirectDelay - Delay antes de redirigir en milisegundos (default: 100)
 *
 * @returns {Object} Objeto con funciones y estados del logout
 */
export const useLogout = (options = {}) => {
  const {
    redirectTo = '/',
    showNotification = true,
    onSuccess,
    onError,
    clearAllStorage = true,
    redirectDelay = 100
  } = options;

  const { logout: authLogout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Ejecuta el logout con limpieza completa
   */
  const performLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      setError(null);

      console.log('🚪 useLogout: Iniciando proceso de logout...');

      // Ejecutar logout del AuthProvider
      await authLogout();

      // Limpieza adicional si se solicita
      if (clearAllStorage) {
        try {
          // Limpiar sessionStorage también
          sessionStorage.clear();

          // Limpiar cualquier cache de la aplicación
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            const cinemaCaches = cacheNames.filter(name =>
              name.includes('cinema') || name.includes('auth')
            );
            await Promise.all(cinemaCaches.map(name => caches.delete(name)));
          }

          console.log('🧹 useLogout: Storage completo limpiado');
        } catch (cleanupError) {
          console.warn('⚠️ useLogout: Error durante limpieza adicional:', cleanupError);
        }
      }

      // Callback de éxito
      if (onSuccess) {
        try {
          await onSuccess();
        } catch (callbackError) {
          console.warn('⚠️ useLogout: Error en callback onSuccess:', callbackError);
        }
      }

      // Mostrar notificación si está habilitada
      if (showNotification && 'Notification' in window) {
        try {
          if (Notification.permission === 'granted') {
            new Notification('Sesión cerrada', {
              body: 'Has cerrado sesión exitosamente.',
              icon: '/favicon.ico',
              tag: 'cinema-logout'
            });
          }
        } catch (notificationError) {
          console.warn('⚠️ useLogout: Error mostrando notificación:', notificationError);
        }
      }

      // Redirigir con delay
      if (redirectTo) {
        console.log(`🔄 useLogout: Redirigiendo a ${redirectTo}`);
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, redirectDelay);
      }

      console.log('✅ useLogout: Logout completado exitosamente');

    } catch (logoutError) {
      console.error('❌ useLogout: Error durante logout:', logoutError);
      setError(logoutError);

      // Callback de error
      if (onError) {
        try {
          await onError(logoutError);
        } catch (callbackError) {
          console.warn('⚠️ useLogout: Error en callback onError:', callbackError);
        }
      }

      // Incluso si hay error, hacer limpieza local básica
      try {
        localStorage.removeItem('cinema_token');
        localStorage.removeItem('cinema_user');

        if (redirectTo) {
          setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, redirectDelay);
        }
      } catch (cleanupError) {
        console.error('❌ useLogout: Error en limpieza de emergencia:', cleanupError);
      }

    } finally {
      setIsLoggingOut(false);
    }
  }, [
    authLogout,
    navigate,
    redirectTo,
    redirectDelay,
    showNotification,
    onSuccess,
    onError,
    clearAllStorage
  ]);

  /**
   * Logout con confirmación usando confirm nativo
   */
  const logoutWithConfirm = useCallback((message = '¿Cerrar sesión?') => {
    return new Promise((resolve, reject) => {
      if (window.confirm(message)) {
        performLogout()
          .then(() => resolve(true))
          .catch(reject);
      } else {
        resolve(false);
      }
    });
  }, [performLogout]);

  /**
   * Logout de emergencia (sin llamar al backend)
   */
  const emergencyLogout = useCallback(async () => {
    try {
      console.log('🚨 useLogout: Ejecutando logout de emergencia...');

      // Limpiar todo el storage local inmediatamente
      localStorage.clear();
      sessionStorage.clear();

      // Limpiar cookies manualmente
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });

      // Limpiar cache si está disponible
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Callback de éxito si existe
      if (onSuccess) {
        try {
          await onSuccess();
        } catch (callbackError) {
          console.warn('⚠️ useLogout: Error en callback onSuccess durante emergencia:', callbackError);
        }
      }

      // Recargar página para garantizar estado limpio
      setTimeout(() => {
        window.location.href = redirectTo || '/';
      }, 500);

    } catch (error) {
      console.error('💥 useLogout: Error en logout de emergencia:', error);
      // Como último recurso
      window.location.reload();
    }
  }, [redirectTo, onSuccess]);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Verifica si el proceso de logout está en curso
   */
  const isLoading = isLoggingOut || authLoading;

  return {
    // Funciones principales
    logout: performLogout,
    logoutWithConfirm,
    emergencyLogout,

    // Estados
    isLoggingOut,
    error,
    isLoading,

    // Utilidades
    clearError
  };
};

export default useLogout;