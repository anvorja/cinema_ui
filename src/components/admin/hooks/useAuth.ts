// src/components/admin/hooks/useAuth.js
// Thin wrapper sobre AuthContext — fuente de verdad única para toda la app.
import { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);

  // admin/App.jsx llama login(email, password) con dos args separados.
  // AuthContext.login espera ({ email, password }). Adaptamos aquí.
  const login = (email, password) => auth.login({ email, password });

  return {
    user:    auth.user,
    token:   auth.token,
    loading: auth.isLoading,   // isLoading = verificación inicial de sesión
    login,
    logout:  auth.logout,
    isAdmin: auth.isAdmin,
  };
};
