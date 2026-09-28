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

const MovieTile = ({ movie }: { movie: any }) => {
  const tag = tagFor(movie);
  return (
    <li>
      <Link to={`/movie/${movie.id}`} className="group block h-full border border-[#2c2c30] bg-[#151517] hover:border-[#f2b705]">
        <div className="relative">
          <img
            src={movie.poster_url ? optimizeCloudinaryUrl(movie.poster_url, 400) : '/placeholder-movie.jpg'}
            alt={`Póster de ${movie.title}`}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
          />
          <span className={`b-tag absolute left-2 top-2 ${tag.cls === 'b-tag--amber' ? '' : '!bg-[#0c0c0d]'} ${tag.cls}`}>{tag.text}</span>
        </div>
        <div className="border-t border-[#2c2c30] p-3">
          <h3 className="line-clamp-2 font-board text-[22px] font-bold leading-[1.05] tracking-wide uppercase text-[#f4f1e8] group-hover:text-[#f2b705]">
            {movie.title}
          </h3>
          <p className="mt-1 truncate text-sm text-[#8f8b80]">
            {[movie.genre, movie.duration_formatted !== 'N/A' ? movie.duration_formatted : null].filter(Boolean).join(' · ')}
          </p>
          <p className="mt-2 font-data text-sm font-bold text-[#f4f1e8]">
            {movie.status === 'coming_soon' && movie.release_date_short
              ? <span className="text-[#c3bfb2]">Estreno {movie.release_date_short}</span>
              : movie.price ? <><span className="mr-1.5 text-[10px] font-normal uppercase text-[#8f8b80]">desde</span>{movie.price_formatted}</> : null}
          </p>
        </div>
      </Link>
    </li>
  );
};

const MovieGrid = ({ movies = [], view = 'lista' }: { movies?: any[]; view?: 'lista' | 'cuadricula'; className?: string; showStats?: boolean; showDetailsButton?: boolean }) => {
  const rows = movies.map(transformMovieData).filter(Boolean);

  if (rows.length === 0) {
    return <p className="py-12 text-center font-data text-sm text-[#8f8b80]">No hay películas disponibles</p>;
  }

  if (view === 'cuadricula') {
    return (
      <ul className="grid grid-cols-2 gap-3 border-t border-[#46464c] pt-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {rows.map((movie) => <MovieTile key={movie.id} movie={movie} />)}
      </ul>
    );
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
