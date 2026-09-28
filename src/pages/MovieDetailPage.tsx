// src/pages/MovieDetailPage.jsx
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

import { GlassCard, PremiumButton } from '../components/common';
import FlapText from '../components/board/FlapText';
import { useMovie, useMovieTheaters } from '../hooks/useMovies';
import { useMovieTransform } from '../hooks/useMoviesTransform';
import { useBooking } from '../hooks/useBooking';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import TheatersWithShowtimes from '../components/booking/TheatersWithShowtimes';
import { movieService } from '../services/api';
import useAuth from '../hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

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
              ? <StarSolid className={`${sizeClass} text-[#f2b705]`} />
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
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const { isAuthenticated } = useAuth();
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState('horarios');


  // Rating state
  const [userScore, setUserScore] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState(null); // { type: 'success'|'error', text }
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [myRating, setMyRating] = useState<any>(undefined); // undefined=no cargado, null=sin calificación

  // Hooks para datos
  const { movie: rawMovie, loading, error, refetch } = useMovie(id);
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
          ? '¡Ya disponible en cines!'
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

  // Navegar directo a selección de asientos al elegir horario
  const handleShowtimeSelect = (theater: any, showtime: any) => {
    const selectedDate = showtime.date ?? null;
    startBooking(movie, theater, showtime, selectedDate);
    navigate(`/booking/${id}/${theater.id}/${showtime.id}`, {
      state: { movie, theater, showtime, selectedDate }
    });
  };

  // Llevar al usuario a la sección de teatros/horarios para que elija función real
  const handleQuickBuy = () => {
    if (!purchaseInfo.canPurchase) return;
    setActiveTab('horarios');
    setTimeout(() => {
      document.getElementById('movie-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const loadReviews = async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const data = await movieService.getRatings(id);
      setReviews(data);
    } catch {
      // silencioso — si falla, simplemente no se muestran
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadMyRating = async () => {
    if (!id || !isAuthenticated) return;
    try {
      const data = await movieService.getMyRating(id);
      setMyRating(data ?? null);
    } catch {
      setMyRating(null);
    }
  };

  const handleRateMovie = async () => {
    if (!userScore) return;
    setRatingSubmitting(true);
    setRatingMsg(null);
    try {
      await movieService.rate(id, userScore, userReview || null);
      setRatingMsg({ type: 'success', text: '¡Gracias por tu calificación!' });
      refetch();
      loadReviews();
      loadMyRating();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setRatingMsg({
          type: 'error',
          text: err?.response?.data?.detail
            ?? 'Solo puedes calificar películas a las que hayas asistido con tu QR escaneado.',
        });
      } else {
        setRatingMsg({ type: 'error', text: 'No se pudo guardar tu calificación.' });
      }
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner size="xl" centered message="Cargando la película" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <ErrorMessage
          className="max-w-md"
          title="Error al cargar la película"
          message={error || "No se pudo encontrar la información de la película"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Ficha de la salida */}
      <section className="border-b border-[#2c2c30]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(200px,300px)_minmax(0,1fr)] lg:gap-14 lg:py-14">
          {/* Póster */}
          <div className="mx-auto w-full max-w-[200px] self-start md:mx-0 md:max-w-[300px]">
            <div className="border border-[#2c2c30] bg-[#151517] p-1.5">
              <img src={movie.images.poster} alt={`Póster de ${movie.title}`} className="aspect-[2/3] w-full object-cover" />
            </div>
            <span className={`b-tag mt-3 ${purchaseInfo.canPurchase ? 'b-tag--ok' : 'b-tag--alarm'}`}>{purchaseInfo.statusBadge}</span>
          </div>

          {/* Contenido */}
          <div className="min-w-0 space-y-7">
            <div>
              <h1 className="m-0">
                <FlapText text={movie.title} size="clamp(2rem, 5.6vw, 4.25rem)" />
              </h1>
              <p className="mt-5 max-w-[65ch] text-[17px] leading-relaxed text-[#c3bfb2]">{movie.description}</p>
            </div>

            <dl className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-[#2c2c30] pt-5 sm:grid-cols-3">
              {[
                ['Duración', movie.duration_formatted],
                ['Género', movie.genre],
                ['Clasificación', movie.ageRating],
                ['Director', movie.director],
                ['País', movie.country],
                ['Estreno', movie.release_date_formatted],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="font-data text-[11px] uppercase text-[#8f8b80]">{label}</dt>
                  <dd className="mt-1 font-data text-sm font-bold text-[#f4f1e8]">{value || '—'}</dd>
                </div>
              ))}
            </dl>

            <p className={`flex items-center gap-2 font-data text-sm ${purchaseInfo.canPurchase ? 'text-[#7bd88f]' : 'text-[#f0644d]'}`}>
              <span className={`h-2 w-2 ${purchaseInfo.canPurchase ? 'bg-[#7bd88f]' : 'bg-[#d9412b]'}`} aria-hidden="true" />
              {purchaseInfo.message}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <PremiumButton size="lg" disabled={!purchaseInfo.canPurchase} onClick={handleQuickBuy}>
                {purchaseInfo.canPurchase ? <TicketIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
                {purchaseInfo.buttonText}
              </PremiumButton>
              <PremiumButton size="lg" variant="secondary" onClick={() => setShowTrailer(true)}>
                <PlayIcon className="h-5 w-5" />
                Ver tráiler
              </PremiumButton>
            </div>

            {rawMovie?.status === 'coming_soon' && !rawMovie?.is_presale && (
              <div className="flex max-w-2xl gap-3 border border-[#46464c] bg-[#151517] p-4" role="note">
                <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#f2b705]" />
                <div>
                  <p className="font-board text-xl font-bold tracking-wide uppercase">Próximamente en cines</p>
                  <p className="mt-1 text-[15px] text-[#c3bfb2]">
                    Aún no puedes comprar boletas. Se estrena el {movie.release_date_formatted}.
                    {theaters && theaters.length > 0 && ' Los horarios programados están en la pestaña Horarios.'}
                  </p>
                </div>
              </div>
            )}

            {rawMovie?.status === 'coming_soon' && rawMovie?.is_presale && (
              <div className="flex max-w-2xl gap-3 border border-[#f2b705]/50 bg-[#151517] p-4" role="note">
                <TicketIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#f2b705]" />
                <div>
                  <p className="font-board text-xl font-bold tracking-wide uppercase">Preventa disponible</p>
                  <p className="mt-1 text-[15px] text-[#c3bfb2]">Ya puedes comprar tus boletas. La película se estrena el {movie.release_date_formatted}.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal de Tráiler */}
      {showTrailer && (
        <div role="dialog" aria-modal="true" aria-label={`Tráiler de ${movie.title}`} className="fixed inset-0 bg-[#0c0c0d]/90 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowTrailer(false)}
              aria-label="Cerrar tráiler"
              className="absolute top-2 right-2 z-10 flex h-11 w-11 items-center justify-center bg-[#0c0c0d] text-[#f4f1e8] hover:text-[#f2b705]"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="border border-[#46464c] bg-[#0c0c0d] overflow-hidden">
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

      {/* ── Tabs: Horarios / Galería / Disponibilidad / Calificaciones ── */}
      <section id="movie-tabs" className="py-10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'calificaciones') {
              if (reviews.length === 0) loadReviews();
              if (isAuthenticated && myRating === undefined) loadMyRating();
            }
            }}
            className="w-full"
          >
            <TabsList className="mb-8 h-auto w-full justify-start gap-1 rounded-none border-b border-[#2c2c30] bg-transparent p-0 sm:w-auto">
              <TabsTrigger value="horarios" className="min-h-[48px] flex-none rounded-none border-0 border-b-2 border-transparent px-5 font-board text-xl font-bold tracking-[0.08em] uppercase text-[#8f8b80] data-[state=active]:border-b-[#f2b705] data-[state=active]:bg-transparent data-[state=active]:text-[#f4f1e8] data-[state=active]:shadow-none">
                Horarios
              </TabsTrigger>
              {(movie.images.detail1 !== movie.images.poster || movie.images.detail2 !== movie.images.backdrop) && (
                <TabsTrigger value="galeria" className="min-h-[48px] flex-none rounded-none border-0 border-b-2 border-transparent px-5 font-board text-xl font-bold tracking-[0.08em] uppercase text-[#8f8b80] data-[state=active]:border-b-[#f2b705] data-[state=active]:bg-transparent data-[state=active]:text-[#f4f1e8] data-[state=active]:shadow-none">
                  Galería
                </TabsTrigger>
              )}
              <TabsTrigger value="calificaciones" className="min-h-[48px] flex-none rounded-none border-0 border-b-2 border-transparent px-5 font-board text-xl font-bold tracking-[0.08em] uppercase text-[#8f8b80] data-[state=active]:border-b-[#f2b705] data-[state=active]:bg-transparent data-[state=active]:text-[#f4f1e8] data-[state=active]:shadow-none">
                Calificaciones
              </TabsTrigger>
            </TabsList>

            {/* Horarios */}
            <TabsContent value="horarios">
              <TheatersWithShowtimes
                theaters={theaters}
                movieId={id}
                movie={movie}
                canPurchase={purchaseInfo.canPurchase}
                onShowtimeSelect={handleShowtimeSelect}
              />
            </TabsContent>

            {/* Galería */}
            {(movie.images.detail1 !== movie.images.poster || movie.images.detail2 !== movie.images.backdrop) && (
              <TabsContent value="galeria">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="w-full h-60 lg:h-72 overflow-hidden rounded-xl shadow-2xl">
                    <img src={movie.images.detail1} alt={`${movie.title} - Detalle 1`} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full h-60 lg:h-72 overflow-hidden rounded-xl shadow-2xl">
                    <img src={movie.images.detail2} alt={`${movie.title} - Detalle 2`} className="w-full h-full object-cover" />
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Calificaciones */}
            <TabsContent value="calificaciones">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Promedio global */}
                <GlassCard className="p-6 text-center">
                  {rawMovie?.average_rating ? (
                    <>
                      <p className="text-5xl font-bold text-[#f2b705] mb-2">{rawMovie.average_rating.toFixed(1)}</p>
                      <StarRating value={Math.round(rawMovie.average_rating)} readonly size="lg" />
                      <p className="text-white/60 text-sm mt-2">
                        Basado en {rawMovie.rating_count} {rawMovie.rating_count === 1 ? 'calificación' : 'calificaciones'}
                      </p>
                    </>
                  ) : (
                    <p className="text-white/50 text-lg">Aún no hay calificaciones. ¡Sé el primero!</p>
                  )}
                </GlassCard>

                {/* Sección del usuario autenticado */}
                {isAuthenticated ? (
                  myRating ? (
                    /* El usuario ya calificó — mostrar su reseña en modo lectura */
                    <GlassCard className="p-6 border border-yellow-500/30">
                      <h3 className="text-white font-semibold mb-3">Tu calificación</h3>
                      <StarRating value={myRating.score} readonly size="lg" />
                      {myRating.review && (
                        <p className="text-white/80 text-sm mt-3 leading-relaxed">{myRating.review}</p>
                      )}
                      <p className="text-white/40 text-xs mt-3">
                        Enviada el{' '}
                        {new Date(myRating.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <p className="text-white/30 text-xs mt-1">Solo se permite una calificación por película.</p>
                    </GlassCard>
                  ) : myRating === null ? (
                    /* El usuario no ha calificado — mostrar formulario */
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
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                        {ratingMsg && (
                          <p className={`text-sm ${ratingMsg.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {ratingMsg.text}
                          </p>
                        )}
                        <button
                          onClick={handleRateMovie}
                          disabled={!userScore || ratingSubmitting}
                          className="px-6 py-2 bg-[#f2b705] hover:bg-[#d9a304] disabled:opacity-40 disabled:cursor-not-allowed text-[#0c0c0d] font-board text-lg font-bold tracking-[0.08em] rounded-[3px] min-h-[44px]"
                        >
                          {ratingSubmitting ? 'Enviando...' : 'Enviar calificación'}
                        </button>
                      </div>
                    </GlassCard>
                  ) : null /* myRating === undefined: cargando, no renderizar nada */
                ) : (
                  <GlassCard className="p-4 text-center">
                    <p className="text-white/60 text-sm">
                      <span className="text-blue-400 cursor-pointer hover:underline">Inicia sesión</span> para dejar tu calificación.
                    </p>
                  </GlassCard>
                )}

                {/* Lista de reseñas */}
                {reviewsLoading ? (
                  <p className="text-white/40 text-sm text-center">Cargando reseñas...</p>
                ) : reviews.filter((r) => r.review).length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold">Reseñas</h3>
                    {reviews.filter((r) => r.review).map((r, i) => (
                      <GlassCard key={i} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StarRating value={r.score} readonly size="md" />
                            <span className="text-white/50 text-xs">{r.author}</span>
                          </div>
                          <span className="text-white/30 text-xs">
                            {new Date(r.created_at).toLocaleDateString('es-CO', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">{r.review}</p>
                      </GlassCard>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <p className="text-white/40 text-sm text-center">
                    Hay {reviews.length} {reviews.length === 1 ? 'calificación' : 'calificaciones'} pero ninguna incluye comentario.
                  </p>
                ) : null}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;