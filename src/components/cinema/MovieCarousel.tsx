// src/components/cinema/MovieCarousel.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, TicketIcon } from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard, PremiumButton} from '../common';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../ui/hover-card';
import { Badge } from '../ui/badge';
import { optimizeCloudinaryUrl } from '../../utils/movieUtils';

const MovieCarousel = ({ movies = [], autoPlay = true, interval = 6000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const total = movies.length;
  const running = isPlaying && !isHovering && total > 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  // El temporizador se reinicia con cada cambio de slide para que la barra de progreso y el avance coincidan
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(nextSlide, interval);
    return () => clearTimeout(timer);
  }, [running, currentIndex, nextSlide, interval]);

  // Mantiene visible la miniatura activa en el riel (móvil)
  useEffect(() => {
    const el = railRef.current?.children[currentIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [currentIndex]);

  if (!total) {
    return (
      <div className="relative min-h-[60svh] flex items-center justify-center">
        <p className="text-white/80 text-lg">No hay películas disponibles</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? nextSlide : prevSlide)();
  };

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden"
      aria-roledescription="carrusel"
      aria-label="Películas destacadas"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Fondo: cada backdrop hace crossfade con un zoom lento (Ken Burns) */}
      <div className="absolute inset-0" aria-hidden="true">
        {movies.map((movie, index) => (
          <div
            key={`${movie.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={optimizeCloudinaryUrl(movie.backdrop_url || movie.poster_url, 1600)}
              alt=""
              className={`w-full h-full object-cover ${index === currentIndex ? 'hero-kenburns' : ''}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-transparent" />
      </div>

      <FloatingParticles count={24} className="opacity-25" />

      {/* Contenido: se remonta con key para reproducir la entrada al cambiar de película */}
      <div className="relative min-h-[100svh] flex flex-col justify-end pt-28 pb-44 sm:pb-48 lg:pb-52">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div key={currentMovie.id} className="hero-enter grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-16 items-end">

            <div className="space-y-5 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              {/* Póster móvil: pequeño y flotando sobre el título */}
              <div className="lg:hidden flex justify-center">
                <HoverCard openDelay={300}>
                  <HoverCardTrigger asChild>
                    <Link to={`/movie/${currentMovie.id}`} aria-label={`Ver ${currentMovie.title}`} className="block w-40 sm:w-48 rounded-2xl p-1.5 glass shadow-2xl shadow-black/50">
                      <img
                        src={optimizeCloudinaryUrl(currentMovie.poster_url, 400)}
                        alt={currentMovie.title}
                        className="w-full rounded-xl aspect-[2/3] object-cover"
                      />
                    </Link>
                  </HoverCardTrigger>
                  <MoviePosterHoverCard movie={currentMovie} side="bottom" />
                </HoverCard>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {currentMovie.ageRating && (
                  <span className="glass rounded-full px-3 py-1 text-xs font-semibold text-white">{currentMovie.ageRating}</span>
                )}
                {currentMovie.genre && (
                  <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/85">{currentMovie.genre}</span>
                )}
                {currentMovie.duration && (
                  <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/85">{/^\d+$/.test(String(currentMovie.duration)) ? `${currentMovie.duration} min` : currentMovie.duration}</span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight text-balance">
                {currentMovie.title}
              </h1>

              {currentMovie.subtitle && (
                <h2 className="text-lg text-white/80 font-medium">{currentMovie.subtitle}</h2>
              )}

              {currentMovie.description && (
                <p className="text-white/85 text-base sm:text-lg leading-relaxed line-clamp-3 max-w-[60ch] mx-auto lg:mx-0">
                  {currentMovie.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <PremiumButton variant="premium" size="lg" className="group" asChild>
                  <Link to={`/movie/${currentMovie.id}`}>
                    <TicketIcon className="w-5 h-5 mr-2 transition-transform group-hover:-rotate-12" />
                    Comprar boletos
                  </Link>
                </PremiumButton>
                <PremiumButton variant="secondary" size="lg" asChild>
                  <Link to={`/movie/${currentMovie.id}`}>Ver detalles</Link>
                </PremiumButton>
              </div>

              {currentMovie.specialOffer && (
                <p className="inline-block glass rounded-xl px-4 py-2 text-sm font-semibold text-amber-300">
                  {currentMovie.specialOffer}
                </p>
              )}
            </div>

            {/* Póster escritorio */}
            <div className="hidden lg:block w-72 xl:w-80">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Link to={`/movie/${currentMovie.id}`} aria-label={`Ver ${currentMovie.title}`} className="block rounded-2xl p-2 glass shadow-2xl shadow-black/60 transition-transform duration-500 ease-out hover:-translate-y-1">
                    <img
                      src={optimizeCloudinaryUrl(currentMovie.poster_url, 600)}
                      alt={currentMovie.title}
                      className="w-full rounded-xl aspect-[2/3] object-cover"
                    />
                  </Link>
                </HoverCardTrigger>
                <MoviePosterHoverCard movie={currentMovie} side="left" />
              </HoverCard>
            </div>
          </div>
        </div>
      </div>

      {/* Flechas: solo escritorio, en móvil se desliza */}
      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Película anterior"
            className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full glass hover:glass-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Película siguiente"
            className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full glass hover:glass-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Riel "Ahora en cartelera": miniaturas con progreso de autoplay */}
      <div className="absolute bottom-0 inset-x-0 pb-5 sm:pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-2.5 sm:p-3 flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
              className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              {isPlaying ? <PauseIcon className="w-5 h-5 text-white" /> : <PlayIcon className="w-5 h-5 text-white" />}
            </button>

            <div
              ref={railRef}
              className="flex-1 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none"
              role="tablist"
              aria-label="Elegir película"
            >
              {movies.map((movie, index) => {
                const active = index === currentIndex;
                return (
                  <button
                    key={`${movie.id}-${index}`}
                    role="tab"
                    aria-selected={active}
                    aria-label={movie.title}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative snap-center shrink-0 flex items-center gap-2.5 rounded-xl p-1.5 pr-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                      active ? 'bg-white/15' : 'hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={optimizeCloudinaryUrl(movie.poster_url, 120)}
                      alt=""
                      className="h-14 w-10 rounded-lg object-cover shrink-0"
                    />
                    <span className={`hidden sm:block w-28 lg:w-36 text-sm leading-tight line-clamp-2 ${active ? 'text-white font-semibold' : 'text-white/70'}`}>
                      {movie.title}
                    </span>
                    {active && total > 1 && (
                      <span className="absolute left-2 right-2 bottom-0.5 h-0.5 rounded-full bg-white/20 overflow-hidden" aria-hidden="true">
                        <span
                          key={`${currentIndex}-${running}`}
                          className={`block h-full bg-white origin-left ${running ? 'hero-progress' : 'scale-x-100'}`}
                          style={{ animationDuration: `${interval}ms` }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// HoverCard con preview de la película
const MoviePosterHoverCard = ({ movie, side = 'right' }: { movie: any; side?: 'left' | 'right' | 'top' | 'bottom' }) => (
  <HoverCardContent
    side={side}
    sideOffset={12}
    className="w-72 p-0 bg-slate-900/95 backdrop-blur-xl border-white/[0.12] shadow-2xl shadow-black/60 rounded-xl overflow-hidden"
  >
    {/* Backdrop mini */}
    {movie.backdrop_url && (
      <div className="relative h-24 overflow-hidden">
        <img src={movie.backdrop_url} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/95" />
      </div>
    )}

    <div className="p-4 space-y-3">
      <div>
        <h3 className="text-white font-bold text-base leading-tight">{movie.title}</h3>
        {movie.subtitle && (
          <p className="text-white/50 text-xs mt-0.5">{movie.subtitle}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {movie.genre && (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
            {movie.genre}
          </Badge>
        )}
        {movie.ageRating && (
          <Badge variant="outline" className="text-white/60 border-white/20 text-[10px]">
            {movie.ageRating}
          </Badge>
        )}
        {movie.duration && (
          <Badge variant="outline" className="text-white/60 border-white/20 text-[10px]">
            {movie.duration}
          </Badge>
        )}
      </div>

      {movie.description && (
        <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
          {movie.description}
        </p>
      )}

      <Link
        to={`/movie/${movie.id}`}
        className="block w-full text-center py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
      >
        Ver detalles →
      </Link>
    </div>
  </HoverCardContent>
);

// Componente para película individual del carrusel
const MovieSlide = ({ movie, isActive }) => {
  return (
    <div className={`transition-all duration-500 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}>
      <GlassCard variant="premium" className="overflow-hidden premium-card">
        <div className="aspect-[2/3] relative">
          <img
            src={optimizeCloudinaryUrl(movie.poster_url, 400)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
            <p className="text-white/80 text-sm mb-2">{movie.genre}</p>
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">{movie.duration}</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                {movie.ageRating}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};



export { MovieCarousel, MovieSlide};