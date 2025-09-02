// src/components/admin/hooks/useAuth.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Ajustar según tu configuración

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData.role === 'admin') {
              setUser(userData);
            } else {
              // No es admin, limpiar token
              localStorage.removeItem('token');
              setToken(null);
            }
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'admin') {
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token);
          setUser(data.user);
          return { success: true };
        } else {
          return { success: false, error: 'No tienes permisos de administrador' };
        }
      } else {
        const error = await response.json();
        return { success: false, error: error.detail || 'Error de autenticación' };
      }
    } catch {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      // Opcional: llamar al endpoint de logout del backend
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin'
  };
};