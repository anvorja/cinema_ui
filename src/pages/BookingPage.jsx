// src/pages/BookingPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard, PremiumButton} from '../components/ui';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { movie, theater, showtime, selectedDate } = location.state || {};

  const [ticketCount, setTicketCount] = useState(1);
  const [ticketPrice] = useState(8000); // Precio base por boleta
  const [serviceFee] = useState(800); // Tarifa de servicio por boleta

  useEffect(() => {
    // Redirect if no booking data
    if (!movie || !theater || !showtime) {
      navigate('/cartelera');
    }
  }, [movie, theater, showtime, navigate]);

  const subtotal = ticketCount * ticketPrice;
  const totalServiceFees = ticketCount * serviceFee;
  const totalAmount = subtotal + totalServiceFees;

  const handleTicketChange = (change) => {
    const newCount = Math.max(1, Math.min(10, ticketCount + change));
    setTicketCount(newCount);
  };

  const handleContinue = () => {
    navigate('/payment', {
      state: {
        movie,
        theater,
        showtime,
        selectedDate,
        ticketCount,
        ticketPrice,
        serviceFee,
        totalAmount
      }
    });
  };

  if (!movie || !theater || !showtime) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
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
    <div className="min-h-screen pt-24">
      <FloatingParticles count={25} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-white font-medium">ESCOGER MEDIO DE PAGO</span>
            </div>
            <div className="w-16 h-0.5 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="ml-2 text-white font-medium">SELECCIONAR LOCALIDAD</span>
            </div>
            <div className="w-16 h-0.5 bg-white/30"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/30 text-white/60 rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="ml-2 text-white/60 font-medium">ASIENTOS</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">SELECCIONAR LOCALIDAD</h1>
            <p className="text-white/80">2 de 3</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Movie Info */}
            <div>
              <GlassCard variant="premium" className="p-6">
                <div className="flex gap-4">
                  <img
                    src={movie.posterImage}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                    <p className="text-white/80 text-sm mb-1">{movie.originalTitle}</p>
                    <p className="text-white/70 text-sm mb-4">{movie.ageRating}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-white/70">📍</span>
                        <span className="text-white">{theater.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70">🕐</span>
                        <span className="text-white">
                          {showtime.time}, {selectedDate?.dayName} {selectedDate?.dayNumber} de {selectedDate?.monthName} 2025
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/70">🎬</span>
                        <span className="text-white">{showtime.format}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Ticket Selection */}
            <div>
              <GlassCard variant="premium" className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Seleccionar Cantidad</h3>

                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium mb-1">General</h4>
                      <p className="text-white/70 text-sm">Localidad estándar</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleTicketChange(-1)}
                        disabled={ticketCount <= 1}
                        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-white/20 disabled:text-white/40 transition-all"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>

                      <span className="text-2xl font-bold text-white min-w-[2rem] text-center">
                        {ticketCount}
                      </span>

                      <button
                        onClick={() => handleTicketChange(1)}
                        disabled={ticketCount >= 10}
                        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:bg-white/20 disabled:text-white/40 transition-all"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-white/70 text-sm">Compra General: {ticketCount} sillas</p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Total valor boletas:</span>
                      <span>${subtotal.toLocaleString('es-CO')}</span>
                    </div>

                    <p className="text-white/70 text-xs">
                      Por favor antes de pagar verifique el valor por servicio
                    </p>
                  </div>
                </div>

                <PremiumButton
                  variant="premium"
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                >
                  CONTINUAR
                </PremiumButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;