// src/components/booking/ShowtimeButton.jsx
import { ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

const ShowtimeButton = ({
  showtime,
  onSelect,
  isSelected = false,
  disabled = false
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSeatsColor = (available) => {
    if (available === 0) return 'text-red-400';
    if (available <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getFormatBadgeColor = (format) => {
    switch(format) {
      case 'IMAX':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case '3D Doblada':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case '2D Subtitulada':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      default:
        return 'bg-green-500/20 text-green-300 border-green-400/30';
    }
  };

  return (
    <button
      onClick={() => !disabled && onSelect(showtime)}
      disabled={disabled || !showtime.available}
      className={`
        relative p-4 rounded-lg border transition-all duration-200 text-left w-full
        transform hover:scale-105 hover:shadow-lg group
        ${showtime.available && !disabled
          ? isSelected 
            ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25' 
            : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white'
          : 'border-red-500/30 bg-red-500/10 text-red-400 cursor-not-allowed opacity-60'
        }
      `}
    >
      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Hora principal */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-xl">{showtime.time}</span>
        </div>

        {!showtime.available && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-medium">
            AGOTADO
          </span>
        )}
      </div>

      {/* Formato */}
      <div className="mb-2">
        <span className={`
          text-xs px-2 py-1 rounded border font-medium
          ${getFormatBadgeColor(showtime.format)}
        `}>
          {showtime.format}
        </span>
      </div>

      {/* Información adicional */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-400">
            {formatPrice(showtime.price)}
          </span>

          <div className="flex items-center gap-1 text-xs">
            <UsersIcon className="w-4 h-4" />
            <span className={getSeatsColor(showtime.availableSeats)}>
              {showtime.availableSeats} disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Efecto hover */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none" />
    </button>
  );
};

export default ShowtimeButton;