// src/components/booking/ShowtimeButton.jsx
const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const formatBadge = (format) => {
  const map = {
    'IMAX':          { label: 'IMAX',  cls: 'bg-purple-500/30 text-purple-200 border-purple-400/40' },
    '3D Doblada':    { label: '3D',    cls: 'bg-blue-500/30   text-blue-200   border-blue-400/40'   },
    '3D Subtitulada':{ label: '3D SUB',cls: 'bg-blue-500/30   text-blue-200   border-blue-400/40'   },
    '2D Subtitulada':{ label: 'SUB',   cls: 'bg-amber-500/30  text-amber-200  border-amber-400/40'  },
  };
  return map[format] ?? { label: 'DOB', cls: 'bg-green-500/30 text-green-200 border-green-400/40' };
};

const seatsColor = (n) =>
  n === 0 ? 'text-red-400' : n <= 15 ? 'text-yellow-400' : 'text-emerald-400';

const ShowtimeButton = ({ showtime, onSelect, isSelected = false, disabled = false }) => {
  const badge  = formatBadge(showtime.format);
  const sold   = !showtime.available;
  const active = !disabled && !sold;

  return (
    <button
      onClick={() => active && onSelect(showtime)}
      disabled={!active}
      title={sold ? 'Agotado' : `${showtime.format} · Sala ${showtime.hall_number ?? 1}`}
      className={`
        relative flex flex-col gap-1.5 p-3 rounded-xl border text-left
        transition-all duration-150 select-none
        ${sold
          ? 'border-red-500/20 bg-red-500/10 opacity-50 cursor-not-allowed'
          : isSelected
            ? 'border-blue-400 bg-blue-500/20 shadow-md shadow-blue-500/20 ring-1 ring-blue-400/50'
            : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer'
        }
      `}
    >
      {/* Dot selected indicator */}
      {isSelected && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
      )}

      {/* Time */}
      <span className={`font-bold text-base leading-none ${sold ? 'text-red-400' : 'text-white'}`}>
        {showtime.time}
      </span>

      {/* Format badge */}
      <span className={`self-start text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-none ${badge.cls}`}>
        {badge.label}
      </span>

      {/* Bottom row: sala + seats */}
      <div className="flex items-center justify-between gap-1 mt-0.5">
        <span className="text-[10px] text-white/50">
          Sala {showtime.hall_number ?? 1}
        </span>
        {sold ? (
          <span className="text-[10px] font-semibold text-red-400">AGOTADO</span>
        ) : (
          <span className={`text-[10px] font-medium ${seatsColor(showtime.availableSeats)}`}>
            {showtime.availableSeats} disp.
          </span>
        )}
      </div>

      {/* Price */}
      <span className="text-[11px] font-semibold text-emerald-400 leading-none">
        {formatPrice(showtime.price)}
      </span>
    </button>
  );
};

export default ShowtimeButton;
