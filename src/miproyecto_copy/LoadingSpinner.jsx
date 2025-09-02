// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  className = '',
  text = null,
  centered = false
}) => {
  // Tamaños predefinidos
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  // Colores predefinidos
  const colors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const spinnerClasses = `animate-spin rounded-full border-2 border-t-transparent ${sizes[size]} ${colors[color]} ${className}`;

  const containerClasses = `flex items-center ${centered ? 'justify-center' : ''} ${text ? 'space-x-3' : ''}`;

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {text && (
        <span className="text-gray-300 font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;