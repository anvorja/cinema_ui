// src/pages/BookingPage.jsx
import {useState, useEffect, useMemo} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  MinusIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  CreditCardIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { FloatingParticles, GlassCard, PremiumButton } from '../components/ui';
import { useBooking } from '../hooks/useBooking';
import { useMovieShowtimes } from '../hooks/useMovieShowtimes';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, theaterId, showtimeId } = useParams();

  const {
    bookingData,
    updateBooking,
    calculateTotal,
    isBookingActive
  } = useBooking();

  const { getShowtimeById } = useMovieShowtimes(movieId);

  // Obtener datos de location.state o del contexto
  const initialData = location.state || {};
  const { movie, theater, showtime, selectedDate } = initialData;

  // Si no hay datos en state, construir desde parámetros
  const currentShowtime = useMemo(() => {
    return showtime || getShowtimeById(theaterId, showtimeId) || {
      id: parseInt(showtimeId),
      time: '19:30',
      format: '2D Doblada',
      price: 18000
    };
  }, [showtime, getShowtimeById, theaterId, showtimeId]);

  // Estados locales
  const [ticketCount, setTicketCount] = useState(bookingData.ticketCount || 1);
  const [serviceFee] = useState(800);

  useEffect(() => {
    // Si no hay datos de navegación y tampoco booking activo, redirigir
    if (!movie && !isBookingActive) {
      navigate('/cartelera');
      return;
    }

    // Actualizar contexto de booking si hay nuevos datos
    if (movie && theater && currentShowtime) {
      updateBooking({
        movie,
        theater,
        showtime: currentShowtime,
        selectedDate: selectedDate || new Date().toISOString().split('T')[0],
        ticketCount,
        step: 1
      });
    }
  }, [movie, theater, currentShowtime, selectedDate, ticketCount, updateBooking, isBookingActive, navigate]);

  // Usar datos del contexto si están disponibles
  const currentMovie = movie || bookingData.movie;
  const currentTheater = theater || bookingData.theater;
  const currentDate = selectedDate || bookingData.selectedDate;

  // Calculos de precios
  const ticketPrice = currentShowtime?.price || 18000;
  const subtotal = ticketCount * ticketPrice;
  const totalServiceFees = ticketCount * serviceFee;
  const totalAmount = subtotal + totalServiceFees;

  const handleTicketChange = (change) => {
    const newCount = Math.max(1, Math.min(10, ticketCount + change));
    setTicketCount(newCount);

    // Actualizar contexto
    updateBooking({
      ticketCount: newCount,
      totalAmount: calculateTotal(newCount, ticketPrice, serviceFee)
    });
  };

  const handleContinue = () => {
    // Actualizar contexto con datos finales
    updateBooking({
      ticketCount,
      totalAmount,
      step: 2
    });

    navigate('/payment', {
      state: {
        movie: currentMovie,
        theater: currentTheater,
        showtime: currentShowtime,
        selectedDate: currentDate,
        ticketCount,
        ticketPrice,
        serviceFee,
        totalAmount
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state si no hay datos
  if (!currentMovie || !currentTheater || !currentShowtime) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Información de reserva no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingParticles count={25} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver
            </button>

            <h1 className="text-3xl font-bold text-white mb-2">
              Reservar Entradas
            </h1>
            <p className="text-white/70">
              Selecciona la cantidad de entradas para tu película
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Movie & Theater Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Movie Summary */}
              <GlassCard className="p-6">
                <div className="flex gap-4">
                  <img
                    src={currentMovie.images?.poster || currentMovie.poster_url}
                    alt={currentMovie.title}
                    className="w-24 h-36 rounded-lg shadow-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-xl mb-2">
                      {currentMovie.title}
                    </h2>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-blue-400" />
                        <span>{currentTheater.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-green-400" />
                        <span>{currentShowtime.time} - {currentShowtime.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TicketIcon className="w-4 h-4 text-purple-400" />
                        <span>{formatDate(currentDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Ticket Selection */}
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Cantidad de Entradas
                </h3>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={() => handleTicketChange(-1)}
                    disabled={ticketCount <= 1}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {ticketCount}
                    </div>
                    <div className="text-sm text-white/70">
                      {ticketCount === 1 ? 'entrada' : 'entradas'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleTicketChange(1)}
                    disabled={ticketCount >= 10}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center text-sm text-white/60">
                  Máximo 10 entradas por compra
                </div>
              </GlassCard>

              {/* Theater Details */}
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Información del Teatro
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white font-medium">{currentTheater.name}</p>
                    <p className="text-white/70 text-sm">{currentTheater.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Capacidad</p>
                      <p className="text-white">{currentTheater.capacity} asientos</p>
                    </div>
                    <div>
                      <p className="text-white/60">Formato</p>
                      <p className="text-white">{currentShowtime.format}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-8">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Resumen del Pedido
                </h3>

                <div className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/80">
                        {ticketCount} x Entrada {currentShowtime.format}
                      </span>
                      <span className="text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-white/80">
                        Tarifa de servicio ({ticketCount} x {formatPrice(serviceFee)})
                      </span>
                      <span className="text-white">
                        {formatPrice(totalServiceFees)}
                      </span>
                    </div>
                  </div>

                  <hr className="border-white/20" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">
                      Total
                    </span>
                    <span className="text-green-400 font-bold text-xl">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  {/* Action Button */}
                  <PremiumButton
                    onClick={handleContinue}
                    className="w-full flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    Continuar al Pago
                  </PremiumButton>

                  {/* Additional Info */}
                  <div className="mt-4 text-xs text-white/60 space-y-1">
                    <p>• Las entradas no son reembolsables</p>
                    <p>• Presenta tu código de confirmación en el teatro</p>
                    <p>• Llega 15 minutos antes de la función</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;