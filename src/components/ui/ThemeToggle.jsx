// // components/ui/ThemeToggle.jsx - Versión mejorada
// import React from 'react';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
// import { useTheme } from '../../hooks/useTheme';
//
// const ThemeToggle = ({ className = '' }) => {
//   const { isDark, toggleTheme } = useTheme();
//
//   return (
//     <button
//       onClick={toggleTheme}
//       className={`
//         relative w-12 h-6 rounded-full p-0.5
//         transition-all duration-300 transform hover:scale-110
//         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
//         shadow-md hover:shadow-lg
//         ${isDark
//           ? 'bg-gradient-to-r from-blue-600 to-purple-600'
//           : 'bg-gradient-to-r from-yellow-400 to-orange-500'
//         }
//         ${className}
//       `}
//       title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
//       aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
//     >
//       {/* Círculo deslizante */}
//       <div
//         className={`
//           absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm
//           transform transition-all duration-300 flex items-center justify-center
//           ${isDark ? 'translate-x-6' : 'translate-x-0'}
//         `}
//       >
//         {isDark ? (
//           <MoonIcon className="w-3 h-3 text-blue-600" />
//         ) : (
//           <SunIcon className="w-3 h-3 text-yellow-600" />
//         )}
//       </div>
//     </button>
//   );
// };
//
// export default ThemeToggle;


// src/components/ui/ThemeToggle.jsx
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils';

const ThemeToggle = ({ variant = 'default', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const getGlassStyles = () => {
    if (variant === 'glass') {
      return cn(
        'bg-white/10 dark:bg-white/5',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-white/10',
        'hover:bg-white/20 dark:hover:bg-white/10',
        'shadow-lg hover:shadow-xl'
      );
    }
    return 'bg-white/10 hover:bg-white/20 border border-white/20';
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        getButtonSize(),
        getGlassStyles(),
        'relative overflow-hidden group rounded-lg',
        'transition-all duration-300 ease-in-out',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-blue-400/20'
      )}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Sun Icon */}
      <SunIcon className={cn(
        getIconSize(),
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'transition-all duration-500 ease-in-out',
        isDark
          ? 'rotate-90 scale-0 opacity-0'
          : 'rotate-0 scale-100 opacity-100',
        'text-amber-500 dark:text-amber-400'
      )} />

      {/* Moon Icon */}
      <MoonIcon className={cn(
        getIconSize(),
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'transition-all duration-500 ease-in-out',
        isDark
          ? 'rotate-0 scale-100 opacity-100'
          : '-rotate-90 scale-0 opacity-0',
        'text-slate-700 dark:text-slate-200'
      )} />

      {/* Glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300',
        'group-hover:opacity-20',
        isDark
          ? 'bg-gradient-to-r from-blue-400 to-purple-400'
          : 'bg-gradient-to-r from-amber-400 to-orange-400'
      )} />
    </button>
  );
};

export default ThemeToggle;