// src/components/cars/CarCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

import { GlassCard, Badge, GlassButton } from '../ui/GlassComponents';

const CarCard = ({ car, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCarAge = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  return (
    <GlassCard className="p-6 relative">
      {/* Header con imagen y badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Imagen del auto */}
          {car.photo_url ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 shadow-lg ring-2 ring-white/20 dark:ring-white/10">
              <img
                src={car.photo_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-3 shadow-lg">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {car.brand?.[0]}{car.model?.[0]}
              </span>
            </div>
          )}

          {/* Información principal */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
              {car.year} • {car.color}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-white/30 dark:bg-white/10 px-2 py-1 rounded-lg inline-block">
              {car.plate_number}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-2 ml-4">
          {car.is_vintage && (
            <Badge variant="vintage">
              Clásico
            </Badge>
          )}
          {car.is_new && (
            <Badge variant="new">
              Nuevo
            </Badge>
          )}
          <Badge>
            {getCarAge(car.year)} año{getCarAge(car.year) !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="border-t border-white/20 dark:border-white/10 pt-4 mt-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-white/20 dark:bg-white/5 p-3 rounded-lg">
              <TagIcon className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">ID:</span>
              <span className="ml-1 font-mono">{car.car_id}</span>
            </div>

            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-white/20 dark:bg-white/5 p-3 rounded-lg">
              <CalendarIcon className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-medium">Registrado:</span>
              <span className="ml-1">{formatDate(car.created_at)}</span>
            </div>
          </div>

          {car.updated_at && car.updated_at !== car.created_at && (
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-white/20 dark:bg-white/5 p-3 rounded-lg">
              <PencilIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span className="font-medium">Actualizado:</span>
              <span className="ml-1">{formatDate(car.updated_at)}</span>
            </div>
          )}

          {car.photo_url && (
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 bg-white/20 dark:bg-white/5 p-3 rounded-lg">
              <EyeIcon className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="font-medium">Imagen disponible</span>
            </div>
          )}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20 dark:border-white/10">
        {/* Botón de detalles */}
        <GlassButton
          onClick={() => setShowDetails(!showDetails)}
          variant="secondary"
          className={`group/btn transition-all duration-300 px-3 py-2 ${
            showDetails ? 'mr-auto' : ''
          }`}
        >
          {showDetails ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
              <span className="font-semibold text-sm leading-tight">
                Menos<br />detalles
              </span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
              <span className="font-semibold">Más detalles</span>
            </>
          )}
        </GlassButton>

        {/* Botones de acción */}
        <div className="flex space-x-2">
          <GlassButton
            onClick={() => onEdit(car)}
            variant="primary"
            className="group/edit"
          >
            <PencilIcon className="h-4 w-4 mr-1 transition-transform group-hover/edit:scale-110" />
            <span className="font-semibold">Editar</span>
          </GlassButton>

          <GlassButton
            onClick={() => onDelete(car.car_id)}
            variant="danger"
            className="group/delete"
          >
            <TrashIcon className="h-4 w-4 mr-1 transition-transform group-hover/delete:scale-110" />
            <span className="font-semibold">Eliminar</span>
          </GlassButton>
        </div>
      </div>

      {/* Línea decorativa con gradiente */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
    </GlassCard>
  );
};

// PropTypes para validación
CarCard.propTypes = {
  car: PropTypes.shape({
    car_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    plate_number: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    photo_url: PropTypes.string,
    is_vintage: PropTypes.bool,
    is_new: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CarCard;