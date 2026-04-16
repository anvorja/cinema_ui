// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from "../components/contexts/AuthContext";

/**
 * Hook personalizado para acceder al contexto de autenticación
 *
 * @returns {Object} Objeto con todas las funciones y estados de autenticación
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

export default useAuth;