// Una función = una fila del tablero de salidas.
const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const formatLabel = (format) => {
  const map = { 'IMAX': 'IMAX', '3D Doblada': '3D DOB', '3D Subtitulada': '3D SUB', '2D Subtitulada': '2D SUB' };
  return map[format] ?? (format ? String(format).toUpperCase() : '2D DOB');
};

const seatState = (n) =>
  n === 0 ? { text: 'AGOTADO', cls: 'text-[#f0644d]' }
  : n <= 15 ? { text: `${n} SILLAS`, cls: 'text-[#f2b705]' }
  : { text: `${n} SILLAS`, cls: 'text-[#7bd88f]' };

const ShowtimeButton = ({ showtime, onSelect, isSelected = false, disabled = false }) => {
  const sold = !showtime.available;
  const active = !disabled && !sold;
  const seats = seatState(sold ? 0 : showtime.availableSeats);

  return (
    <button
      type="button"
      onClick={() => active && onSelect(showtime)}
      disabled={!active}
      aria-pressed={isSelected}
      aria-label={`${showtime.time}, ${formatLabel(showtime.format)}, sala ${showtime.hall_number ?? 1}, ${sold ? 'agotada' : `${showtime.availableSeats} sillas`}, ${formatPrice(showtime.price)}`}
      className={`grid min-h-[60px] w-full grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 px-3 py-2 text-left sm:grid-cols-[96px_110px_80px_130px_minmax(0,1fr)_auto] sm:gap-x-5 sm:px-4
        ${sold ? 'cursor-not-allowed opacity-45' : isSelected ? 'bg-[#f2b705] text-[#0c0c0d]' : 'hover:bg-[#1d1d20]'}`}
    >
      <span className={`font-data text-[26px] font-bold leading-none sm:text-[30px] ${sold ? 'line-through' : ''}`}>
        {showtime.time}
      </span>

      <span className="min-w-0 sm:contents">
        <span className={`block font-board text-lg font-bold tracking-wide sm:text-xl ${isSelected ? '' : 'text-[#f4f1e8]'}`}>{formatLabel(showtime.format)}</span>
        <span className={`block font-data text-xs sm:text-sm ${isSelected ? '' : 'text-[#c3bfb2]'}`}>SALA {showtime.hall_number ?? 1}</span>
      </span>

      <span className={`hidden font-data text-sm font-bold sm:block ${isSelected ? '' : seats.cls}`}>{seats.text}</span>

      <span className="hidden sm:block" />

      <span className="text-right">
        <span className={`block font-data text-sm font-bold sm:text-base ${sold ? 'line-through' : ''}`}>{formatPrice(showtime.price)}</span>
        <span className={`block font-data text-[11px] font-bold sm:hidden ${isSelected ? '' : seats.cls}`}>{seats.text}</span>
      </span>
    </button>
  );
};

export default ShowtimeButton;
