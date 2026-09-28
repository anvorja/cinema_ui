// Filas del tablero: una función por fila, con miniatura, datos en mono y estado.
import { Link } from 'react-router-dom';
import { transformMovieData, optimizeCloudinaryUrl } from '../../utils/movieUtils';

const tagFor = (m: any) => {
  if (m.isSoldOut && m.status === 'in_theaters') return { text: 'AGOTADO', cls: 'b-tag--alarm' };
  if (m.is_presale) return { text: 'PREVENTA', cls: 'b-tag--amber' };
  if (m.status === 'coming_soon') return { text: 'PRONTO', cls: '' };
  if (m.soldOutPercentage > 80) return { text: 'POCAS SILLAS', cls: 'b-tag--alarm' };
  return { text: 'ABIERTA', cls: 'b-tag--ok' };
};

const MovieRow = ({ movie, index }: { movie: any; index: number }) => {
  const tag = tagFor(movie);
  return (
    <li className="border-b border-[#2c2c30]">
      <Link
        to={`/movie/${movie.id}`}
        className="group grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-2 py-3 hover:bg-[#151517] sm:grid-cols-[40px_64px_minmax(0,1fr)_auto_auto] sm:px-4 sm:gap-x-6"
      >
        <span className="hidden font-data text-sm font-bold text-[#8f8b80] group-hover:text-[#f2b705] sm:block">
          {String(index + 1).padStart(2, '0')}
        </span>

        <img
          src={movie.poster_url ? optimizeCloudinaryUrl(movie.poster_url, 200) : '/placeholder-movie.jpg'}
          alt=""
          loading="lazy"
          className="h-[84px] w-14 border border-[#2c2c30] object-cover sm:h-24 sm:w-16"
          onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
        />

        <div className="min-w-0">
          <h3 className="truncate font-board text-[22px] font-bold leading-tight tracking-wide uppercase text-[#f4f1e8] group-hover:text-[#f2b705] sm:text-[28px]">
            {movie.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-[#8f8b80]">
            {[movie.status === 'coming_soon' ? `Estreno ${movie.release_date_short}` : null, movie.genre, movie.duration_formatted !== 'N/A' ? movie.duration_formatted : null, movie.ageRating].filter(Boolean).join(' · ')}
          </p>
          <span className={`b-tag mt-2 sm:hidden ${tag.cls}`}>{tag.text}</span>
        </div>

        <span className={`b-tag hidden sm:inline-flex ${tag.cls}`}>{tag.text}</span>

        <span className="text-right font-data text-sm font-bold text-[#f4f1e8] sm:w-28 sm:text-base">
          {movie.price ? <><span className="block text-[10px] font-normal uppercase text-[#8f8b80] sm:inline sm:mr-2">desde</span>{movie.price_formatted}</> : ''}
        </span>
      </Link>
    </li>
  );
};

const MovieGrid = ({ movies = [] }: { movies?: any[]; className?: string; showStats?: boolean; showDetailsButton?: boolean }) => {
  const rows = movies.map(transformMovieData).filter(Boolean);

  if (rows.length === 0) {
    return <p className="py-12 text-center font-data text-sm text-[#8f8b80]">No hay películas disponibles</p>;
  }

  return (
    <ol className="border-t border-[#46464c]">
      {rows.map((movie, i) => (
        <MovieRow key={movie.id} movie={movie} index={i} />
      ))}
    </ol>
  );
};

export { MovieGrid };
