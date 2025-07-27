// components/ui/ThemeToggle.jsx - Versión mejorada
import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-12 h-6 rounded-full p-0.5
        transition-all duration-300 transform hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        shadow-md hover:shadow-lg
        ${isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
        }
        ${className}
      `}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {/* Círculo deslizante */}
      <div
        className={`
          absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
          transform transition-all duration-300 flex items-center justify-center
          ${isDark ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {isDark ? (
          <MoonIcon className="w-3 h-3 text-blue-600" />
        ) : (
          <SunIcon className="w-3 h-3 text-yellow-600" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;