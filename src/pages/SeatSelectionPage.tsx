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

// Determine if a seat is general or preferencial from the layout
const seatTypeFromId = (id) => {
  const row = id[0];
  const prefRows = ['K','L','M','N','O','P'];
  return prefRows.includes(row) ? 'preferencial' : 'general';
};

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

  // Selected seats: Set of seat IDs
  const [selectedSeats, setSelectedSeats] = useState(new Set());

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se encontró información de la reserva.</p>
          <button
            onClick={() => navigate('/cartelera')}
            className="px-6 py-2 bg-blue-700 text-white rounded-full"
          >
            Volver a Cartelera
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

  const generalCount = [...selectedSeats].filter(
    id => seatTypeFromId(id) === 'general'
  ).length;
  const prefCount = [...selectedSeats].filter(
    id => seatTypeFromId(id) === 'preferencial'
  ).length;

  const handleContinue = () => {
    if (selectedSeats.size === 0) return;
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
  const poster = movie.images?.poster || movie.posterImage || '';
  const title  = movie.title || '';
  const format = showtime.format || '2D Doblada';
  const time   = showtime.time   || '';
  const theaterName = theater.name || '';
  const dateLabel = formatDate(typeof selectedDate === 'string' ? selectedDate : selectedDate?.date);
  const ageRating  = movie.ageRating || movie.age_rating || '';

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ── Info card ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex gap-4 items-start">
            {poster && (
              <img src={poster} alt={title}
                className="w-16 h-24 object-cover rounded-lg shadow flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {ageRating && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                    {ageRating}
                  </span>
                )}
              </div>

              {/* Format badges */}
              <div className="flex gap-2 mb-3">
                {format.split(' ').map((tag, i) => (
                  <span key={i}
                    className="text-[11px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MapPinIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Multiplex</div>
                    <div className="font-medium text-gray-800 text-xs">{theaterName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-600">
                  <ComputerDesktopIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Sala</div>
                    <div className="font-medium text-gray-800 text-xs">
                      SALA {showtime?.hall_number || 1}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-600">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Fecha y horario</div>
                    <div className="font-medium text-gray-800 text-xs">
                      {dateLabel} {time && `${time} P.M.`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-600">
                  <ClockIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">Duración</div>
                    <div className="font-medium text-gray-800 text-xs">
                      {movie.duration_formatted || movie.duration || '–'}
                    </div>
                  </div>
                </div>

                {selectedList.length > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-600 col-span-2 sm:col-span-4">
                    <TicketIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">Sillas</div>
                      <div className="font-medium text-gray-800 text-xs">
                        {selectedList.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Seat selection title ───────────────────────────────────────────── */}
        <h1 className="text-2xl font-bold text-white mb-4">Seleccione sus sillas</h1>

        {/* ── Seat map ───────────────────────────────────────────────────────── */}
        <CinemaSeatMap
          selectedSeats={selectedSeats}
          onToggle={handleToggle}
          occupiedSeats={occupiedSeats}
        />

        {/* ── Navigation ─────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full text-white/90 hover:bg-white/10 transition-colors font-medium text-sm backdrop-blur-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Atrás
          </button>

          <button
            onClick={handleContinue}
            disabled={selectedSeats.size === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white rounded-full
                       hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors font-semibold text-sm"
          >
            Seleccionar boletas
            <span className="text-blue-200">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
