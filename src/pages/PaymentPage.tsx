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
import { PremiumButton } from '../components/common';
import BookingSteps from '../components/board/BookingSteps';
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 font-board text-2xl font-bold tracking-wide uppercase">Información de pago no encontrada</p>
          <PremiumButton onClick={() => navigate('/')}>Volver a la cartelera</PremiumButton>
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
      <BookingSteps current="Pago" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          disabled={busy}
          className="mb-4 flex min-h-[44px] items-center gap-2 text-board-ink2 hover:text-board-ink disabled:opacity-40"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-board text-lg font-bold tracking-[0.08em]">VOLVER</span>
        </button>
        <h1 className="font-board text-4xl font-bold tracking-[0.06em] uppercase">Pagar tu compra</h1>
        <p className="mt-2 max-w-[65ch] text-[17px] text-board-ink2">
          Pagas en Wompi, la pasarela de Bancolombia. Los datos de tu tarjeta nunca pasan por CinemaPlus.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <section className="border border-board-line bg-board-panel p-5" aria-labelledby="wompi-title">
              <div className="mb-2 flex items-center gap-3">
                <LockClosedIcon className="h-6 w-6 text-board-okink" />
                <h2 id="wompi-title" className="font-board text-2xl font-bold tracking-wide uppercase">Pago seguro con Wompi</h2>
              </div>
              <p className="text-[15px] leading-relaxed text-board-ink2">
                Pulsa <strong className="text-board-ink">Pagar con Wompi</strong> y allí eliges cómo pagar. Al terminar vuelves aquí y ves tus boletas con su código QR.
              </p>
              <div className="mt-4 border-t border-board-line pt-4">
                <p id="wompi-methods" className="mb-2 font-data text-[11px] uppercase text-board-mute">Medios que acepta Wompi</p>
                <ul aria-labelledby="wompi-methods" className="flex flex-wrap gap-x-5 gap-y-2">
                  {WOMPI_METHODS.map(({ icon: Icon, name }) => (
                    <li key={name} className="flex select-none items-center gap-1.5 text-[15px] text-board-ink2">
                      <Icon className="h-4 w-4 shrink-0 text-board-mute" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {busy && (
              <section className="border border-board-amber/50 bg-board-panel p-5" aria-live="polite">
                <ol className="space-y-3">
                  {STAGES.map(({ id, label }, index) => {
                    const current = STAGES.findIndex(s => s.id === stage);
                    const state = index < current ? 'done' : index === current ? 'active' : 'todo';
                    return (
                      <li key={id} className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-[2px] font-data text-xs font-bold ${
                            state === 'done' ? 'bg-board-ok text-board-onamber' : state === 'active' ? 'bg-board-amber text-board-onamber motion-safe:animate-pulse' : 'border border-board-line2 text-board-mute'
                          }`}
                        >
                          {state === 'done' ? '✓' : index + 1}
                        </span>
                        <span className={`font-board text-xl font-semibold tracking-wide uppercase ${state === 'todo' ? 'text-board-mute' : 'text-board-ink'}`}>{label}</span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 font-data text-xs text-board-mute">No cierres esta ventana.</p>
              </section>
            )}

            <div className="flex items-start gap-3 border border-board-line p-4">
              <ShieldCheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-board-okink" />
              <div>
                <p className="font-medium">Tus sillas quedan apartadas mientras pagas</p>
                <p className="mt-0.5 text-sm text-board-mute">Si no completas el pago a tiempo, se liberan y no se cobra nada.</p>
              </div>
            </div>
          </div>

          {/* Tiquete */}
          <aside aria-label="Resumen de compra">
            <div className="b-stub p-5 lg:sticky lg:top-20" style={{ ['--stub-cut' as any]: '58%' }}>
              <div className="flex gap-3">
                <img
                  src={optimizeCloudinaryUrl(movie.images?.poster || movie.poster_url, 150)}
                  alt=""
                  className="h-24 w-16 border border-board-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-board text-2xl font-bold leading-none tracking-wide uppercase">{movie.title}</h3>
                  <div className="mt-2 space-y-0.5 font-data text-xs text-board-ink2">
                    <p>{theater.name}</p>
                    <p>{showtime.time} · {showtime.format}</p>
                    <p>{new Date(selectedDate).toLocaleDateString('es-CO')}</p>
                    {selectedSeats?.length > 0 && <p className="text-board-ink">Sillas {selectedSeats.join(', ')}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-dashed border-board-line2 pt-4 font-data text-sm" aria-live="polite">
                {quote.isPending && <p className="text-board-mute">Calculando el total…</p>}
                {quote.isError && (
                  <p role="alert" className="text-board-alarmink">No pudimos calcular el total. Vuelve atrás e intenta de nuevo.</p>
                )}
                {quote.data?.lines.map(line => (
                  <div key={`${line.kind}-${line.code}`} className="flex justify-between gap-3">
                    <span className="text-board-ink2">{line.quantity} × {line.description}</span>
                    <span className="shrink-0">{formatPrice(line.line_total)}</span>
                  </div>
                ))}
                <div className="flex items-baseline justify-between border-t border-dashed border-board-line2 pt-3">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-2xl font-bold text-board-amberink">{formatPrice(total)}</span>
                </div>
              </div>

              {paymentError && (
                <div role="alert" className="mt-4 border border-board-alarm bg-board-alarmbg p-3 text-sm">
                  <p className="font-board text-lg font-bold tracking-wide uppercase text-board-alarmink">No se pudo iniciar el pago</p>
                  <p className="mt-1 text-board-ink2">{paymentError}</p>
                </div>
              )}

              <PremiumButton onClick={handlePayment} disabled={busy || !quote.data} className="mt-5 w-full" size="lg">
                <LockClosedIcon className="h-5 w-5" />
                {busy ? 'Procesando…' : `Pagar con Wompi ${formatPrice(total)}`}
              </PremiumButton>

              {!isAuthenticated && (
                <p className="mt-3 text-center font-data text-xs text-board-amberink">Inicia sesión primero para completar el pago</p>
              )}

              <ul className="mt-4 space-y-1 text-xs text-board-mute">
                <li>Al continuar aceptas nuestros términos y condiciones.</li>
                <li>Válido solo para la función seleccionada.</li>
              </ul>
            </div>
          </aside>
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
