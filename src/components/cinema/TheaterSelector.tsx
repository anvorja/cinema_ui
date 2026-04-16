// src/components/cinema/TheaterSelector.jsx
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton } from '../common';

const TheaterSelector = ({
  theaters = [],
  selectedDate,
  onShowtimeSelect,
  selectedTheater,
  selectedShowtime
}) => {
  const [expandedTheaters, setExpandedTheaters] = useState(new Set([theaters[0]?.id]));

  const toggleTheater = (theaterId) => {
    const newExpanded = new Set(expandedTheaters);
    if (newExpanded.has(theaterId)) {
      newExpanded.delete(theaterId);
    } else {
      newExpanded.add(theaterId);
    }
    setExpandedTheaters(newExpanded);
  };

  // Generate dates for the week
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      id: i + 1,
      date: date,
      dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">FUNCIONES POR MULTIPLEX</h3>
        <PremiumButton variant="ghost" size="sm">
          <span className="flex items-center gap-2">
            Filtros
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2V11.414a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </span>
        </PremiumButton>
      </div>

      {/* Date Selector */}
      <GlassCard variant="premium" className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <button
              key={date.id}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-[60px] ${
                selectedDate?.id === date.id
                  ? 'bg-blue-600 text-white'
                  : 'glass-hover text-white/80 hover:text-white'
              }`}
            >
              <span className="text-xs font-medium">{date.dayName}</span>
              <span className="text-lg font-bold">{date.dayNumber}</span>
              <span className="text-xs">{date.monthName}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Theaters List */}
      <div className="space-y-4">
        {theaters.map((theater) => (
          <TheaterCard
            key={theater.id}
            theater={theater}
            isExpanded={expandedTheaters.has(theater.id)}
            onToggle={() => toggleTheater(theater.id)}
            onShowtimeSelect={onShowtimeSelect}
            selectedShowtime={selectedShowtime}
            selectedTheater={selectedTheater}
          />
        ))}
      </div>
    </div>
  );
};

const TheaterCard = ({
  theater,
  isExpanded,
  onToggle,
  onShowtimeSelect,
  selectedShowtime,
  selectedTheater
}) => {
  return (
    <GlassCard variant="premium" className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-white">{theater.name}</h4>
            <p className="text-white/70 text-sm">{theater.location}</p>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-white" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-white" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-white/10 pt-4">
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-white/70 mb-2">2D Doblado</h5>
              <div className="flex flex-wrap gap-2">
                {theater.showtimes
                  .filter(showtime => showtime.format.includes('Doblado'))
                  .map((showtime) => (
                    <ShowtimeButton
                      key={showtime.id}
                      showtime={showtime}
                      theater={theater}
                      onSelect={onShowtimeSelect}
                      isSelected={selectedShowtime?.id === showtime.id && selectedTheater?.id === theater.id}
                    />
                  ))}
              </div>
            </div>

            {theater.showtimes.some(s => s.format.includes('Subtitulado')) && (
              <div>
                <h5 className="text-sm font-semibold text-white/70 mb-2">2D Subtitulado</h5>
                <div className="flex flex-wrap gap-2">
                  {theater.showtimes
                    .filter(showtime => showtime.format.includes('Subtitulado'))
                    .map((showtime) => (
                      <ShowtimeButton
                        key={showtime.id}
                        showtime={showtime}
                        theater={theater}
                        onSelect={onShowtimeSelect}
                        isSelected={selectedShowtime?.id === showtime.id && selectedTheater?.id === theater.id}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

const ShowtimeButton = ({ showtime, theater, onSelect, isSelected }) => {
  return (
    <button
      onClick={() => onSelect(theater, showtime)}
      disabled={!showtime.available}
      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'bg-blue-600 border-blue-500 text-white'
          : showtime.available
          ? 'border-white/30 text-white hover:border-blue-500 hover:bg-blue-600/20'
          : 'border-red-500/50 text-red-400 cursor-not-allowed'
      }`}
    >
      {showtime.time}
    </button>
  );
};

export { TheaterSelector };