// src/components/auth/LogoutButton.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth"; // 🔥 Cambiar import

const LogoutButton = ({
  variant = 'button', // 'button', 'link', 'dropdown-item'
  className = '',
  showConfirm = false,
  redirectTo = '/login',
  children
}) => {
  const { logout, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando logout desde componente...');

      // Ejecutar logout
      await logout();

      // Redirigir después del logout
      if (redirectTo) {
        navigate(redirectTo);
      }

      console.log('✅ Logout completado exitosamente');

    } catch (error) {
      console.error('❌ Error durante logout:', error);
      // El logout debería funcionar siempre debido a la implementación robusta
    } finally {
      setShowModal(false);
    }
  };

  const handleClick = () => {
    if (showConfirm) {
      setShowModal(true);
    } else {
      handleLogout();
    }
  };

  // Estilos base para diferentes variantes
  const baseStyles = {
    button: `
      px-4 py-2 rounded-lg font-medium transition-colors duration-200
      bg-red-600 text-white hover:bg-red-700 
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    `,
    link: `
      text-red-600 hover:text-red-800 font-medium 
      transition-colors duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    'dropdown-item': `
      block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 
      transition-colors duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    `
  };

  const buttonClasses = `${baseStyles[variant]} ${className}`.trim();

  const ButtonContent = () => (
    <>
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cerrando sesión...
        </>
      ) : (
        children || '🚪 Cerrar Sesión'
      )}
    </>
  );

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={handleClick}
          disabled={loading}
          className={buttonClasses}
          type="button"
        >
          <ButtonContent />
        </button>
      ) : variant === 'link' ? (
        <a
          onClick={handleClick}
          className={buttonClasses}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          <ButtonContent />
        </a>
      ) : (
        <div
          onClick={handleClick}
          className={buttonClasses}
          role="menuitem"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          <ButtonContent />
        </div>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  ¿Cerrar sesión?
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que deseas cerrar tu sesión? Deberás volver a iniciar sesión para acceder a tu cuenta.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={loading}
              >
                {loading ? 'Cerrando...' : 'Sí, cerrar sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;