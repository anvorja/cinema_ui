// src/components/cinema/MovieGrid.jsx
import { Link } from 'react-router-dom';
import { ClockIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton } from '../ui';
import { transformMovieData } from '../../utils/movieUtils';

const MovieGrid = ({ movies = [], className = '', showStats = false, showDetailsButton = true }) => {
  // Transformar datos del backend
  const transformedMovies = movies.map(transformMovieData).filter(Boolean);

  if (!transformedMovies || transformedMovies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 mb-4">
          <TicketIcon className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">No hay películas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${className || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
      {transformedMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          showStats={showStats}
          showDetailsButton={showDetailsButton}
        />
      ))}
    </div>
  );
};

const MovieCard = ({ movie, showStats = false, showDetailsButton = true }) => {
  const statusBadge = movie.statusBadge;

  return (
    <GlassCard className="group overflow-hidden hover:scale-105 transition-all duration-300">
      {/* Solo envolver con Link si NO hay botón de detalles */}
      {!showDetailsButton ? (
        <Link to={`/pelicula/${movie.id}`} className="block">
          <MovieCardContent movie={movie} statusBadge={statusBadge} showStats={showStats} />
        </Link>
      ) : (
        <MovieCardContent
          movie={movie}
          statusBadge={statusBadge}
          showStats={showStats}
          showDetailsButton={showDetailsButton}
        />
      )}
    </GlassCard>
  );
};

const MovieCardContent = ({ movie, statusBadge, showStats, showDetailsButton }) => {
  return (
    <>
      <div className="aspect-[2/3] relative">
        {/* Badge de estado */}
        {statusBadge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.className}`}>
              {statusBadge.text}
            </span>
          </div>
        )}

        {/* Indicador de disponibilidad */}
        <div className="absolute top-3 right-3 z-10">
          {movie.isSoldOut ? (
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-bold">
              AGOTADO
            </span>
          ) : movie.soldOutPercentage > 80 ? (
            <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded-full font-bold">
              POCAS
            </span>
          ) : null}
        </div>

        {/* Imagen usando poster_url del backend */}
        <img
          src={movie.poster_url || movie.images?.poster || '/placeholder-movie.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback en caso de error de carga
            e.target.src = movie.backdrop_url || movie.images?.backdrop || '/placeholder-movie.jpg';
          }}
        />

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Información que aparece en hover SOLO si NO hay botón de detalles */}
        {!showDetailsButton && (
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
              {movie.title}
            </h3>

            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-white/70 text-xs mb-2 line-clamp-1">
                {movie.original_title}
              </p>
            )}

            <p className="text-white/80 text-xs mb-2 line-clamp-1">
              {movie.genre || 'Sin género'}
            </p>

            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {movie.duration_formatted}
              </span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                {movie.ageRating}
              </span>
            </div>

            {/* Información adicional */}
            <div className="space-y-1">
              {movie.price && (
                <div className="flex items-center text-green-400 text-xs">
                  <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                  <span>{movie.price_formatted}</span>
                </div>
              )}

              {showStats && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">
                    Disponibles: {movie.available_tickets || 0}
                  </span>
                  {movie.max_capacity && (
                    <span className="text-white/60">
                      Total: {movie.max_capacity}
                    </span>
                  )}
                </div>
              )}

              {movie.release_date && (
                <div className="text-white/60 text-xs">
                  Estreno: {movie.release_date_short}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Información siempre visible */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-white/70 text-xs">
          {movie.genre || 'Sin género'} • {movie.duration_formatted}
        </p>

        {/* Información adicional cuando hay botón de detalles */}
        {showDetailsButton && (
          <>
            <div className="flex items-center justify-between text-xs text-white/60 mt-2">
              <span className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {movie.duration_formatted}
              </span>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                {movie.ageRating}
              </span>
            </div>

            {/* Precio */}
            {movie.price && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-400 font-bold text-sm">
                  {movie.price_formatted}
                </span>
              </div>
            )}

            {/* Tickets disponibles */}
            {movie.available_tickets !== undefined && (
              <div className="flex items-center text-xs text-white/60 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                {movie.available_tickets} disponibles
              </div>
            )}

            {/* Fecha de lanzamiento */}
            {movie.release_date && (
              <p className="text-white/60 text-xs mt-2">
                Estreno: {movie.release_date_short}
              </p>
            )}

            {/* BOTÓN "VER DETALLES" - EL QUE FALTABA */}
            <div className="mt-3">
              <Link to={`/movie/${movie.id}`}>
                <PremiumButton size="sm" className="w-full">
                  Ver detalles
                </PremiumButton>
              </Link>
            </div>
          </>
        )}

        {/* Barra de disponibilidad SOLO si NO hay botón de detalles */}
        {!showDetailsButton && movie.max_capacity > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Disponibilidad</span>
              <span>{Math.round((movie.available_tickets / movie.max_capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  movie.available_tickets / movie.max_capacity > 0.5 
                    ? 'bg-green-500' 
                    : movie.available_tickets / movie.max_capacity > 0.2 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${(movie.available_tickets / movie.max_capacity) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Componente para grid con loading skeletons
export const MovieGridSkeleton = ({ count = 8, className = '' }) => {
  return (
    <div className={`grid gap-6 ${className || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-white/10 rounded-lg mb-3"></div>
          <div className="px-4 pb-4 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { MovieGrid, MovieCard };