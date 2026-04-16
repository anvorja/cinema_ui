// src/components/cinema/MovieCarousel.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard, PremiumButton, ShimmerEffect} from '../common';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../ui/hover-card';
import { Badge } from '../ui/badge';

const MovieCarousel = ({ movies = [], autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-play functionality
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  }, [movies.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || movies.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isPlaying, nextSlide, interval, movies.length]);

  // Loading state
  useEffect(() => {
    if (movies.length > 0) {
      setIsLoading(false);
    }
  }, [movies.length]);

  if (isLoading) {
    return (
      <div className="relative h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="relative h-screen flex items-center justify-center">
        <p className="text-white text-xl">No hay películas disponibles</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background with blur and overlay */}
      <div className="absolute inset-0">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={movie.backdrop_url || movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover scale-110"
              style={{ filter: 'blur(2px)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Floating Particles Effect */}
      <FloatingParticles count={30} className="opacity-30" />

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Movie Poster - Mobile/Tablet */}
            <div className="lg:hidden flex justify-center mb-8">
              <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                  <ShimmerEffect className="w-64 sm:w-80 cursor-pointer">
                    <GlassCard variant="premium" className="p-2 premium-card">
                      <img
                        src={currentMovie.poster_url}
                        alt={currentMovie.title}
                        className="w-full rounded-lg shadow-2xl"
                      />
                    </GlassCard>
                  </ShimmerEffect>
                </HoverCardTrigger>
                <MoviePosterHoverCard movie={currentMovie} />
              </HoverCard>
            </div>

            {/* Movie Info */}
            <div className="text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {currentMovie.title}
                </h1>

                {currentMovie.subtitle && (
                  <h2 className="text-lg sm:text-xl text-white/80 font-medium">
                    {currentMovie.subtitle}
                  </h2>
                )}

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-white/70">
                  <span>Estreno: {currentMovie.releaseDate}</span>
                  <span>•</span>
                  <span>Género: {currentMovie.genre}</span>
                  <span>•</span>
                  <span>{currentMovie.duration}</span>
                </div>
              </div>

              {currentMovie.description && (
                <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {currentMovie.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <ShimmerEffect>
                  <PremiumButton
                    variant="premium"
                    size="lg"
                    className="group"
                    asChild
                  >
                    <Link to={`/movie/${currentMovie.id}`}>
                      <PlayIcon className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                      {currentMovie.ageRating}
                    </Link>
                  </PremiumButton>
                </ShimmerEffect>

                <PremiumButton
                  variant="secondary"
                  size="lg"
                  asChild
                >
                  <Link to={`/movie/${currentMovie.id}`}>
                    {currentMovie.buttonText || 'Ver Detalles'}
                  </Link>
                </PremiumButton>
              </div>

              {currentMovie.specialOffer && (
                <div className="pt-4">
                  <GlassCard variant="premium" className="inline-block px-6 py-3 glow-secondary">
                    <p className="text-orange-400 font-semibold text-sm">
                      {currentMovie.specialOffer}
                    </p>
                  </GlassCard>
                </div>
              )}
            </div>

            {/* Movie Poster - Desktop */}
            <div className="hidden lg:flex justify-center">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <ShimmerEffect className="w-96 cursor-pointer">
                    <GlassCard variant="premium" className="p-3 premium-card transition-transform duration-300 hover:scale-[1.02]">
                      <img
                        src={currentMovie.poster_url}
                        alt={currentMovie.title}
                        className="w-full rounded-lg shadow-2xl"
                      />
                    </GlassCard>
                  </ShimmerEffect>
                </HoverCardTrigger>
                <MoviePosterHoverCard movie={currentMovie} side="left" />
              </HoverCard>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass hover:glass-hover transition-all duration-200 group"
      >
        <ChevronLeftIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass hover:glass-hover transition-all duration-200 group"
      >
        <ChevronRightIcon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause Control */}
      <div className="absolute top-8 right-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg glass hover:glass-hover transition-all duration-200"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM13 8a1 1 0 10-2 0v4a1 1 0 102 0V8z" clipRule="evenodd" />
            </svg>
          ) : (
            <PlayIcon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
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
            src={movie.poster_url}
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