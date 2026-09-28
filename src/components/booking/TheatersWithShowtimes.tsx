// src/components/booking/TheatersWithShowtimes.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, TicketIcon } from '@heroicons/react/24/outline';

import { useMovieShowtimes } from '../../hooks/useMovieShowtimes';
import { useBooking } from '../../hooks/useBooking';
import useAuth from '../../hooks/useAuth';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import LoadingSpinner from '../common/LoadingSpinner';
import ShowtimeButton from './ShowtimeButton';

const TheatersWithShowtimes = ({ theaters, movieId, movie, canPurchase: _canPurchase, onShowtimeSelect, ..._rest }: { theaters: any; movieId: any; movie: any; canPurchase?: any; onShowtimeSelect?: (theater: any, showtime: any) => void; [key: string]: any }) => {
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const { isAuthenticated } = useAuth();
  const { showtimes, loading: showtimesLoading } = useMovieShowtimes(movieId);

  // If the theaters prop is empty, derive theater list from showtimes data
  const effectiveTheaters = useMemo(() => {
    if (theaters && theaters.length > 0) return theaters;
    return Object.entries(showtimes).map(([tid, data]: [string, any]) => ({
      id: Number(tid),
      name: data.theaterName || `Teatro ${tid}`,
      location: '',
      capacity: data.times?.[0]?.capacity ?? 100,
    }));
  }, [theaters, showtimes]);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [expandedTheater, setExpandedTheater] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ theater: any; showtime: any } | null>(null);

  // Cuando el usuario se autentica con un booking pendiente, continuar el flujo
  useEffect(() => {
    if (isAuthenticated && pendingBooking) {
      proceedToBooking(pendingBooking.theater, pendingBooking.showtime);
      setPendingBooking(null);
    }
  }, [isAuthenticated]);

  const proceedToBooking = (theater, showtime) => {
    if (onShowtimeSelect) {
      onShowtimeSelect(theater, showtime);
      return;
    }
    const selectedDate = showtime.date ?? null;
    startBooking(movie, theater, showtime, selectedDate);
    navigate(`/booking/${movieId}/${theater.id}/${showtime.id}`, {
      state: { movie, theater, showtime, selectedDate }
    });
  };

  const handleShowtimeSelect = (theater, showtime) => {
    setSelectedShowtime(showtime);
    setSelectedTheater(theater);

    if (!isAuthenticated) {
      setPendingBooking({ theater, showtime });
      setShowLoginModal(true);
      return;
    }

    proceedToBooking(theater, showtime);
  };

  if (!showtimesLoading && effectiveTheaters.length === 0) {
    return null;
  }

  return (
    <>
    <section className="pb-6" aria-label="Horarios por cine">
      {showtimesLoading && effectiveTheaters.length === 0 && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Consultando funciones" />
        </div>
      )}

      <div className="max-w-5xl space-y-5">
        {effectiveTheaters.map((theater) => {
          const theaterShowtimes = showtimes[theater.id];
          const isExpanded = expandedTheater === theater.id || (expandedTheater === null && effectiveTheaters[0]?.id === theater.id);
          const hasShowtimes = theaterShowtimes?.times?.length > 0;
          const panelId = `theater-${theater.id}`;

          return (
            <div key={theater.id} className="border border-board-line bg-board-panel">
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => setExpandedTheater(isExpanded ? -1 : theater.id)}
                className="flex min-h-[64px] w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-board-panel2"
              >
                <span className="min-w-0">
                  <span className="block truncate font-board text-2xl font-bold tracking-wide uppercase text-board-ink">
                    {theater.name || theaterShowtimes?.theaterName || `Teatro ${theater.id}`}
                  </span>
                  {theater.location && <span className="mt-0.5 block truncate text-sm text-board-mute">{theater.location}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-3 font-data text-xs text-board-ink2">
                  {showtimesLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span>{theaterShowtimes?.times?.length || 0} funciones</span>
                      <ChevronDownIcon className={`h-5 w-5 ${isExpanded ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </span>
              </button>

              {isExpanded && (
                <div id={panelId} className="border-t border-board-line2">
                  <div className="flex items-center justify-between px-4 py-2 font-data text-xs text-board-mute">
                    <span className="uppercase">
                      Hoy · {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    {hasShowtimes && <span>{theaterShowtimes.times.filter(t => t.available).length} con sillas</span>}
                  </div>

                  {showtimesLoading ? (
                    <div className="flex items-center gap-3 px-4 py-6">
                      <LoadingSpinner size="sm" text="Cargando horarios" />
                    </div>
                  ) : hasShowtimes ? (
                    <>
                      <div className="hidden grid-cols-[96px_110px_80px_130px_minmax(0,1fr)_auto] gap-x-5 border-y border-board-line px-4 py-1.5 font-data text-[11px] uppercase text-board-mute sm:grid" aria-hidden="true">
                        <span>Hora</span><span>Formato</span><span>Sala</span><span>Sillas</span><span /><span className="text-right">Boleta</span>
                      </div>
                      <ul className="max-h-[420px] divide-y divide-board-line overflow-y-auto">
                        {theaterShowtimes.times.map((showtime) => (
                          <li key={showtime.id}>
                            <ShowtimeButton
                              showtime={showtime}
                              onSelect={(st) => handleShowtimeSelect(theater, st)}
                              isSelected={selectedShowtime?.id === showtime.id && selectedTheater?.id === theater.id}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                      <TicketIcon className="h-8 w-8 text-board-mute" />
                      <p className="font-board text-xl font-semibold tracking-wide uppercase text-board-ink2">Sin funciones hoy</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 max-w-5xl text-sm text-board-mute">
        Los horarios se actualizan en tiempo real. El precio puede variar según el formato (IMAX, 3D). Elige una función para escoger tus sillas.
      </p>
    </section>

      {/* Modales de autenticación para gate de horario */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
      />
    </>
  );
};

export default TheatersWithShowtimes;