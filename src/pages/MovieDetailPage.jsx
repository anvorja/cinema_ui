// src/pages/MovieDetailPage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  TicketIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

import { GlassCard, PremiumButton, FloatingParticles } from '../components/ui';
import { useMovie, useMovieAvailability, useMovieTheaters } from '../hooks/useMovies';
import { useMovieTransform } from '../hooks/useMoviesTransform';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  // Hooks para datos
  const { movie: rawMovie, loading, error, refetch } = useMovie(id);
  const { availability } = useMovieAvailability(id);
  const { theaters } = useMovieTheaters(id);

  // Transformar datos de la película usando el hook
  const movie = useMovieTransform(rawMovie);

  // DEBUG: Console log para verificar que funciona
  console.log('🎬 MovieDetailPage cargada - ID:', id);
  console.log('🎭 Datos de película:', movie);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ErrorMessage
          message={error}
          onRetry={refetch}
          title="Error al cargar la película"
        />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Película no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingParticles count={30} className="opacity-20" />

      <section className="relative h-screen overflow-hidden">
        {/* Background usando la mejor imagen disponible */}
        <div className="absolute inset-0">
          <img
            src={movie.images.backdrop}
            alt={movie.title}
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'blur(2px)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

              {/* Poster Image usando imagen transformada */}
              <div className="flex justify-center lg:justify-start">
                <GlassCard variant="premium" className="p-3 premium-card">
                  <img
                    src={movie.images.poster}
                    alt={movie.title}
                    className="w-80 rounded-lg shadow-2xl"
                  />
                </GlassCard>
              </div>

              {/* Movie Info */}
              <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
                <div>
                  {/* Badge de estado usando statusBadge transformado */}
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                    {movie.statusBadge && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${movie.statusBadge.className}`}>
                        {movie.statusBadge.text}
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>

                  <p className="text-xl text-white/80 mb-6 max-w-3xl">
                    {movie.description}
                  </p>
                </div>

                {/* Movie Details Grid usando datos pre-formateados */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <GlassCard className="p-4 text-center">
                    <ClockIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Duración</p>
                    <p className="text-white font-semibold">{movie.duration_formatted}</p>
                  </GlassCard>

                  <GlassCard className="p-4 text-center">
                    <TagIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Género</p>
                    <p className="text-white font-semibold">{movie.genre}</p>
                  </GlassCard>

                  <GlassCard className="p-4 text-center">
                    <UserIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Clasificación</p>
                    <p className="text-white font-semibold">{movie.ageRating}</p>
                  </GlassCard>

                  <GlassCard className="p-4 text-center">
                    <CurrencyDollarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">Precio</p>
                    <p className="text-white font-semibold">{movie.price_formatted}</p>
                  </GlassCard>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Director</h3>
                    <p className="text-white/80">{movie.director}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">País</h3>
                    <p className="text-white/80">{movie.country}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Fecha de estreno</h3>
                    <p className="text-white/80">{movie.release_date_formatted}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Disponibilidad</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${movie.isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <p className={movie.isAvailable ? 'text-green-400' : 'text-red-400'}>
                        {movie.isAvailable ?
                          `${movie.available_tickets} entradas disponibles` :
                          'Agotado'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <PremiumButton
                    size="lg"
                    className="flex items-center gap-2"
                    disabled={!movie.isAvailable}
                    onClick={() => navigate('/booking', { state: { movieId: movie.id } })}
                  >
                    <TicketIcon className="w-5 h-5" />
                    {movie.isAvailable ? 'Comprar Entradas' : 'Agotado'}
                  </PremiumButton>

                  {/* Botón de trailer */}
                  <button
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 justify-center"
                    onClick={() => setShowTrailer(true)}
                  >
                    <PlayIcon className="w-5 h-5" />
                    Ver Tráiler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Tráiler */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>Tráiler de {movie.title}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Aquí se reproduciría el tráiler de la película
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Images Section usando imágenes transformadas */}
      {(movie.images.detail1 !== movie.images.poster || movie.images.detail2 !== movie.images.backdrop) && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Imágenes de la Película
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src={movie.images.detail1}
                  alt={`${movie.title} - Detalle 1`}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>

              <div className="space-y-4">
                <img
                  src={movie.images.detail2}
                  alt={`${movie.title} - Detalle 2`}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Theaters Section */}
      {theaters && theaters.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Teatros Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {theaters.map((theater) => (
                <GlassCard key={theater.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="w-8 h-8 text-blue-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {theater.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-3">
                        {theater.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 text-sm">
                          Capacidad: {theater.capacity}
                        </span>
                        <PremiumButton size="sm">
                          Ver Horarios
                        </PremiumButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Availability Info */}
      {availability && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Información de Disponibilidad
            </h2>
            <div className="max-w-2xl mx-auto">
              <GlassCard className="p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      {availability.total_available || movie.available_tickets || 0}
                    </p>
                    <p className="text-white/70">Entradas Disponibles</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {availability.total_capacity || movie.max_capacity || 0}
                    </p>
                    <p className="text-white/70">Capacidad Total</p>
                  </div>
                </div>

                {availability.occupancy_rate !== undefined && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Ocupación</span>
                      <span className="text-white">{Math.round(availability.occupancy_rate)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${availability.occupancy_rate}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </section>
      )}

      {/* Back to Cartelera Button */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => navigate('/cartelera')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200"
          >
            ← Volver a Cartelera
          </button>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;