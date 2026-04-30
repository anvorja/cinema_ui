// src/components/admin/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';
import MovieEditPage from './movies/MovieEditPage';
import {ToastProvider} from "./providers/ToasProvider.jsx";

const AppContent = () => {
  const { user, loading, login, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await login(email, password);

      if (!result.success) {
        setLoginError(result.error);

        toast.error(result.error, {
          title: 'Error de autenticación',
          duration: 5000
        });
      } else if (result.user?.role !== 'admin') {
        const errorMsg = 'No tienes permisos para acceder al panel de administración.';
        setLoginError(errorMsg);

        toast.error(errorMsg, {
          title: 'Acceso denegado',
          duration: 5000
        });

        await logout();
      } else {
        toast.success(`Bienvenido al panel de administración`, {
          title: 'Login exitoso',
          duration: 3000
        });
      }
    } catch {
      const errorMsg = 'Error inesperado durante el login';
      setLoginError(errorMsg);

      toast.error(errorMsg, {
        title: 'Error de conexión',
        duration: 5000
      });
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  return (
    <Routes>
      <Route path="peliculas/nueva"        element={<MovieEditPage />} />
      <Route path="peliculas/:id/editar"   element={<MovieEditPage />} />
      <Route path="*"                      element={<AdminDashboard />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;