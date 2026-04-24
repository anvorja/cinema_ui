// src/components/seats/CinemaSeatMap.jsx
import React, { useState, useRef, useEffect } from 'react';

const X  = 'x';   // unavailable

const desc = (lo, hi) =>
  Array.from({ length: hi - lo + 1 }, (_, i) => hi - i);

// Seats that are wheelchair-accessible spots (identified by seat ID)
const WC_SEAT_IDS = new Set([
  'D1','D2','D3','D4','D7','D8','D9','D10','D11','D12','D14','D15','D17','D18','D19',
  'E12','E13',
]);

// ── Layout ────────────────────────────────────────────────────────────────────
//  Each row: { row, type, left[], center[], right[] }
//  Values: number → selectable seat,  X → unavailable,  null → gap (no render)
//  Wheelchair seats use regular numbers; WC_SEAT_IDS determines which render as wheelchair.
const LAYOUT = [
  { row: 'A', type: 'general',      left: [],           center: desc(7,19), right: desc(1,4) },
  { row: 'B', type: 'general',      left: [],           center: desc(7,19), right: desc(1,4) },
  { row: 'C', type: 'general',      left: [],           center: desc(7,19), right: desc(1,4) },
  { row: 'D', type: 'wheelchair',   left: [],
    center: [19,18,17,null,15,14,null,12,11,10,9,8,7],  right: [4,3,2,1] },
  { row: 'E', type: 'general',      left: [23,22],
    center: desc(7,19),                                  right: desc(1,4) },
  { row: 'F', type: 'general',      left: [23,22],      center: desc(7,19), right: desc(1,4) },
  { row: 'G', type: 'general',      left: [23,22],      center: desc(7,19), right: desc(1,4) },
  { row: 'H', type: 'general',      left: [23,22],      center: desc(7,19), right: desc(1,4) },
  { row: 'I', type: 'general',      left: [23,22],      center: desc(7,19), right: desc(1,4) },
  { row: 'J', type: 'general',      left: [23,22],
    center: [X,X,X,X,X,14,13,12,11,10,9,8,7],            right: desc(1,4) },
  { row: 'K', type: 'preferencial', left: desc(22,25),  center: desc(7,18), right: desc(1,4) },
  { row: 'L', type: 'preferencial', left: desc(22,25),  center: desc(7,18), right: desc(1,4) },
  { row: 'M', type: 'preferencial', left: desc(22,25),  center: desc(7,18), right: desc(1,4) },
  { row: 'N', type: 'preferencial', left: desc(22,25),  center: desc(7,18), right: desc(1,4) },
  { row: 'O', type: 'preferencial', left: desc(22,25),  center: desc(7,18), right: desc(1,4) },
  { row: 'P', type: 'preferencial',
    left: [25,24,23,22,21,20,19], center: desc(5,18),    right: desc(1,4) },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const seatId = (row, section, index, val) => `${row}${val}`;

const WheelchairSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
    <path d="M12 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 8v5l2 2v4h2v-5l-2-2V8H9zm6 7v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3l2 2v1h2v-1l2-2z"/>
  </svg>
);

const Seat = ({ id, value, rowType, selected, occupied, onToggle }) => {
  if (value === null) return <div className="w-6 h-6 flex-shrink-0" />;

  const isBlocked   = value === X;
  const isWC        = WC_SEAT_IDS.has(id);
  const unavailable = isBlocked || occupied;

  let bg, cursor, text;
  if (occupied) {
    bg = 'bg-red-400/70';   cursor = 'cursor-not-allowed';  text = '';
  } else if (isBlocked) {
    bg = 'bg-gray-500/40';  cursor = 'cursor-not-allowed';  text = '';
  } else if (selected) {
    bg = 'bg-green-500';    cursor = 'cursor-pointer';
    text = isWC ? null : <span className="text-[9px] leading-none font-bold">✓</span>;
  } else if (isWC) {
    bg = 'bg-blue-600';     cursor = 'cursor-pointer';      text = null;
  } else if (rowType === 'preferencial') {
    bg = 'bg-gray-700 hover:bg-gray-600'; cursor = 'cursor-pointer';
    text = <span className="text-[9px] leading-none">{value}</span>;
  } else {
    bg = 'bg-blue-700 hover:bg-blue-600'; cursor = 'cursor-pointer';
    text = <span className="text-[9px] leading-none">{value}</span>;
  }

  const handleClick = () => {
    if (unavailable) return;
    if (isWC && !window.confirm('Este es un espacio para sillas de ruedas. Al aceptar, está confirmando que entiende esto.')) return;
    onToggle(id);
  };

  return (
    <button
      className={`w-6 h-6 rounded-[3px] flex-shrink-0 flex items-center justify-center
                  text-white transition-colors select-none ${bg} ${cursor}`}
      disabled={unavailable}
      onClick={handleClick}
      title={occupied ? 'Silla ya vendida' : isBlocked ? 'No disponible' : `${id}${rowType === 'preferencial' ? ' (Preferencial)' : ''}`}
    >
      {isWC ? <WheelchairSVG /> : text}
    </button>
  );
};

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1.5 text-[10px] sm:text-xs text-white/90 mb-3">
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-green-500 inline-block" /> Seleccionada
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-red-400/70 inline-block" /> Vendida
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-gray-500/40 border border-white/20 inline-block" /> No disponible
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-blue-700 inline-block" /> General
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-blue-700 flex items-center justify-center inline-flex text-white">
        <WheelchairSVG />
      </span> Silla de Ruedas
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-4 h-4 rounded-[3px] bg-gray-600 inline-block" /> Preferencial
    </span>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const CinemaSeatMap = ({ selectedSeats, onToggle, occupiedSeats = new Set() }) => {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  // Zoom inicial más pequeño en mobile para que el mapa entre sin scroll horizontal
  useEffect(() => {
    if (window.innerWidth < 640) setZoom(0.5);
  }, []);

  const changeZoom = (delta) =>
    setZoom(prev => Math.min(1.5, Math.max(0.6, +(prev + delta).toFixed(1))));

  const renderSection = (seats, row, rowType, section) =>
    seats.map((val, idx) => {
      const id = seatId(row, section, idx, val);
      return (
        <Seat
          key={`${row}-${section}-${idx}`}
          id={id}
          value={val}
          rowType={rowType}
          selected={selectedSeats.has(id)}
          occupied={val !== X && val !== null && occupiedSeats.has(id)}
          onToggle={onToggle}
        />
      );
    });

  return (
    <div className="flex flex-col gap-3">
      <Legend />

      <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Zoom controls */}
        <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1">
          <button
            onClick={() => setZoom(1)}
            className="w-8 h-8 bg-white border border-gray-300 rounded-full shadow text-gray-500 text-xs flex items-center justify-center hover:bg-gray-50"
            title="Reset zoom"
          >↺</button>
          <button
            onClick={() => changeZoom(0.1)}
            className="w-8 h-8 bg-white border border-gray-300 rounded-full shadow text-gray-700 text-lg flex items-center justify-center hover:bg-gray-50 font-bold"
          >+</button>
          <button
            onClick={() => changeZoom(-0.1)}
            className="w-8 h-8 bg-white border border-gray-300 rounded-full shadow text-gray-700 text-lg flex items-center justify-center hover:bg-gray-50 font-bold"
          >−</button>
        </div>

        {/* Scrollable seat area */}
        <div className="overflow-auto" ref={containerRef}>
          <div
            className="transition-transform origin-top-left p-6"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center',
                     minWidth: zoom < 1 ? `${100/zoom}%` : undefined }}
          >
            {/* Screen */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-64 h-2 bg-gray-300 rounded-sm" />
              <span className="text-gray-400 text-xs mt-1">Pantalla</span>
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-1">
              {LAYOUT.map(({ row, type, left, center, right }) => (
                <div key={row} className="flex items-center gap-1">
                  {/* Row label */}
                  <span className="w-5 text-[10px] text-gray-400 text-right flex-shrink-0 font-medium">
                    {row}
                  </span>

                  {/* Left section (may be empty for A-D rows) */}
                  <div className="flex gap-0.5" style={{ minWidth: left.length ? undefined : '56px' }}>
                    {left.length > 0
                      ? renderSection(left, row, type, 'L')
                      : null}
                  </div>

                  {/* Gap */}
                  <div className="w-3 flex-shrink-0" />

                  {/* Center section */}
                  <div className="flex gap-0.5">
                    {renderSection(center, row, type, 'C')}
                  </div>

                  {/* Gap */}
                  <div className="w-3 flex-shrink-0" />

                  {/* Right section */}
                  <div className="flex gap-0.5">
                    {renderSection(right, row, type, 'R')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaSeatMap;
export { LAYOUT, X };
