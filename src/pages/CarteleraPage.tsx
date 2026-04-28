// src/pages/Cartelera.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { GlassCard, GlassInput } from '../components/common';
import { useMovies } from '../hooks/useMovies';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Cartelera = () => {
  // Estados locales para filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    priceRange: '',
    format: ''
  });
  // Hook personalizado para gestionar películas
  const {
    movies,
    loading,
    error,
    fetchMovies,
    loadMore,
    refresh,
    search,
    isEmpty,
    hasError,
    canLoadMore
  } = useMovies({
    autoFetch: true,
    initialLimit: 12,
    filters: filters
  });

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (searchQuery) {
      search(searchQuery, filters);
    } else {
      fetchMovies({ skip: 0, replace: true, ...filters });
    }
  }, [filters, searchQuery, search, fetchMovies]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      genre: '',
      rating: '',
      priceRange: '',
      format: ''
    });
    refresh();
  };

  // Componente para tarjeta de película
  const MovieCard = ({ movie }) => {
    const ageRating = movie.age_rating || movie.rating_label || null;
    const releaseDate = movie.release_date
      ? new Date(movie.release_date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    return (
      <GlassCard className="group hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
        <Link to={`/movie/${movie.id}`} className="block">
          {/* Imagen */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={movie.poster_url || '/placeholder-movie.jpg'}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-movie.jpg';
              }}
            />
            {/* Badges */}
            <div className="absolute top-2 left-2">
              {movie.is_presale && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500 text-black rounded">
                  PREVENTA
                </span>
              )}
              {movie.status === 'coming_soon' && !movie.is_presale && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded">
                  PRONTO
                </span>
              )}
            </div>
          </div>

          {/* Info simplificada */}
          <div className="p-3">
            <h3 className="font-bold text-sm text-white line-clamp-2 mb-1">
              {movie.title}
            </h3>
            {ageRating && (
              <span className="inline-block bg-white/10 text-white/70 border border-white/15 rounded text-[10px] px-1.5 py-0.5 mb-1.5">
                {ageRating}
              </span>
            )}
            {releaseDate && (
              <p className="text-white/55 text-xs">
                <span className="font-medium text-white/70">Estreno:</span> {releaseDate}
              </p>
            )}
          </div>
        </Link>
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Indicadores de estado */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-gray-400">
              Resultados para: <span className="text-white font-medium">"{searchQuery}"</span>
              {movies.length > 0 && (
                <span className="ml-2">({movies.length} películas encontradas)</span>
              )}
            </p>
          </div>
        )}

        {/* Estados de carga y error */}
        {loading && isEmpty && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-gray-400">Cargando películas...</span>
          </div>
        )}

        {hasError && (
          <ErrorMessage
            title="Error al cargar películas"
            message={error}
            onRetry={refresh}
            className="mb-8"
          />
        )}

        {/* Mensaje cuando no hay películas */}
        {isEmpty && !loading && !hasError && (
          <EmptyState
            icon="movies"
            title="No se encontraron películas"
            description={
              searchQuery || Object.values(filters).some(f => f)
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'No hay películas disponibles en este momento'
            }
            action={
              (searchQuery || Object.values(filters).some(f => f)) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Ver todas las películas
                </button>
              )
            }
          />
        )}

        {/* Grid de películas */}
        {!isEmpty && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Botón cargar más */}
            {canLoadMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Cargando...</span>
                    </>
                  ) : (
                    <>
                      <span>Cargar más películas</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Info de paginación */}
            {!canLoadMore && movies.length > 12 && (
              <div className="text-center text-gray-500">
                <p>Disponibles ({movies.length} películas)</p>
              </div>
            )}
          </>
        )}

        {/* Botón de actualizar */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100"
            title="Actualizar cartelera"
          >
            <ArrowPathIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cartelera;