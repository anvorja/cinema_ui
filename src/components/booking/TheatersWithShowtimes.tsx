// src/components/booking/TheatersWithShowtimes.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, ChevronDownIcon, TicketIcon } from '@heroicons/react/24/outline';

import { GlassCard } from '../common';
import { useMovieShowtimes } from '../../hooks/useMovieShowtimes';
import { useBooking } from '../../hooks/useBooking';
import LoadingSpinner from '../common/LoadingSpinner';
import ShowtimeButton from './ShowtimeButton';

const TheatersWithShowtimes = ({ theaters, movieId, movie, canPurchase: _canPurchase, onShowtimeSelect, ..._rest }: { theaters: any; movieId: any; movie: any; canPurchase?: any; onShowtimeSelect?: (theater: any, showtime: any) => void; [key: string]: any }) => {
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const { showtimes, loading: showtimesLoading } = useMovieShowtimes(movieId);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [expandedTheater, setExpandedTheater] = useState(null);

  const handleTheaterClick = (theater) => {
    const isExpanded = expandedTheater === theater.id;
    setExpandedTheater(isExpanded ? null : theater.id);

    if (!isExpanded) {
      setSelectedTheater(theater);
    }
  };

  const handleShowtimeSelect = (theater, showtime) => {
    setSelectedShowtime(showtime);
    setSelectedTheater(theater);

    // Si hay un handler externo (ej: Drawer en MovieDetailPage), delegarle
    if (onShowtimeSelect) {
      onShowtimeSelect(theater, showtime);
      return;
    }

    const selectedDate = showtime.date ?? null;
    startBooking(movie, theater, showtime, selectedDate);

    navigate(`/booking/${movieId}/${theater.id}/${showtime.id}`, {
      state: {
        movie: movie,
        theater: theater,
        showtime: showtime,
        selectedDate: selectedDate
      }
    });
  };

  if (!theaters || theaters.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Teatros y Horarios Disponibles
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {theaters.map((theater) => {
            const theaterShowtimes = showtimes[theater.id];
            const isExpanded = expandedTheater === theater.id;
            const hasShowtimes = theaterShowtimes?.times?.length > 0;

            return (
              <GlassCard key={theater.id} className="overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                  onClick={() => handleTheaterClick(theater)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <MapPinIcon className="w-8 h-8 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-semibold text-xl mb-1">
                          {theater.name || theaterShowtimes.theaterName || `Teatro ${theater.id}`}
                        </h3>
                        <p className="text-white/70 text-sm mb-2">
                          {theater.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-400">
                            Capacidad: {theater.capacity}
                          </span>
                          <span className="text-blue-400">
                            {theaterShowtimes?.times?.length || 0} horarios
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {showtimesLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <span className="text-white/60 text-sm">
                            {isExpanded ? 'Ocultar' : 'Ver'} horarios
                          </span>
                          <ChevronDownIcon className={`
                            w-5 h-5 text-white/60 transform transition-transform duration-200
                            ${isExpanded ? 'rotate-180' : ''}
                          `} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sección expandible de horarios */}
                <div className={`
                  transition-all duration-300 overflow-hidden
                  ${isExpanded ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-6 pb-5 border-t border-white/10">
                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white/90 text-sm font-semibold flex items-center gap-2">
                          Hoy ·
                          <span className="text-white/50 font-normal">
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </span>
                        </h4>
                        {hasShowtimes && (
                          <span className="text-xs text-white/40">
                            {theaterShowtimes.times.filter(t => t.available).length} funciones disponibles
                          </span>
                        )}
                      </div>

                      {showtimesLoading ? (
                        <div className="flex items-center gap-3 py-6">
                          <LoadingSpinner size="sm" />
                          <p className="text-white/50 text-sm">Cargando horarios...</p>
                        </div>
                      ) : hasShowtimes ? (
                        <div
                          className="overflow-y-auto pr-1"
                          style={{ maxHeight: '280px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
                        >
                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                            {theaterShowtimes.times.map((showtime) => (
                              <ShowtimeButton
                                key={showtime.id}
                                showtime={showtime}
                                onSelect={(st) => handleShowtimeSelect(theater, st)}
                                isSelected={
                                  selectedShowtime?.id === showtime.id &&
                                  selectedTheater?.id === theater.id
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <TicketIcon className="w-10 h-10 text-white/20" />
                          <p className="text-white/50 text-sm">Sin funciones disponibles hoy</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Información general */}
        <div className="max-w-2xl mx-auto mt-8">
          <GlassCard className="p-6 text-center">
            <h3 className="text-white font-semibold mb-2">
              Información sobre horarios
            </h3>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Los horarios se actualizan en tiempo real</p>
              <p>• Precios pueden variar según formato (IMAX, 3D, etc.)</p>
              <p>• Selecciona un horario para continuar con tu reserva</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default TheatersWithShowtimes;