// src/pages/SeatSelectionPage.jsx
import { useState, useCallback, useEffect } from 'react';
import api from '../services/api.js';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  MapPinIcon, ComputerDesktopIcon, CalendarDaysIcon,
  ClockIcon, ArrowLeftIcon, TicketIcon,
} from '@heroicons/react/24/outline';
import CinemaSeatMap, { LAYOUT } from '../components/seats/CinemaSeatMap';
import { useBooking } from '../hooks/useBooking';
import { useMovieShowtimes } from '../hooks/useMovieShowtimes';
import BookingSteps from '../components/board/BookingSteps';
import { optimizeCloudinaryUrl } from '../utils/movieUtils';
import { isPreferentialSeat, usePricing } from '../hooks/usePricing';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      month: 'short', day: 'numeric'
    });
  } catch { return dateStr; }
};

const seatLabel = (id) => id;


// ── Component ─────────────────────────────────────────────────────────────────
const SeatSelectionPage = () => {
  const navigate  = useNavigate();
  const { movieId, theaterId, showtimeId } = useParams();
  const { bookingData } = useBooking();
  const { getShowtimeById } = useMovieShowtimes(movieId);

  const state = useLocation().state || {};
  const movie    = state.movie    || bookingData.movie;
  const theater  = state.theater  || bookingData.theater;
  const rawShowtime = state.showtime || bookingData.showtime;
  const selectedDate = state.selectedDate || bookingData.selectedDate;

  // Garantizar que showtime.id siempre sea el ID real del URL param.
  // Si el objeto viene sin id (fallback, recarga de página, etc.) lo inyectamos.
  const showtimeIdNum = Number(showtimeId) || null;
  const showtime = {
    ...(rawShowtime || getShowtimeById(theaterId, showtimeId) || { time: '', format: '2D Doblada' }),
    id: rawShowtime?.id || showtimeIdNum,
  };

  // Selected seats: Set of seat IDs — pre-populated if coming back from TicketConfirmPage
  const [selectedSeats, setSelectedSeats] = useState(() => new Set(state.selectedSeats || []));
  // Qué filas son preferenciales lo decide el backend (PREFERENTIAL_ROWS).
  const { data: pricing } = usePricing(movie?.id);

  // Occupied seats fetched from backend (already sold for this showtime)
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());

  // Extraer show_date e show_time para la consulta de asientos ocupados.
  // Priorizamos showtime.date (fecha real del backend) sobre selectedDate
  // que en TheatersWithShowtimes queda fijo en "hoy" y puede no coincidir
  // con la fecha real de la función almacenada en la compra.
  const showDateStr = (() => {
    const raw = showtime?.date || selectedDate;
    if (!raw) return null;
    if (typeof raw === 'string') return raw.split('T')[0];
    if (raw instanceof Date) return raw.toISOString().split('T')[0];
    if (raw?.date) return String(raw.date).split('T')[0];
    return null;
  })();
  const showTimeStr = showtime?.time || null;

  useEffect(() => {
    if (!showtimeId) return;
    const params = new URLSearchParams();
    if (movieId)      params.append('movie_id',  movieId);
    if (showDateStr)  params.append('show_date', showDateStr);
    if (showTimeStr)  params.append('show_time', showTimeStr);
    const query = params.toString() ? `?${params.toString()}` : '';

    const fetchOccupied = () => {
      api.get(`/purchases/showtimes/${showtimeId}/occupied-seats${query}`)
        .then(res => {
          const seats = res.data?.seats || [];
          const nowOccupied = new Set(seats);
          // Deselect any seat the user had picked that is now occupied
          setSelectedSeats(sel => {
            const next = new Set(sel);
            sel.forEach(id => { if (nowOccupied.has(id)) next.delete(id); });
            return next;
          });
          setOccupiedSeats(nowOccupied);
        })
        .catch(() => {});
    };
    fetchOccupied();
    const interval = setInterval(fetchOccupied, 20000); // refresca cada 20 s
    return () => clearInterval(interval);
  }, [showtimeId, movieId, showDateStr, showTimeStr]);

  const handleToggle = useCallback((id) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (!movie || !theater) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-[#c3bfb2]">No encontramos la información de tu reserva.</p>
          <button
            onClick={() => navigate('/')}
            className="h-12 rounded-[3px] bg-[#f2b705] px-6 font-board text-lg font-bold tracking-[0.08em] text-[#0c0c0d]"
          >
            VOLVER A LA CARTELERA
          </button>
        </div>
      </div>
    );
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedList = [...selectedSeats]
    .map(seatLabel)
    .filter(Boolean)
    .sort();

  const prefCount = [...selectedSeats].filter(
    id => isPreferentialSeat(String(id), pricing?.preferential_rows)
  ).length;
  const generalCount = selectedSeats.size - prefCount;

  const handleContinue = () => {
    if (selectedSeats.size === 0 || !pricing) return;
    navigate('/booking/tickets', {
      state: {
        movie, theater, showtime, selectedDate,
        selectedSeats: [...selectedSeats],
        generalCount,
        prefCount,
      }
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const poster = optimizeCloudinaryUrl(movie.images?.poster || movie.posterImage || '', 300);
  const title  = movie.title || '';
  const format = showtime.format || '2D Doblada';
  const time   = showtime.time   || '';
  const theaterName = theater.name || '';
  const dateLabel = formatDate(typeof selectedDate === 'string' ? selectedDate : selectedDate?.date);
  const ageRating  = movie.ageRating || movie.age_rating || '';

  const money = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  const ticketsTotal = pricing
    ? generalCount * pricing.ticket_prices.general + prefCount * pricing.ticket_prices.preferential
    : null;

  return (
    <div className="pb-32">
      <BookingSteps current="Sillas" />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Tiquete de la función */}
        <div className="b-stub mb-8 grid grid-cols-[72px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:p-5">
          {poster && <img src={poster} alt={`Póster de ${title}`} className="aspect-[2/3] w-full border border-[#2c2c30] object-cover" />}
          <div className="min-w-0">
            <h2 className="font-board text-3xl font-bold leading-none tracking-wide uppercase text-[#f4f1e8] sm:text-4xl">{title}</h2>
            <p className="mt-1 font-data text-xs text-[#8f8b80]">{[format, ageRating].filter(Boolean).join(' · ')}</p>

            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-dashed border-[#46464c] pt-3 sm:grid-cols-4">
              <div><dt className="font-data text-[10px] uppercase text-[#8f8b80]">Cine</dt><dd className="mt-1 font-data text-sm font-bold">{theaterName}</dd></div>
              <div><dt className="font-data text-[10px] uppercase text-[#8f8b80]">Sala</dt><dd className="mt-1 font-data text-sm font-bold">{showtime?.hall_number || 1}</dd></div>
              <div><dt className="font-data text-[10px] uppercase text-[#8f8b80]">Fecha</dt><dd className="mt-1 font-data text-sm font-bold">{dateLabel || 'Hoy'}</dd></div>
              <div><dt className="font-data text-[10px] uppercase text-[#8f8b80]">Hora</dt><dd className="mt-1 font-data text-sm font-bold text-[#f2b705]">{time || '—'}</dd></div>
            </dl>
          </div>
        </div>

        <h1 className="mb-4 font-board text-3xl font-bold tracking-[0.06em] uppercase">Elige tus sillas</h1>

        <CinemaSeatMap
          selectedSeats={selectedSeats}
          onToggle={handleToggle}
          occupiedSeats={occupiedSeats}
        />
      </div>

      {/* Tiquete en construcción */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#46464c] bg-[#0c0c0d]">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-14 w-12 shrink-0 items-center justify-center rounded-[3px] border border-[#46464c] text-[#c3bfb2] hover:border-[#f4f1e8] hover:text-[#f4f1e8] sm:w-auto sm:gap-2 sm:px-4"
            aria-label="Volver"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="hidden font-board text-lg font-bold tracking-[0.08em] sm:inline">ATRÁS</span>
          </button>

          <div className="min-w-0 flex-1" aria-live="polite">
            {selectedList.length > 0 ? (
              <>
                <p className="truncate font-data text-sm font-bold text-[#f4f1e8]">{selectedList.join(' · ')}</p>
                <p className="font-data text-xs text-[#8f8b80]">
                  {selectedList.length} {selectedList.length === 1 ? 'silla' : 'sillas'}{ticketsTotal !== null ? ` · ${money(ticketsTotal)}` : ''}
                </p>
              </>
            ) : (
              <p className="font-data text-sm text-[#8f8b80]">Toca una silla libre para empezar</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedSeats.size === 0 || !pricing}
            className="flex h-14 shrink-0 items-center gap-2 rounded-[3px] bg-[#f2b705] px-5 font-board text-lg font-bold tracking-[0.08em] text-[#0c0c0d] hover:bg-[#d9a304] disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
