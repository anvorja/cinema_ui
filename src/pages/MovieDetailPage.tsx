// src/pages/MovieDetailPage.jsx - CON LÓGICA DE BOTÓN CORREGIDA
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  TagIcon,
  TicketIcon,
  PlayIcon,
  ExclamationCircleIcon,
  CalendarDaysIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import { GlassCard, PremiumButton, FloatingParticles } from '../components/common';
import { useMovie, useMovieAvailability, useMovieTheaters } from '../hooks/useMovies';
import { useMovieTransform } from '../hooks/useMoviesTransform';
import { useBooking } from '../hooks/useBooking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import TheatersWithShowtimes from '../components/booking/TheatersWithShowtimes';
import { movieService } from '../services/api';
import useAuth from '../hooks/useAuth';

const StarRating = ({ value, onChange = undefined, readonly = false, size = 'md' }: { value: any; onChange?: any; readonly?: boolean; size?: string }) => {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {filled
              ? <StarSolid className={`${sizeClass} text-yellow-400`} />
              : <StarIcon className={`${sizeClass} text-white/30`} />
            }
          </button>
        );
      })}
    </div>
  );
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const _navigate = useNavigate();
  const { startBooking: _startBooking } = useBooking();
  const { isAuthenticated } = useAuth();
  const [showTrailer, setShowTrailer] = useState(false);

  // Rating state
  const [userScore, setUserScore] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState(null); // { type: 'success'|'error', text }

  // Hooks para datos
  const { movie: rawMovie, loading, error, refetch } = useMovie(id);
  const { availability } = useMovieAvailability(id);
  const { theaters } = useMovieTheaters(id);

  // Transformar datos de la película usando el hook
  const movie = useMovieTransform(rawMovie);

  // ✅ LÓGICA DE DISPONIBILIDAD PARA COMPRAR
  const getPurchaseAvailability = () => {
    if (!rawMovie) return { canPurchase: false, message: 'Cargando...', buttonText: 'Cargando...' };

    // EN CARTELERA: Siempre se puede comprar si hay tickets
    if (rawMovie.status === 'in_theaters') {
      return {
        canPurchase: rawMovie.available_tickets > 0,
        message: rawMovie.available_tickets > 0
          ? `¡Ya disponible en cines! ${rawMovie.available_tickets} entradas disponibles`
          : 'Entradas agotadas',
        buttonText: rawMovie.available_tickets > 0 ? 'Comprar Entradas' : 'Agotado',
        statusBadge: 'EN CARTELERA',
        statusColor: 'bg-green-600'
      };
    }

    // PRÓXIMO ESTRENO: Solo si está en preventa
    if (rawMovie.status === 'coming_soon') {
      if (rawMovie.is_presale) {
        return {
          canPurchase: rawMovie.available_tickets > 0,
          message: `Preventa disponible - Estreno: ${movie.release_date_formatted}`,
          buttonText: rawMovie.available_tickets > 0 ? 'Comprar Preventa' : 'Preventa Agotada',
          statusBadge: 'PREVENTA',
          statusColor: 'bg-yellow-600'
        };
      } else {
        return {
          canPurchase: false,
          message: `Próximamente - Estreno: ${movie.release_date_formatted}`,
          buttonText: 'Próximamente',
          statusBadge: 'PRÓXIMAMENTE',
          statusColor: 'bg-blue-600'
        };
      }
    }

    // FINALIZADA
    return {
      canPurchase: false,
      message: 'Ya no está en cartelera',
      buttonText: 'Finalizada',
      statusBadge: 'FINALIZADA',
      statusColor: 'bg-gray-600'
    };
  };

  const purchaseInfo = getPurchaseAvailability();

  // Llevar al usuario a la sección de teatros/horarios para que elija función real
  const handleQuickBuy = () => {
    if (!purchaseInfo.canPurchase) return;
    document.getElementById('theaters-showtimes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRateMovie = async () => {
    if (!userScore) return;
    setRatingSubmitting(true);
    setRatingMsg(null);
    try {
      await movieService.rate(id, userScore, userReview || null);
      setRatingMsg({ type: 'success', text: '¡Gracias por tu calificación!' });
      refetch();
    } catch {
      setRatingMsg({ type: 'error', text: 'No se pudo guardar tu calificación.' });
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información de la película..." />;
  }

  if (error || !movie) {
    return <ErrorMessage
      title="Error al cargar la película"
      message={error || "No se pudo encontrar la información de la película"}
      onRetry={refetch}
    />;
  }

  return (
    <div className="min-h-screen pt-20">
      <FloatingParticles count={50} className="opacity-30" />

      {/* Hero Section */}
      <section className="relative py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.images.backdrop})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative">
                {/* Badge de estado */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${purchaseInfo.statusColor}`}>
                    {purchaseInfo.statusBadge}
                  </span>
                </div>

                <img
                  src={movie.images.poster}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
                  {movie.description}
                </p>
              </div>

              {/* Movie Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <h3 className="text-white font-semibold mb-2">Estado</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      purchaseInfo.canPurchase ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <p className={`text-sm ${
                      purchaseInfo.canPurchase ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {purchaseInfo.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* ✅ BOTÓN CON LÓGICA CORREGIDA */}
                <PremiumButton
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={!purchaseInfo.canPurchase}
                  onClick={handleQuickBuy}
                >
                  {purchaseInfo.canPurchase ? (
                    <TicketIcon className="w-5 h-5" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5" />
                  )}
                  {purchaseInfo.buttonText}
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

              {/* ✅ MENSAJE INFORMATIVO PARA PRÓXIMAMENTE */}
              {rawMovie?.status === 'coming_soon' && !rawMovie?.is_presale && (
                <GlassCard className="p-6 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-semibold">Próximamente en cines</h4>
                      <p className="text-white/70 text-sm">
                        Esta película aún no está disponible para comprar. Se estrenará el {movie.release_date_formatted}.
                        {theaters && theaters.length > 0 && " Puedes ver los horarios programados más abajo."}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* ✅ MENSAJE INFORMATIVO PARA PREVENTA */}
              {rawMovie?.status === 'coming_soon' && rawMovie?.is_presale && (
                <GlassCard className="p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-3">
                    <TicketIcon className="w-6 h-6 text-yellow-400" />
                    <div>
                      <h4 className="text-white font-semibold">Preventa Disponible</h4>
                      <p className="text-white/70 text-sm">
                        ¡Ya puedes comprar tus entradas! Esta película se estrena el {movie.release_date_formatted}.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
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

      {/* Detailed Images Section */}
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

      {/* Theaters Section con horarios - SOLO SI HAY THEATERS Y PUEDE COMPRAR O ES COMING_SOON */}
      {theaters && theaters.length > 0 && (rawMovie?.status === 'in_theaters' || rawMovie?.is_presale || rawMovie?.status === 'coming_soon') && (
        <div id="theaters-showtimes-section">
        <TheatersWithShowtimes
          theaters={theaters}
          movieId={id}
          movie={movie}
          canPurchase={purchaseInfo.canPurchase}
        />
        </div>
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
                      {availability.total_available}
                    </p>
                    <p className="text-white/70">Entradas Disponibles</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      {availability.total_capacity}
                    </p>
                    <p className="text-white/70">Capacidad Total</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${availability.occupancy_rate}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-white/70 mt-2">
                    {availability.occupancy_rate}% ocupado
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      )}

      {/* Ratings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Calificación de usuarios
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">

            {/* Promedio actual */}
            <GlassCard className="p-6 text-center">
              {rawMovie?.average_rating ? (
                <>
                  <p className="text-5xl font-bold text-yellow-400 mb-2">
                    {rawMovie.average_rating.toFixed(1)}
                  </p>
                  <StarRating value={Math.round(rawMovie.average_rating)} readonly size="lg" />
                  <p className="text-white/60 text-sm mt-2">
                    Basado en {rawMovie.rating_count} {rawMovie.rating_count === 1 ? 'calificación' : 'calificaciones'}
                  </p>
                </>
              ) : (
                <p className="text-white/50 text-lg">Aún no hay calificaciones. ¡Sé el primero!</p>
              )}
            </GlassCard>

            {/* Formulario de calificación — solo usuarios autenticados */}
            {isAuthenticated ? (
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold mb-4">Tu calificación</h3>
                <div className="space-y-4">
                  <StarRating value={userScore} onChange={setUserScore} size="lg" />
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Escribe una reseña opcional... (máx. 500 caracteres)"
                    maxLength={500}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {ratingMsg && (
                    <p className={`text-sm ${ratingMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {ratingMsg.text}
                    </p>
                  )}
                  <button
                    onClick={handleRateMovie}
                    disabled={!userScore || ratingSubmitting}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors text-sm"
                  >
                    {ratingSubmitting ? 'Enviando...' : 'Enviar calificación'}
                  </button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-4 text-center">
                <p className="text-white/60 text-sm">
                  <span className="text-blue-400 cursor-pointer hover:underline">Inicia sesión</span> para dejar tu calificación.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;