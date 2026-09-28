// Héroe de la home: el tablero anuncia la próxima salida y lista las demás.
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play } from 'lucide-react';
import FlapText from '../board/FlapText';
import { useMovieShowtimes } from '../../hooks/useMovieShowtimes';
import { optimizeCloudinaryUrl } from '../../utils/movieUtils';

const pad = (n: number) => String(n).padStart(2, '0');

const statusOf = (m: any) =>
  m.is_presale ? 'PREVENTA' : m.status === 'coming_soon' ? 'PRÓXIMAMENTE' : 'EN CARTELERA';

// Próxima función real de hoy (la primera con sillas a partir de ahora).
const NextDeparture = ({ movieId, upcoming }: { movieId: number | string; upcoming: boolean }) => {
  const { showtimes, loading } = useMovieShowtimes(movieId);
  if (upcoming) return null;
  const now = new Date();
  const nowKey = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const all = Object.values(showtimes as Record<string, any>).flatMap((t: any) =>
    (t.times || []).map((x: any) => ({ ...x, theaterName: t.theaterName }))
  ).filter((x: any) => x.available).sort((a: any, b: any) => String(a.time).localeCompare(String(b.time)));
  const next = all.find((x: any) => String(x.time) >= nowKey) || all[0];
  if (loading && !next) return <div className="h-[72px]" aria-hidden="true" />;
  if (!next) return <p className="font-data text-sm text-board-mute">Hoy no hay funciones con sillas.</p>;
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border border-board-line2 bg-board-panel px-4 py-3" aria-live="polite">
      <span className="font-data text-[11px] uppercase text-board-mute">Próxima función</span>
      <span className="font-data text-4xl font-bold leading-none text-board-amberink">{next.time}</span>
      <span className="font-data text-sm font-bold">{next.hall_number ? `SALA ${next.hall_number}` : ''}</span>
      <span className="font-data text-sm text-board-ink2">{next.theaterName}</span>
    </div>
  );
};

const MovieCarousel = ({ movies = [], autoPlay = true, interval = 7000 }: { movies?: any[]; autoPlay?: boolean; interval?: number }) => {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [hovering, setHovering] = useState(false);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const next = useCallback(() => setIndex(i => (i + 1) % Math.max(movies.length, 1)), [movies.length]);

  useEffect(() => {
    if (!playing || hovering || reduced || movies.length <= 1) return;
    const id = window.setInterval(next, interval);
    return () => clearInterval(id);
  }, [playing, hovering, reduced, movies.length, interval, next]);

  if (!movies.length) return null;
  const movie = movies[Math.min(index, movies.length - 1)];

  return (
    <section
      aria-label="Próximas salidas"
      className="border-b border-board-line"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-10 lg:py-8">
        {/* Título en aletas + datos */}
        <div className="flex min-w-0 flex-col gap-8 order-2 lg:order-1 lg:justify-center">
          <div>
            <h1 className="m-0">
              <FlapText text={movie.title} size="clamp(2rem, 5vw, 4rem)" />
            </h1>
            {movie.subtitle && <p className="mt-3 font-board text-xl tracking-wide text-board-ink2 uppercase">{movie.subtitle}</p>}

            <dl className="mt-6 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-board-line pt-4 font-data text-sm sm:grid-cols-4">
              <div><dt className="text-[11px] uppercase text-board-mute">Estado</dt><dd className="mt-1 font-bold text-board-amberink">{statusOf(movie)}</dd></div>
              <div><dt className="text-[11px] uppercase text-board-mute">Duración</dt><dd className="mt-1 font-bold">{movie.duration_formatted || '—'}</dd></div>
              <div><dt className="text-[11px] uppercase text-board-mute">Género</dt><dd className="mt-1 font-bold">{movie.genre || '—'}</dd></div>
              <div><dt className="text-[11px] uppercase text-board-mute">Desde</dt><dd className="mt-1 font-bold">{movie.price ? movie.price_formatted : '—'}</dd></div>
            </dl>

            <div className="mt-5"><NextDeparture movieId={movie.id} upcoming={movie.status === 'coming_soon' && !movie.is_presale} /></div>

            {movie.description && (
              <p className="mt-5 hidden line-clamp-2 max-w-[62ch] sm:block text-[17px] leading-relaxed text-board-ink2">{movie.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex h-14 items-center rounded-[3px] bg-board-amber px-8 font-board text-xl font-bold tracking-[0.08em] text-board-onamber hover:bg-board-amberpress active:translate-y-px"
            >
              {movie.is_presale ? 'COMPRAR EN PREVENTA' : 'VER HORARIOS Y COMPRAR'}
            </Link>
            {movies.length > 1 && !reduced && (
              <button
                type="button"
                onClick={() => setPlaying(p => !p)}
                aria-label={playing ? 'Pausar rotación' : 'Reanudar rotación'}
                className="flex h-14 w-14 items-center justify-center rounded-[3px] border border-board-line2 text-board-ink2 hover:border-board-ink hover:text-board-ink"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Póster + lista de salidas */}
        <div className="order-1 grid grid-cols-[96px_minmax(0,1fr)] gap-4 lg:order-2 lg:grid-cols-1 lg:gap-4">
          <Link to={`/movie/${movie.id}`} className="block self-start border border-board-line bg-board-panel p-1.5" aria-label={`Ver ${movie.title}`}>
            <img
              key={movie.id}
              src={optimizeCloudinaryUrl(movie.poster_url, 600)}
              alt={`Póster de ${movie.title}`}
              className="aspect-[2/3] w-full object-cover"
            />
          </Link>

          <ol className="self-end border-t border-board-line" aria-label="Otras salidas">
            {movies.map((m, i) => {
              const active = i === index;
              return (
                <li key={m.id} className="border-b border-board-line">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={active ? 'true' : undefined}
                    className={`flex min-h-[44px] w-full items-center gap-3 px-2 text-left ${active ? 'bg-board-panel2 text-board-ink' : 'text-board-mute hover:text-board-ink'}`}
                  >
                    <span className={`font-data text-xs font-bold ${active ? 'text-board-amberink' : ''}`}>{pad(i + 1)}</span>
                    <span className="truncate font-board text-lg font-semibold tracking-wide uppercase">{m.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export { MovieCarousel };
