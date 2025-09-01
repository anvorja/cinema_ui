// src/components/cinema/MovieCard.jsx
import { Link } from 'react-router-dom';
import { GlassCard, PremiumButton, ShimmerEffect } from '../ui';

const MovieCard = ({ movie, showReleaseDate = false }) => {
  return (
    <div className="group">
      <ShimmerEffect>
        <GlassCard variant="premium" className="overflow-hidden premium-card">
          <div className="aspect-[2/3] relative">
            {movie.status && (
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  movie.status === 'ESTRENO' 
                    ? 'bg-red-600 text-white' 
                    : movie.status === 'PREVENTA'
                    ? 'bg-blue-600 text-white'
                    : 'bg-yellow-600 text-white'
                }`}>
                  {movie.status}
                </span>
              </div>
            )}

            <img
              src={movie.posterImage}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
              <p className="text-white/80 text-xs mb-2">{movie.genre}</p>
              <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                <span>{movie.duration}</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {movie.ageRating?.includes('años') ? movie.ageRating.split(' ').pop() : movie.ageRating}
                </span>
              </div>

              <PremiumButton
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <Link to={`/movie/${movie.id}`}>
                  Ver Detalles
                </Link>
              </PremiumButton>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
            <p className="text-white/60 text-xs mb-2">{movie.originalTitle}</p>
            <p className="text-white/80 text-xs mb-2">{movie.genre}</p>

            {showReleaseDate && movie.releaseDate && (
              <p className="text-orange-400 text-xs font-medium mb-2">
                Estreno: {movie.releaseDate}
              </p>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">{movie.duration}</span>
              <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                {movie.ageRating?.includes('años')
                  ? movie.ageRating.match(/\d+/)?.[0] + '+'
                  : movie.ageRating?.split(' ')[0] || 'General'
                }
              </span>
            </div>
          </div>
        </GlassCard>
      </ShimmerEffect>
    </div>
  );
};

export { MovieCard };
