// src/pages/Cartelera.jsx - PÁGINA ACTUALIZADA CON API REAL
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { GlassCard, GlassInput } from '../components/ui';
import { useMovies } from '../hooks/useMovies';
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";

const Cartelera = () => {
  // Estados locales para filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    priceRange: '',
    format: ''
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Géneros disponibles (pueden venir de la API también)
  const genres = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción',
    'Romance', 'Thriller', 'Animación', 'Documental'
  ];

  // Manejar búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await search(searchQuery, filters);
    } else {
      // Si no hay query, recargar todas las películas
      await fetchMovies({ skip: 0, replace: true });
    }
  };

  // Manejar cambio de filtros
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (searchQuery) {
      search(searchQuery, filters);
    } else {
      fetchMovies({ skip: 0, replace: true, ...filters });
    }
  }, [filters]);

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

  // Formatear duración
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (!price) return 'Precio no disponible';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Componente para tarjeta de película
  const MovieCard = ({ movie }) => {
    return (
      <GlassCard className="group hover:scale-105 transition-all duration-300 cursor-pointer">
        <Link to={`/movie/${movie.id}`} className="block">
          {/* Imagen de la película */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-4">
            <img
              src={movie.poster_url || '/placeholder-movie.jpg'}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg';
              }}
            />

            {/* Badge de estado */}
            <div className="absolute top-2 right-2">
              {movie.is_presale && (
                <span className="px-2 py-1 text-xs font-semibold bg-yellow-500 text-black rounded-full">
                  PREVENTA
                </span>
              )}
              {movie.status === 'coming_soon' && (
                <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full">
                  PRÓXIMAMENTE
                </span>
              )}
            </div>

            {/* Overlay con información adicional */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-center text-white p-4">
                <p className="text-sm mb-2">Ver detalles</p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  {movie.rating && (
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      {movie.rating}
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatDuration(movie.duration)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de la película */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
              {movie.title}
            </h3>

            {/* Género y duración */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>{movie.genre || 'Género no disponible'}</span>
              <span>{formatDuration(movie.duration)}</span>
            </div>

            {/* Director */}
            {movie.director && (
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-medium">Director:</span> {movie.director}
              </p>
            )}

            {/* Precio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-5 h-5 text-green-400 mr-1" />
                <span className="font-bold text-green-400">
                  {formatPrice(movie.price)}
                </span>
              </div>

              {/* Disponibilidad */}
              <div className="text-xs">
                {movie.available_tickets > 0 ? (
                  <span className="text-green-400">
                    {movie.available_tickets} disponibles
                  </span>
                ) : (
                  <span className="text-red-400">Agotado</span>
                )}
              </div>
            </div>

            {/* Fecha de estreno para próximamente */}
            {movie.release_date && movie.status === 'coming_soon' && (
              <p className="text-xs text-blue-400 mt-2">
                Estreno: {new Date(movie.release_date).toLocaleDateString('es-CO')}
              </p>
            )}
          </div>
        </Link>
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Cartelera
          </h1>
        </div>

        {/*/!* Barra de búsqueda y filtros *!/*/}
        {/*<div className="mb-8">*/}
        {/*  <GlassCard className="p-6">*/}
        {/*    /!* Búsqueda *!/*/}
        {/*    <form onSubmit={handleSearch} className="mb-4">*/}
        {/*      <div className="flex gap-4">*/}
        {/*        <div className="flex-1">*/}
        {/*          <GlassInput*/}
        {/*            type="text"*/}
        {/*            placeholder="Buscar películas por título, director, género..."*/}
        {/*            value={searchQuery}*/}
        {/*            onChange={(e) => setSearchQuery(e.target.value)}*/}
        {/*            className="w-full"*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*        <button*/}
        {/*          type="submit"*/}
        {/*          disabled={loading}*/}
        {/*          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"*/}
        {/*        >*/}
        {/*          <MagnifyingGlassIcon className="w-5 h-5" />*/}
        {/*          <span>Buscar</span>*/}
        {/*        </button>*/}
        {/*        <button*/}
        {/*          type="button"*/}
        {/*          onClick={() => setShowFilters(!showFilters)}*/}
        {/*          className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"*/}
        {/*        >*/}
        {/*          <FunnelIcon className="w-5 h-5" />*/}
        {/*          <span>Filtros</span>*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </form>*/}

        {/*    /!* Panel de filtros *!/*/}
        {/*    {showFilters && (*/}
        {/*      <div className="border-t border-white/20 pt-4">*/}
        {/*        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">*/}
        {/*          /!* Filtro por género *!/*/}
        {/*          <div>*/}
        {/*            <label className="block text-sm font-medium text-gray-300 mb-2">*/}
        {/*              Género*/}
        {/*            </label>*/}
        {/*            <select*/}
        {/*              value={filters.genre}*/}
        {/*              onChange={(e) => handleFilterChange('genre', e.target.value)}*/}
        {/*              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
        {/*            >*/}
        {/*              <option value="">Todos los géneros</option>*/}
        {/*              {genres.map((genre) => (*/}
        {/*                <option key={genre} value={genre} className="bg-gray-800">*/}
        {/*                  {genre}*/}
        {/*                </option>*/}
        {/*              ))}*/}
        {/*            </select>*/}
        {/*          </div>*/}

        {/*          /!* Filtro por clasificación *!/*/}
        {/*          <div>*/}
        {/*            <label className="block text-sm font-medium text-gray-300 mb-2">*/}
        {/*              Clasificación*/}
        {/*            </label>*/}
        {/*            <select*/}
        {/*              value={filters.rating}*/}
        {/*              onChange={(e) => handleFilterChange('rating', e.target.value)}*/}
        {/*              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
        {/*            >*/}
        {/*              <option value="">Todas las edades</option>*/}
        {/*              <option value="G" className="bg-gray-800">General (G)</option>*/}
        {/*              <option value="PG" className="bg-gray-800">Para toda la familia (PG)</option>*/}
        {/*              <option value="PG-13" className="bg-gray-800">Mayores de 13 (PG-13)</option>*/}
        {/*              <option value="R" className="bg-gray-800">Restringido (R)</option>*/}
        {/*            </select>*/}
        {/*          </div>*/}

        {/*          /!* Filtro por rango de precio *!/*/}
        {/*          <div>*/}
        {/*            <label className="block text-sm font-medium text-gray-300 mb-2">*/}
        {/*              Precio*/}
        {/*            </label>*/}
        {/*            <select*/}
        {/*              value={filters.priceRange}*/}
        {/*              onChange={(e) => handleFilterChange('priceRange', e.target.value)}*/}
        {/*              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
        {/*            >*/}
        {/*              <option value="">Todos los precios</option>*/}
        {/*              <option value="0-15000" className="bg-gray-800">Hasta $15,000</option>*/}
        {/*              <option value="15000-25000" className="bg-gray-800">$15,000 - $25,000</option>*/}
        {/*              <option value="25000-35000" className="bg-gray-800">$25,000 - $35,000</option>*/}
        {/*              <option value="35000+" className="bg-gray-800">Más de $35,000</option>*/}
        {/*            </select>*/}
        {/*          </div>*/}

        {/*          /!* Filtro por formato *!/*/}
        {/*          <div>*/}
        {/*            <label className="block text-sm font-medium text-gray-300 mb-2">*/}
        {/*              Formato*/}
        {/*            </label>*/}
        {/*            <select*/}
        {/*              value={filters.format}*/}
        {/*              onChange={(e) => handleFilterChange('format', e.target.value)}*/}
        {/*              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
        {/*            >*/}
        {/*              <option value="">Todos los formatos</option>*/}
        {/*              <option value="2D" className="bg-gray-800">2D</option>*/}
        {/*              <option value="3D" className="bg-gray-800">3D</option>*/}
        {/*              <option value="IMAX" className="bg-gray-800">IMAX</option>*/}
        {/*              <option value="4DX" className="bg-gray-800">4DX</option>*/}
        {/*            </select>*/}
        {/*          </div>*/}
        {/*        </div>*/}

        {/*        /!* Botones de acción *!/*/}
        {/*        <div className="flex space-x-4">*/}
        {/*          <button*/}
        {/*            onClick={clearFilters}*/}
        {/*            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"*/}
        {/*          >*/}
        {/*            Limpiar filtros*/}
        {/*          </button>*/}
        {/*          <button*/}
        {/*            onClick={() => setShowFilters(false)}*/}
        {/*            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"*/}
        {/*          >*/}
        {/*            Cerrar*/}
        {/*          </button>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*  </GlassCard>*/}
        {/*</div>*/}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
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
                <p>Se muestran todas las películas disponibles ({movies.length} total)</p>
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