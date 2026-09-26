// src/pages/PaymentPage.tsx
//
// Paso final de la compra: la persona paga en el Web Checkout de Wompi
// (tarjeta, PSE, Nequi, Bancolombia…). Aquí no se piden datos de pago: se
// crea la compra, se espera a que el inventario reserve los asientos y a que
// payment-service prepare el cobro, y se redirige a Wompi. Wompi devuelve a
// /pago/resultado (PaymentResultPage).
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { FloatingParticles, GlassCard, PremiumButton } from '../components/common';
import { useBooking } from '../hooks/useBooking';
import { optimizeCloudinaryUrl } from '../utils/movieUtils';
import useAuth from "../hooks/useAuth.js";
import { LoginModal } from '../components/auth/LoginModal';
import { useQuote } from '../hooks/usePricing';

type Stage = 'idle' | 'reserving' | 'preparing' | 'redirecting';

const STAGES: Array<{ id: Exclude<Stage, 'idle'>; label: string }> = [
  { id: 'reserving', label: 'Reservando tus asientos' },
  { id: 'preparing', label: 'Preparando el pago seguro' },
  { id: 'redirecting', label: 'Llevándote a Wompi' },
];

// Solo informativo: el medio se elige dentro de Wompi. Se muestra como una
// línea discreta (sin borde ni fondo) para que no parezcan opciones que se
// pueden seleccionar aquí; el único control de la página es "Pagar con Wompi".
const WOMPI_METHODS = [
  { icon: CreditCardIcon, name: 'Tarjeta' },
  { icon: BuildingLibraryIcon, name: 'PSE' },
  { icon: DevicePhoneMobileIcon, name: 'Nequi' },
  { icon: BuildingLibraryIcon, name: 'Bancolombia' },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { updateBooking, startCheckout } = useBooking();

  const paymentData = location.state || {};
  const { movie, theater, showtime, selectedDate, ticketCount, selectedSeats, concessions = [] } = paymentData;

  const [stage, setStage] = useState<Stage>('idle');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // El total lo calcula el backend (mismo cálculo con que se cobra en Wompi).
  const seats = selectedSeats?.length ? selectedSeats : null;
  const quote = useQuote(
    movie?.id
      ? {
          movie_id: movie.id,
          quantity: seats?.length || ticketCount || 1,
          selected_seats: seats,
          showtime_id: showtime?.id ?? null,
          concessions,
        }
      : null
  );

  useEffect(() => {
    if (!movie || !theater) {
      navigate('/cartelera');
      return;
    }
    // El contexto es de donde startCheckout() toma los datos de la compra.
    updateBooking({
      movie,
      theater,
      showtime: showtime || null,
      selectedDate,
      ticketCount: ticketCount || 1,
      selectedSeats: selectedSeats || [],
      concessions,
      step: 3,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id, theater?.id, showtime?.id]);

  if (!movie || !theater || !showtime) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Información de pago no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>Volver a Cartelera</PremiumButton>
        </div>
      </div>
    );
  }

  const total = quote.data?.total ?? 0;
  const busy = stage !== 'idle';

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setPaymentError(null);
    try {
      const checkoutUrl = await startCheckout({ onStage: setStage });
      // Salida a Wompi: la página de resultado retoma desde sessionStorage.
      window.location.assign(checkoutUrl);
    } catch (error) {
      setStage('idle');
      const detail = error?.response?.data?.detail;
      setPaymentError(typeof detail === 'string' ? detail : error?.message || 'No pudimos iniciar el pago. Intenta de nuevo.');
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FloatingParticles count={25} className="opacity-20" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                disabled={busy}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 mb-4 disabled:opacity-40"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Volver
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Realizar pago</h1>
              <p className="text-white/70">Pagas en Wompi, la pasarela de Bancolombia. Tus datos nunca pasan por Cinema+.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <LockClosedIcon className="w-6 h-6 text-green-400" />
                    <h2 className="text-white font-semibold text-lg">Pago seguro con Wompi</h2>
                  </div>
                  <p className="text-white/70 text-sm">
                    Pulsa <span className="text-white font-medium">Pagar con Wompi</span> y allí eliges cómo pagar.
                    Al terminar vuelves aquí y ves tus boletas con su código QR.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p id="wompi-methods" className="text-white/50 text-xs mb-2">Medios que acepta Wompi</p>
                    <ul aria-labelledby="wompi-methods" className="flex flex-wrap gap-x-5 gap-y-2">
                      {WOMPI_METHODS.map(({ icon: Icon, name }) => (
                        <li key={name} className="flex items-center gap-1.5 text-white/60 text-sm select-none">
                          <Icon className="w-4 h-4 text-white/40 shrink-0" aria-hidden="true" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>

                {busy && (
                  <GlassCard className="p-6" aria-live="polite">
                    <ol className="space-y-3">
                      {STAGES.map(({ id, label }, index) => {
                        const current = STAGES.findIndex(s => s.id === stage);
                        const state = index < current ? 'done' : index === current ? 'active' : 'todo';
                        return (
                          <li key={id} className="flex items-center gap-3">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                state === 'done'
                                  ? 'bg-green-500 text-white'
                                  : state === 'active'
                                    ? 'bg-blue-500 text-white animate-pulse'
                                    : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {state === 'done' ? '✓' : index + 1}
                            </span>
                            <span className={state === 'todo' ? 'text-white/40' : 'text-white'}>{label}</span>
                          </li>
                        );
                      })}
                    </ol>
                    <p className="text-white/40 text-xs mt-4">No cierres esta ventana.</p>
                  </GlassCard>
                )}

                <GlassCard className="p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white font-medium text-sm">Tus asientos quedan apartados mientras pagas</p>
                      <p className="text-white/60 text-xs">Si no completas el pago a tiempo, se liberan y no se cobra nada.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-1">
                <GlassCard className="p-6 sticky top-8">
                  <h3 className="text-white font-semibold text-lg mb-4">Resumen de compra</h3>

                  <div className="mb-6 flex gap-3">
                    <img
                      src={optimizeCloudinaryUrl(movie.images?.poster || movie.poster_url, 150)}
                      alt={movie.title}
                      className="w-16 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">{movie.title}</h4>
                      <div className="text-xs text-white/70 space-y-1">
                        <p>{theater.name}</p>
                        <p>{showtime.time} - {showtime.format}</p>
                        <p>{new Date(selectedDate).toLocaleDateString('es-CO')}</p>
                        {selectedSeats?.length > 0 && <p>Asientos: {selectedSeats.join(', ')}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6" aria-live="polite">
                    {quote.isPending && <p className="text-white/60 text-sm">Calculando el total…</p>}
                    {quote.isError && (
                      <p role="alert" className="text-red-300 text-sm">
                        No pudimos calcular el total. Vuelve atrás e intenta de nuevo.
                      </p>
                    )}
                    {quote.data?.lines.map(line => (
                      <div key={`${line.kind}-${line.code}`} className="flex justify-between gap-2 text-sm">
                        <span className="text-white/80">
                          {line.quantity} × {line.description}
                        </span>
                        <span className="text-white shrink-0">{formatPrice(line.line_total)}</span>
                      </div>
                    ))}
                    <hr className="border-white/20" />
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-green-400 font-bold text-xl">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {paymentError && (
                    <div role="alert" className="mb-4 p-4 rounded-lg border text-sm bg-red-500/20 border-red-500/40 text-red-300">
                      <p className="font-semibold mb-1">No se pudo iniciar el pago</p>
                      <p className="text-xs opacity-90">{paymentError}</p>
                    </div>
                  )}

                  <PremiumButton
                    onClick={handlePayment}
                    disabled={busy || !quote.data}
                    className="w-full flex items-center justify-center gap-2"
                    size="lg"
                  >
                    {busy ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Procesando…
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="w-5 h-5" />
                        Pagar con Wompi {formatPrice(total)}
                      </>
                    )}
                  </PremiumButton>

                  {!isAuthenticated && (
                    <p className="text-yellow-400 text-xs mt-3 text-center">Inicia sesión primero para completar el pago</p>
                  )}

                  <div className="mt-4 text-xs text-white/60 space-y-1">
                    <p>Al continuar aceptas nuestros términos y condiciones</p>
                    <p>• Válido solo para la función seleccionada</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default PaymentPage;
