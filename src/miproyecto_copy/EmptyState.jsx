// src/components/ui/EmptyState.jsx
import React from 'react';
import {
  ExclamationCircleIcon,
  FilmIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const EmptyState = ({
  icon = 'default',
  title = 'No hay elementos',
  description = 'No se encontraron elementos para mostrar',
  action = null,
  className = ''
}) => {
  // Iconos predefinidos
  const icons = {
    default: ExclamationCircleIcon,
    movies: FilmIcon,
    search: MagnifyingGlassIcon,
    calendar: CalendarIcon
  };

  const IconComponent = icons[icon] || icons.default;

  return (
    <div className={`text-center py-12 ${className}`}>
      <IconComponent className="mx-auto h-16 w-16 text-gray-500 mb-4" />

      <h3 className="text-xl font-medium text-gray-300 mb-2">
        {title}
      </h3>

      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;