// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  className = '',
  text = null,
  message = null,
  centered = false,
  ..._rest
}: { size?: string; color?: string; className?: string; text?: any; message?: any; centered?: boolean; [key: string]: any }) => {
  // Texto: acepta `text` o `message` (dos llamadores usaban nombres distintos
  // y el prop no reconocido se descartaba en silencio — nunca se mostraba).
  const displayText = text ?? message;

  // Tamaños predefinidos — incluye alias 'large'/'small' porque algún
  // llamador los usaba y, al no existir esas claves, el spinner quedaba
  // sin ninguna clase de tamaño (invisible/diminuto).
  const sizes = {
    sm: 'h-4 w-4',
    small: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    large: 'h-8 w-8',
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

  const spinnerClasses = `animate-spin rounded-full border-2 border-t-transparent ${sizes[size] || sizes.md} ${colors[color]} ${className}`;

  const containerClasses = `flex items-center ${centered ? 'justify-center' : ''} ${displayText ? 'space-x-3' : ''}`;

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {displayText && (
        <span className="text-gray-300 font-medium">
          {displayText}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;