// src/components/admin/movies/MovieCard.jsx
import React from 'react';
import { Edit2, ToggleLeft, ToggleRight, Image as ImageIcon, Clock, Users, DollarSign } from 'lucide-react';

const MovieCard = ({ movie, onEdit, onToggle }) => {
  const handleToggle = () => {
    onToggle(movie.id, movie.is_active);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:bg-gray-600">
      <div className="flex items-start space-x-4">
        {/* Imagen de la película */}
        <div className="flex-shrink-0">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-24 w-24 md:h-32 md:w-32 object-cover rounded-lg"
            />
          ) : (
            <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Información de la película */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg mb-1 truncate">
                {movie.title}
              </h3>

              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                <span className="bg-gray-800 px-2 py-1 rounded">
                  {movie.genre}
                </span>
                <span className="bg-gray-800 px-2 py-1 rounded">
                  {movie.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-400 mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {movie.duration} min
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPrice(movie.price)}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {movie.available_tickets}/{movie.max_capacity}
                </div>
              </div>

              {movie.director && (
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-medium">Director:</span> {movie.director}
                </p>
              )}

              {movie.country && (
                <p className="text-sm text-gray-400 mb-2">
                  <span className="font-medium">País:</span> {movie.country}
                </p>
              )}

              <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                {movie.description}
              </p>

              {/* Estado */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  movie.is_active 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-red-900 text-red-200'
                }`}>
                  {movie.is_active ? 'Activa' : 'Inactiva'}
                </span>

                {movie.available_tickets === 0 && movie.is_active && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                    Sin tickets
                  </span>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onEdit(movie)}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-gray-800 transition-colors"
                title="Editar película"
              >
                <Edit2 className="h-5 w-5" />
              </button>

              <button
                onClick={handleToggle}
                className={`p-2 rounded-md transition-colors ${
                  movie.is_active 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                    : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
                }`}
                title={movie.is_active ? 'Deshabilitar película' : 'Habilitar película'}
              >
                {movie.is_active ? (
                  <ToggleRight className="h-5 w-5" />
                ) : (
                  <ToggleLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;