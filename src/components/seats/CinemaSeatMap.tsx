// src/components/seats/CinemaSeatMap.tsx
import { useState } from 'react';
import { Check, X as XIcon } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import BoardTip from '../board/BoardTip';

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
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM9 8v5l2 2v4h2v-5l-2-2V8H9zm6 7v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3l2 2v1h2v-1l2-2z"/>
  </svg>
);

// Estados de silla: cada uno se distingue por forma/glifo además del color.
const SEAT_BASE = 'flex h-8 w-8 flex-shrink-0 select-none items-center justify-center rounded-[2px] font-data text-[10px] font-bold leading-none';

const Seat = ({ id, value, rowType, selected, occupied, onToggle, onRequestWheelchair }) => {
  if (value === null) return <div className="h-8 w-8 flex-shrink-0" />;

  const isBlocked   = value === X;
  const isWC        = WC_SEAT_IDS.has(id);
  const unavailable = isBlocked || occupied;

  if (isBlocked) {
    return <div className={`${SEAT_BASE} border border-dashed border-[#2c2c30]`} aria-hidden="true" />;
  }
  if (occupied) {
    return (
      <BoardTip label={`${id} · Vendida`}>
        <div className={`${SEAT_BASE} bg-[#3a1a15] text-[#f0644d]`} role="img" aria-label={`Silla ${id}, vendida`} tabIndex={0}>
          <XIcon className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </div>
      </BoardTip>
    );
  }

  let tone;
  if (selected) tone = 'bg-[#f2b705] text-[#0c0c0d]';
  else if (isWC) tone = 'border border-[#c3bfb2] text-[#f4f1e8] hover:bg-[#2c2c30]';
  else if (rowType === 'preferencial') tone = 'bg-[#2c2c30] text-[#f4f1e8] shadow-[inset_0_2px_0_#f2b705] hover:bg-[#3a3a40]';
  else tone = 'bg-[#2c2c30] text-[#f4f1e8] hover:bg-[#46464c]';

  const handleClick = () => {
    if (unavailable) return;
    // Elegir un espacio de silla de ruedas pide confirmación; quitarlo no.
    if (isWC && !selected) { onRequestWheelchair(id); return; }
    onToggle(id);
  };

  const kind = isWC ? 'espacio para silla de ruedas' : rowType === 'preferencial' ? 'preferencial' : 'general';

  const tip = `${id} · ${isWC ? 'Silla de ruedas' : rowType === 'preferencial' ? 'Preferencial' : 'General'}${selected ? ' · Tuya' : ''}`;

  return (
    <BoardTip label={tip}>
      <button
        type="button"
        className={`${SEAT_BASE} ${tone}`}
        onClick={handleClick}
        aria-pressed={selected}
        aria-label={`Silla ${id}, ${kind}${selected ? ', seleccionada' : ''}`}
      >
        {isWC ? <WheelchairSVG /> : selected ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : value}
      </button>
    </BoardTip>
  );
};

const LegendItem = ({ swatch, label }) => (
  <span className="flex items-center gap-2">{swatch}{label}</span>
);

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-data text-xs text-[#c3bfb2]">
    <LegendItem swatch={<span className={`${SEAT_BASE} !h-5 !w-5 bg-[#f2b705] text-[#0c0c0d]`}><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>} label="Tuya" />
    <LegendItem swatch={<span className={`${SEAT_BASE} !h-5 !w-5 bg-[#2c2c30]`} />} label="General" />
    <LegendItem swatch={<span className={`${SEAT_BASE} !h-5 !w-5 bg-[#2c2c30] shadow-[inset_0_2px_0_#f2b705]`} />} label="Preferencial" />
    <LegendItem swatch={<span className={`${SEAT_BASE} !h-5 !w-5 border border-[#c3bfb2]`}><WheelchairSVG /></span>} label="Silla de ruedas" />
    <LegendItem swatch={<span className={`${SEAT_BASE} !h-5 !w-5 bg-[#3a1a15] text-[#f0644d]`}><XIcon className="h-3.5 w-3.5" strokeWidth={3} /></span>} label="Vendida" />
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────────
const CinemaSeatMap = ({ selectedSeats, onToggle, occupiedSeats = new Set() }) => {
  const [pendingWC, setPendingWC] = useState<string | null>(null);
  const [zoom, setZoom] = useState(() => (typeof window !== 'undefined' && window.innerWidth >= 900 ? 0.85 : 1));

  const changeZoom = (delta) =>
    setZoom(prev => Math.min(1.4, Math.max(0.6, +(prev + delta).toFixed(1))));

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
          onRequestWheelchair={setPendingWC}
        />
      );
    });

  const zoomBtn = 'flex h-11 w-11 items-center justify-center border border-[#46464c] bg-[#151517] font-data text-lg font-bold text-[#f4f1e8] hover:border-[#f2b705]';

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <Legend />
        <div className="flex gap-1" role="group" aria-label="Zoom del mapa">
          <button type="button" onClick={() => changeZoom(-0.1)} className={zoomBtn} aria-label="Alejar">−</button>
          <button type="button" onClick={() => changeZoom(0.1)} className={zoomBtn} aria-label="Acercar">+</button>
        </div>
      </div>

      <div className="relative overflow-hidden border border-[#2c2c30] bg-[#101011]">
        <div className="flex overflow-auto">
          <div
            className="m-auto w-max p-4 pt-6"
            style={{ zoom }}
          >
            {/* Pantalla */}
            <div className="mb-8 flex flex-col items-center">
              <div className="h-2 w-full bg-[#f2b705]" style={{ clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0 100%)' }} />
              <span className="mt-2 font-data text-[11px] uppercase tracking-[0.3em] text-[#8f8b80]">Pantalla</span>
            </div>

            <div className="flex flex-col gap-1">
              {LAYOUT.map(({ row, type, left, center, right }) => (
                <div key={row} className="flex items-center gap-1">
                  <span className="w-5 flex-shrink-0 text-right font-data text-[11px] font-bold text-[#8f8b80]">{row}</span>
                  <div className="flex gap-0.5" style={{ minWidth: left.length ? undefined : '60px' }}>
                    {left.length > 0 ? renderSection(left, row, type, 'L') : null}
                  </div>
                  <div className="w-3 flex-shrink-0" />
                  <div className="flex gap-0.5">{renderSection(center, row, type, 'C')}</div>
                  <div className="w-3 flex-shrink-0" />
                  <div className="flex gap-0.5">{renderSection(right, row, type, 'R')}</div>
                  <span className="w-5 flex-shrink-0 font-data text-[11px] font-bold text-[#8f8b80]">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog.Root open={pendingWC !== null} onOpenChange={(open) => { if (!open) setPendingWC(null); }}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-[90] bg-[#0c0c0d]/85" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[91] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-[#46464c] bg-[#151517] p-6 text-[#f4f1e8]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c3bfb2]"><WheelchairSVG /></span>
              <AlertDialog.Title className="font-board text-3xl font-bold leading-none tracking-wide uppercase">
                Espacio para silla de ruedas
              </AlertDialog.Title>
            </div>
            <AlertDialog.Description className="mt-4 text-[17px] leading-relaxed text-[#c3bfb2]">
              Este es un espacio para sillas de ruedas. Al aceptar, está confirmando que entiende esto.
              {pendingWC && <span className="mt-2 block font-data text-sm text-[#8f8b80]">Espacio {pendingWC}</span>}
            </AlertDialog.Description>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AlertDialog.Cancel className="h-12 rounded-[3px] border border-[#46464c] px-5 font-board text-lg font-bold tracking-[0.08em] uppercase text-[#c3bfb2] hover:border-[#f4f1e8] hover:text-[#f4f1e8]">
                Cancelar
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={() => { if (pendingWC) onToggle(pendingWC); setPendingWC(null); }}
                className="min-h-12 rounded-[3px] bg-[#f2b705] px-5 py-2 font-board text-lg font-bold tracking-[0.08em] uppercase text-[#0c0c0d] hover:bg-[#d9a304]"
              >
                Entiendo, elegir
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default CinemaSeatMap;
export { LAYOUT, X };
