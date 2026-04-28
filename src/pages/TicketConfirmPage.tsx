// src/pages/TicketConfirmPage.jsx
// Step 2: User confirms how many tickets of each type to actually purchase
// (can reduce from what was selected, but not exceed it)
import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPinIcon, ComputerDesktopIcon, CalendarDaysIcon,
  ClockIcon, TicketIcon, ArrowLeftIcon, MinusIcon, PlusIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
};

const GENERAL_PRICE     = 22_800;
const PREFERENCIAL_PRICE = 28_500;
const SERVICE_FEE_PER    = 0; // no service fee line in PDF for this screen

const CounterRow = ({ label, subtitle, price, count, max, onDecrement, onIncrement }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="min-w-0 flex-1 pr-2">
      <p className="font-medium text-gray-800 text-sm sm:text-base">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{subtitle}</p>
    </div>
    <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
      <span className="text-gray-700 font-medium w-14 sm:w-24 text-right text-sm sm:text-base">
        {formatCOP(price)}
      </span>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onDecrement}
          disabled={count <= 0}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center
                     text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <MinusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
        <span className="w-5 sm:w-6 text-center font-semibold text-gray-800 text-sm">{count}</span>
        <button
          onClick={onIncrement}
          disabled={count >= max}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300 flex items-center justify-center
                     text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
      <span className="text-gray-700 font-medium w-14 sm:w-24 text-right text-sm sm:text-base">
        {formatCOP(price * count)}
      </span>
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

  const totalSelected = genQty + prefQty;
  const subtotal      = genQty * GENERAL_PRICE + prefQty * PREFERENCIAL_PRICE;
  const total         = subtotal;

  // Desfase crítico: boletas confirmadas < sillas físicamente seleccionadas
  const maxSelected = generalCount + prefCount;
  const mismatch    = totalSelected > 0 && totalSelected < maxSelected;

  const selectedSeatLabels = useMemo(
    () => selectedSeats.filter(id => !id.includes('wc')).sort().join(', '),
    [selectedSeats]
  );

  const poster      = movie?.images?.poster || movie?.posterImage || '';
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
    if (totalSelected === 0 || mismatch) return;
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
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Info card ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex gap-4 items-start">
            {poster && (
              <img src={poster} alt={title}
                className="w-16 h-24 object-cover rounded-lg shadow flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-2">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {movie.ageRating && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {movie.ageRating}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mb-3">
                {format.split(' ').map((tag, i) => (
                  <span key={i} className="text-[11px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Multiplex</div>
                    <div className="font-medium text-gray-800 text-xs">{theaterName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <ComputerDesktopIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Sala</div>
                    <div className="font-medium text-gray-800 text-xs">
                      {theater.room_name || theater.sala || 'SALA 1'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Fecha y horario</div>
                    <div className="font-medium text-gray-800 text-xs">{dateLabel} {time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">Duración</div>
                    <div className="font-medium text-gray-800 text-xs">
                      {movie.duration_formatted || movie.duration || '–'}
                    </div>
                  </div>
                </div>
                {selectedSeatLabels && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <TicketIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase">Sillas</div>
                      <div className="font-medium text-gray-800 text-xs">{selectedSeatLabels}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Ticket type selection ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Seleccione sus boletas</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              mismatch
                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                : 'bg-gray-100 text-gray-500'
            }`}>
              Las boletas han sido elegidas {totalSelected}/{maxSelected}
            </span>
          </div>

          {/* Table header */}
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wide mb-2">
            <span className="flex-1 pr-2">Concepto</span>
            <span className="w-14 sm:w-24 text-right">Precio</span>
            <span className="w-20 sm:w-32 text-center">Cantidad</span>
            <span className="w-14 sm:w-24 text-right">Subtotal</span>
          </div>

          {generalCount > 0 && (
            <CounterRow
              label="Silla General"
              subtitle="Pagando con PSE - Tarjeta de Débito / Crédito"
              price={GENERAL_PRICE}
              count={genQty}
              max={generalCount}
              onDecrement={() => setGenQty(q => Math.max(0, q - 1))}
              onIncrement={() => setGenQty(q => Math.min(generalCount, q + 1))}
            />
          )}

          {prefCount > 0 && (
            <CounterRow
              label="Silla Preferencial"
              subtitle="Pagando con PSE - Tarjeta de Débito / Crédito"
              price={PREFERENCIAL_PRICE}
              count={prefQty}
              max={prefCount}
              onDecrement={() => setPrefQty(q => Math.max(0, q - 1))}
              onIncrement={() => setPrefQty(q => Math.min(prefCount, q + 1))}
            />
          )}

          {/* ── Mismatch warning ─────────────────────────────────────────────── */}
          {mismatch && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  La cantidad de boletas no coincide con las sillas seleccionadas
                </p>
                <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
                  <li>Su conteo de boletas seleccionadas es menor que el conteo de sillas.</li>
                  <li>Sus boletas seleccionadas no coinciden con las sillas seleccionadas.</li>
                </ul>
                <p className="text-xs text-amber-600 mt-2">
                  Vuelva al mapa de sillas y deseleccione la(s) silla(s) sobrante(s), o aumente la cantidad de boletas a <strong>{maxSelected}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Valor por servicio</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
              <span>Total</span>
              <span>{formatCOP(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────────── */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              const showtimePart = showtime?.id ? `/${showtime.id}` : '';
              navigate(`/booking/${movie?.id}/${theater?.id}${showtimePart}`, {
                state: { movie, theater, showtime, selectedDate, selectedSeats },
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full
                       text-white/90 hover:bg-white/10 transition-colors font-medium text-sm backdrop-blur-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Atrás
          </button>

          <button
            onClick={handleContinue}
            disabled={totalSelected === 0 || mismatch}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white rounded-full
                       hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors font-semibold text-sm"
          >
            Siguiente
            <span className="text-blue-200">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmPage;
