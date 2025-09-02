// // src/components/cinema/MovieCard.jsx
// import { Link } from 'react-router-dom';
// import { GlassCard, PremiumButton, ShimmerEffect } from '../ui';
//
// const MovieCard = ({ movie, showReleaseDate = false }) => {
//   return (
//     <div className="group">
//       <ShimmerEffect>
//         <GlassCard variant="premium" className="overflow-hidden premium-card">
//           <div className="aspect-[2/3] relative">
//             {movie.status && (
//               <div className="absolute top-3 left-3 z-10">
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                   movie.status === 'ESTRENO'
//                     ? 'bg-red-600 text-white'
//                     : movie.status === 'PREVENTA'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-yellow-600 text-white'
//                 }`}>
//                   {movie.status}
//                 </span>
//               </div>
//             )}
//
//             <img
//               src={movie.posterImage}
//               alt={movie.title}
//               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//             />
//
//             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//
//             <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
//               <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
//               <p className="text-white/80 text-xs mb-2">{movie.genre}</p>
//               <div className="flex items-center justify-between text-xs text-white/70 mb-3">
//                 <span>{movie.duration}</span>
//                 <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
//                   {movie.ageRating?.includes('años') ? movie.ageRating.split(' ').pop() : movie.ageRating}
//                 </span>
//               </div>
//
//               <PremiumButton
//                 variant="secondary"
//                 size="sm"
//                 className="w-full text-xs"
//                 asChild
//               >
//                 <Link to={`/movie/${movie.id}`}>
//                   Ver Detalles
//                 </Link>
//               </PremiumButton>
//             </div>
//           </div>
//
//           <div className="p-4">
//             <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
//             <p className="text-white/60 text-xs mb-2">{movie.originalTitle}</p>
//             <p className="text-white/80 text-xs mb-2">{movie.genre}</p>
//
//             {showReleaseDate && movie.releaseDate && (
//               <p className="text-orange-400 text-xs font-medium mb-2">
//                 Estreno: {movie.releaseDate}
//               </p>
//             )}
//
//             <div className="flex items-center justify-between text-xs">
//               <span className="text-white/70">{movie.duration}</span>
//               <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
//                 {movie.ageRating?.includes('años')
//                   ? movie.ageRating.match(/\d+/)?.[0] + '+'
//                   : movie.ageRating?.split(' ')[0] || 'General'
//                 }
//               </span>
//             </div>
//           </div>
//         </GlassCard>
//       </ShimmerEffect>
//     </div>
//   );
// };
//
// export { MovieCard };


// src/components/cinema/MovieCard.jsx - ACTUALIZADO PARA API REAL
import { Link } from 'react-router-dom';
import { GlassCard, PremiumButton, ShimmerEffect } from '../ui';
import { ClockIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline';

const MovieCard = ({ movie, showReleaseDate = false }) => {
  // Formatear duración
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Formatear precio
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Formatear rating
  const formatRating = (rating) => {
    const ratingMap = {
      'G': 'Todos los públicos',
      'PG': 'Mayores de 7 años',
      'PG-13': 'Mayores de 13 años',
      'R': 'Mayores de 17 años',
      'NC-17': 'Mayores de 18 años'
    };
    return ratingMap[rating] || rating;
  };

  // Formatear fecha de lanzamiento
  const formatReleaseDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="group">
      <ShimmerEffect>
        <GlassCard variant="premium" className="overflow-hidden premium-card">
          <div className="aspect-[2/3] relative">
            {/* Badge de estado */}
            {(movie.status || movie.is_presale) && (
              <div className="absolute top-3 left-3 z-10">
                {movie.is_presale && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-600 text-white mb-1 block">
                    PREVENTA
                  </span>
                )}
                {movie.status === 'coming_soon' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white block">
                    PRÓXIMAMENTE
                  </span>
                )}
                {movie.status === 'in_theaters' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white block">
                    ESTRENO
                  </span>
                )}
              </div>
            )}

            {/* IMAGEN USANDO POSTER_URL DEL BACKEND */}
            <img
              src={movie.poster_url || '/placeholder-movie.jpg'}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg';
              }}
            />

            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h3>
              <p className="text-white/80 text-xs mb-2">{movie.genre}</p>

              <div className="flex items-center justify-between text-xs text-white/70 mb-3">
                <span className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {formatDuration(movie.duration)}
                </span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {formatRating(movie.rating)}
                </span>
              </div>

              {/* Precio */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-bold text-sm">
                  {formatPrice(movie.price)}
                </span>
                {movie.director && (
                  <span className="text-white/60 text-xs truncate max-w-20">
                    {movie.director}
                  </span>
                )}
              </div>

              {/* Tickets disponibles */}
              {movie.available_tickets !== undefined && (
                <div className="flex items-center text-xs text-white/60">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  {movie.available_tickets} disponibles
                </div>
              )}

              {/* Fecha de lanzamiento si se requiere */}
              {showReleaseDate && movie.release_date && (
                <p className="text-white/60 text-xs mt-2">
                  Estreno: {formatReleaseDate(movie.release_date)}
                </p>
              )}

              {/* Botón de acción */}
              <div className="mt-3">
                <Link to={`/pelicula/${movie.id}`}>
                  <PremiumButton size="sm" className="w-full">
                    Ver detalles
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </ShimmerEffect>
    </div>
  );
};

export { MovieCard };