// src/components/cinema/MovieGrid.jsx
import { Link } from 'react-router-dom';
import { ClockIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton } from '../common';
import { transformMovieData } from '../../utils/movieUtils';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

const MovieGrid = ({ movies = [], className = '', showStats = false, showDetailsButton = true }) => {
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
    <div className={`grid gap-3 sm:gap-6 ${className || 'grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'}`}>
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
    <GlassCard className="group overflow-hidden hover:scale-[1.02] transition-all duration-300">
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
      <div className="aspect-[2/3] relative">
        {/* Badge de estado */}
        {statusBadge && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className={`backdrop-blur-sm font-bold tracking-wide text-[10px] ${statusBadge.className}`}>
              {statusBadge.text}
            </Badge>
          </div>
        )}

        {/* Indicador de disponibilidad */}
        <div className="absolute top-2 right-2 z-10">
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

        <img
          src={movie.poster_url || movie.images?.poster || '/placeholder-movie.jpg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = movie.backdrop_url || movie.images?.backdrop || '/placeholder-movie.jpg';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info debajo de la imagen */}
      <div className="p-3">
        {!showDetailsButton ? (
          /* ── Vista simplificada (Home mobile / sin botón) ── */
          <>
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1">
              {movie.title}
            </h3>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-white/50 text-xs line-clamp-1 mb-1.5">
                {movie.original_title}
              </p>
            )}
            {movie.ageRating && (
              <span className="inline-block bg-white/10 text-white/70 border border-white/15 rounded text-[10px] px-1.5 py-0.5 mb-1.5">
                {movie.ageRating}
              </span>
            )}
            {movie.release_date && (
              <p className="text-white/55 text-xs">
                <span className="font-medium text-white/70">Estreno:</span> {movie.release_date_short}
              </p>
            )}
          </>
        ) : (
          /* ── Vista completa (Cartelera / con botón) ── */
          <>
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-white/70 text-xs mb-2">
              {movie.genre || 'Sin género'} • {movie.duration_formatted}
            </p>

            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {movie.duration_formatted}
              </span>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-medium">
                {movie.ageRating}
              </span>
            </div>

            {movie.price && (
              <p className="text-green-400 font-bold text-sm mb-1">
                {movie.price_formatted}
              </p>
            )}

            {movie.available_tickets !== undefined && (
              <div className="flex items-center text-xs text-white/60 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                {movie.available_tickets} disponibles
              </div>
            )}

            {movie.release_date && (
              <p className="text-white/60 text-xs mb-2">
                Estreno: {movie.release_date_short}
              </p>
            )}

            <div className="mt-2">
              <Link to={`/movie/${movie.id}`}>
                <PremiumButton size="sm" className="w-full">
                  Ver detalles
                </PremiumButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const MovieGridSkeleton = ({ count = 8, className = '' }) => {
  return (
    <div className={`grid gap-3 sm:gap-6 ${className || 'grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[2/3] w-full rounded-xl bg-white/[0.07]" />
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
