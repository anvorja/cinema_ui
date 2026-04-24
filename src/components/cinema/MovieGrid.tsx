// src/components/cinema/MovieGrid.jsx
import { Link } from 'react-router-dom';
import { ClockIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton } from '../common';
import { transformMovieData } from '../../utils/movieUtils';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';

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
    <div className={`grid gap-6 ${className || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
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
        <Link to={`/movie/${movie.id}`} className="block">
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

const MovieCardContent = ({ movie, statusBadge, showStats, showDetailsButton = true }: { movie: any; statusBadge: any; showStats: any; showDetailsButton?: any }) => {
  return (
    <>
      <div className="aspect-[3/4] relative">
        {/* Badge de estado */}
        {statusBadge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`backdrop-blur-sm font-bold tracking-wide text-[10px] ${statusBadge.className}`}>
              {statusBadge.text}
            </Badge>
          </div>
        )}

        {/* Indicador de disponibilidad */}
        <div className="absolute top-3 right-3 z-10">
          {movie.isSoldOut ? (
            <Badge className="bg-red-500/20 text-red-300 border-red-500/40 backdrop-blur-sm font-bold text-[10px]">
              AGOTADO
            </Badge>
          ) : movie.soldOutPercentage > 80 ? (
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 backdrop-blur-sm font-bold text-[10px]">
              POCAS
            </Badge>
          ) : null}
        </div>

        {/* Imagen usando poster_url del backend */}
        <img
          src={movie.poster_url || movie.images?.poster || '/placeholder-movie.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback en caso de error de carga
            (e.target as HTMLImageElement).src = movie.backdrop_url || movie.images?.backdrop || '/placeholder-movie.jpg';
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
              <Badge variant="outline" className="text-white/70 border-white/20 text-[10px] font-semibold">
                {movie.ageRating}
              </Badge>
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

        {/* Barra de disponibilidad con Progress de Shadcn */}
        {!showDetailsButton && movie.max_capacity > 0 && (() => {
          const pct = Math.round((movie.available_tickets / movie.max_capacity) * 100);
          const color = pct > 50 ? '[&>div]:bg-emerald-500' : pct > 20 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500';
          return (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1.5">
                <span>Disponibilidad</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className={`h-1.5 bg-white/10 ${color}`} />
            </div>
          );
        })()}
      </div>
    </>
  );
};

// Componente para grid con loading skeletons — usa Skeleton de Shadcn
export const MovieGridSkeleton = ({ count = 8, className = '' }) => {
  return (
    <div className={`grid gap-6 ${className || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[3/4] w-full rounded-xl bg-white/[0.07]" />
          <div className="px-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-md bg-white/[0.07]" />
            <Skeleton className="h-3 w-1/2 rounded-md bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export { MovieGrid, MovieCard };