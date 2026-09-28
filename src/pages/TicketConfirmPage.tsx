// src/pages/TicketConfirmPage.jsx
// Step 2: User confirms how many tickets of each type to actually purchase
// (can reduce from what was selected, but not exceed it)
import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { optimizeCloudinaryUrl } from '../utils/movieUtils';
import { usePricing } from '../hooks/usePricing';
import { ArrowLeftIcon, MinusIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import BookingSteps from '../components/board/BookingSteps';
import FunctionStub from '../components/board/FunctionStub';

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
};


const stepBtn = 'flex h-11 w-11 items-center justify-center rounded-[3px] border border-[#46464c] text-[#f4f1e8] hover:border-[#f2b705] disabled:cursor-not-allowed disabled:opacity-30';

const CounterRow = ({ label, subtitle, price, count, max, onDecrement, onIncrement }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2c2c30] py-4 last:border-0">
    <div className="min-w-0 flex-1 basis-40">
      <p className="font-board text-2xl font-bold leading-none tracking-wide uppercase">{label}</p>
      <p className="mt-1 font-data text-xs text-[#8f8b80]">{subtitle}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="hidden w-24 text-right font-data text-sm text-[#c3bfb2] sm:block">{formatCOP(price)}</span>
      <div className="flex items-center gap-1" role="group" aria-label={`Cantidad de ${label}`}>
        <button type="button" onClick={onDecrement} disabled={count <= 0} className={stepBtn} aria-label={`Quitar una ${label}`}>
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-9 text-center font-data text-xl font-bold" aria-live="polite">{count}</span>
        <button type="button" onClick={onIncrement} disabled={count >= max} className={stepBtn} aria-label={`Agregar una ${label}`}>
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <span className="w-24 text-right font-data text-base font-bold">{formatCOP(price * count)}</span>
    </div>
  </div>
);

const TicketConfirmPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    movie, theater, showtime, selectedDate,
    selectedSeats = [],
    generalCount  = 0,
    prefCount     = 0,
  } = state || {};

  const [genQty,  setGenQty]  = useState(generalCount);
  const [prefQty, setPrefQty] = useState(prefCount);
  // Precios del backend: General = precio de la película, Preferencial = + recargo.
  const { data: pricing } = usePricing(movie?.id);
  const GENERAL_PRICE      = pricing?.ticket_prices.general ?? 0;
  const PREFERENCIAL_PRICE = pricing?.ticket_prices.preferential ?? 0;

  const totalSelected = genQty + prefQty;
  const subtotal      = genQty * GENERAL_PRICE + prefQty * PREFERENCIAL_PRICE;
  const total         = subtotal;

  // Desfase: boletas confirmadas DEBEN ser exactamente iguales a sillas seleccionadas
  const maxSelected = generalCount + prefCount;
  const mismatch    = totalSelected !== maxSelected;

  const selectedSeatLabels = useMemo(
    () => selectedSeats.filter(id => !id.includes('wc')).sort().join(', '),
    [selectedSeats]
  );

  const poster      = optimizeCloudinaryUrl(movie?.images?.poster || movie?.posterImage || '', 400);
  const title       = movie?.title || '';
  const format      = showtime?.format || '2D Doblada';
  const time        = showtime?.time || '';
  const theaterName = theater?.name || '';
  const dateLabel   = formatDate(typeof selectedDate === 'string' ? selectedDate : selectedDate?.date);

  if (!movie || !theater) {
    navigate('/cartelera');
    return null;
  }

  const handleContinue = () => {
    if (totalSelected === 0 || mismatch || !pricing) return;
    navigate('/booking/food', {
      state: {
        movie, theater, showtime, selectedDate,
        selectedSeats,
        generalCount: genQty,
        prefCount: prefQty,
        ticketCount: totalSelected,
        subtotal,
        totalAmount: total,
      }
    });
  };

  return (
    <div className="pb-32">
      <BookingSteps current="Boletas" />

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <FunctionStub
          poster={poster}
          title={title}
          format={format}
          ageRating={movie.ageRating}
          theaterName={theaterName}
          hall={showtime?.hall_number || theater.room_name || theater.sala || 1}
          date={dateLabel}
          time={time}
          seats={selectedSeatLabels}
        />

        <section className="mt-8" aria-labelledby="boletas-titulo">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <h1 id="boletas-titulo" className="font-board text-3xl font-bold tracking-[0.06em] uppercase">Confirma tus boletas</h1>
            <span className={`b-tag ${mismatch ? 'b-tag--alarm' : 'b-tag--ok'}`}>
              {totalSelected} de {maxSelected} boletas
            </span>
          </div>

          <div className="border-t border-[#46464c]">
            {generalCount > 0 && (
              <CounterRow
                label="Silla general"
                subtitle="Se paga en Wompi: PSE, tarjeta, Nequi o Bancolombia"
                price={GENERAL_PRICE}
                count={genQty}
                max={generalCount}
                onDecrement={() => setGenQty(q => Math.max(0, q - 1))}
                onIncrement={() => setGenQty(q => Math.min(generalCount, q + 1))}
              />
            )}

            {prefCount > 0 && (
              <CounterRow
                label="Silla preferencial"
                subtitle="Se paga en Wompi: PSE, tarjeta, Nequi o Bancolombia"
                price={PREFERENCIAL_PRICE}
                count={prefQty}
                max={prefCount}
                onDecrement={() => setPrefQty(q => Math.max(0, q - 1))}
                onIncrement={() => setPrefQty(q => Math.min(prefCount, q + 1))}
              />
            )}
          </div>

          {mismatch && (
            <div className="mt-4 flex items-start gap-3 border border-[#d9412b] bg-[#1d1210] p-4" role="alert">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#f0644d]" />
              <div className="min-w-0 flex-1">
                <p className="font-board text-xl font-bold tracking-wide uppercase text-[#f0644d]">Las boletas no coinciden con tus sillas</p>
                <p className="mt-1 text-[15px] text-[#c3bfb2]">
                  Elegiste {maxSelected} {maxSelected === 1 ? 'silla' : 'sillas'}. Sube la cantidad de boletas a {maxSelected} o vuelve al mapa y quita las sillas que sobran.
                </p>
              </div>
            </div>
          )}

          <dl className="mt-6 space-y-1 border-t border-[#2c2c30] pt-4 font-data text-sm">
            <div className="flex justify-between text-[#c3bfb2]"><dt>Subtotal</dt><dd>{formatCOP(subtotal)}</dd></div>
            <div className="flex justify-between text-[#c3bfb2]"><dt>Valor por servicio</dt><dd>$0</dd></div>
            <div className="flex justify-between pt-2 text-lg font-bold text-[#f4f1e8]"><dt>Total</dt><dd className="text-[#f2b705]">{formatCOP(total)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#46464c] bg-[#0c0c0d]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              const showtimePart = showtime?.id ? `/${showtime.id}` : '';
              navigate(`/booking/${movie?.id}/${theater?.id}${showtimePart}`, {
                state: { movie, theater, showtime, selectedDate, selectedSeats },
              });
            }}
            className="flex h-14 items-center gap-2 rounded-[3px] border border-[#46464c] px-4 text-[#c3bfb2] hover:border-[#f4f1e8] hover:text-[#f4f1e8]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-board text-lg font-bold tracking-[0.08em]">ATRÁS</span>
          </button>
          <div className="min-w-0 flex-1 text-right font-data">
            <p className="text-xs text-[#8f8b80]">Total boletas</p>
            <p className="text-lg font-bold text-[#f2b705]">{formatCOP(total)}</p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={totalSelected === 0 || mismatch || !pricing}
            className="h-14 rounded-[3px] bg-[#f2b705] px-6 font-board text-lg font-bold tracking-[0.08em] text-[#0c0c0d] hover:bg-[#d9a304] disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
          >
            SIGUIENTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmPage;
