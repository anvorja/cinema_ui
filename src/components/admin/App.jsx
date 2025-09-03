// src/components/admin/App.jsx
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';
import {ToastProvider} from "./providers/ToasProvider.jsx";

const AppContent = () => {
  const { user, loading, login, isAdmin } = useAuth();
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

        // Toast de error para login fallido
        toast.error(result.error, {
          title: 'Error de autenticación',
          duration: 5000
        });
      } else {
        // Toast de éxito para login exitoso
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

  return <AdminDashboard />;
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;