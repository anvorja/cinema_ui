// src/components/booking/TheatersWithShowtimes.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, ChevronDownIcon, TicketIcon } from '@heroicons/react/24/outline';

import { GlassCard } from '../ui';
import { useMovieShowtimes } from '../../hooks/useMovieShowtimes';
import { useBooking } from '../../hooks/useBooking';
import LoadingSpinner from '../ui/LoadingSpinner';
import ShowtimeButton from './ShowtimeButton';

const TheatersWithShowtimes = ({ theaters, movieId, movie }) => {
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

    // Inicializar booking en el contexto
    const selectedDate = new Date().toISOString().split('T')[0];
    startBooking(movie, theater, showtime, selectedDate);

    // Navegar usando tu ruta con parámetros dinámicos
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
                          {theater.name}
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
                  ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-6 pb-6 border-t border-white/10">
                    <div className="pt-4">
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <span>Horarios disponibles para hoy</span>
                        <span className="text-sm text-white/60">
                          ({new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })})
                        </span>
                      </h4>

                      {showtimesLoading ? (
                        <div className="text-center py-8">
                          <LoadingSpinner />
                          <p className="text-white/60 mt-2">Cargando horarios...</p>
                        </div>
                      ) : hasShowtimes ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

                          {/* Información adicional del teatro */}
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/70">
                                Horarios disponibles: {theaterShowtimes.times.filter(t => t.available).length}
                              </span>
                              <span className="text-white/70">
                                Formatos: {[...new Set(theaterShowtimes.times.map(t => t.format))].join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-white/40 mb-2">
                            <TicketIcon className="w-12 h-12 mx-auto mb-2" />
                          </div>
                          <p className="text-white/60">No hay horarios disponibles para hoy</p>
                          <p className="text-white/40 text-sm mt-1">
                            Revisa mañana o selecciona otro teatro
                          </p>
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