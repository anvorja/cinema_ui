// src/components/admin/App.jsx
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './LoginForm';
import AdminDashboard from './AdminDashboard';

const App = () => {
  const { user, loading, login, isAdmin } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await login(email, password);

      if (!result.success) {
        setLoginError(result.error);
      }
      // Si es exitoso, el estado se actualiza automáticamente por el hook useAuth
    } catch {
      setLoginError('Error inesperado durante el login');
    } finally {
      setLoginLoading(false);
    }
  };

  // Pantalla de carga inicial
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

  // Si no hay usuario o no es admin, mostrar login
  if (!user || !isAdmin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  // Usuario autenticado y es admin, mostrar dashboard
  return <AdminDashboard />;
};

export default App;