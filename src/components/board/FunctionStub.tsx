// Tiquete-resumen de la función elegida; se repite en todos los pasos de la compra.
interface FunctionStubProps {
  poster?: string;
  title: string;
  format?: string;
  ageRating?: string;
  theaterName?: string;
  hall?: string | number;
  date?: string;
  time?: string;
  seats?: string;
}

const Cell = ({ label, value, accent = false }: { label: string; value?: string | number; accent?: boolean }) => (
  <div className="min-w-0">
    <dt className="font-data text-[10px] uppercase text-board-mute">{label}</dt>
    <dd className={`mt-1 truncate font-data text-sm font-bold ${accent ? 'text-board-amberink' : 'text-board-ink'}`}>{value || '—'}</dd>
  </div>
);

export const FunctionStub = ({ poster, title, format, ageRating, theaterName, hall, date, time, seats }: FunctionStubProps) => (
  <div className="b-stub grid grid-cols-[72px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:p-5">
    {poster ? (
      <img src={poster} alt={`Póster de ${title}`} className="aspect-[2/3] w-full border border-board-line object-cover" />
    ) : (
      <div className="aspect-[2/3] w-full border border-board-line bg-board-panel2" />
    )}
    <div className="min-w-0">
      <h2 className="font-board text-3xl font-bold leading-none tracking-wide uppercase text-board-ink sm:text-4xl">{title}</h2>
      <p className="mt-1 font-data text-xs text-board-mute">{[format, ageRating].filter(Boolean).join(' · ')}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-dashed border-board-line2 pt-3 sm:grid-cols-4">
        <Cell label="Cine" value={theaterName} />
        <Cell label="Sala" value={hall} />
        <Cell label="Fecha" value={date || 'Hoy'} />
        <Cell label="Hora" value={time} accent />
        {seats && (
          <div className="col-span-2 sm:col-span-4">
            <dt className="font-data text-[10px] uppercase text-board-mute">Sillas</dt>
            <dd className="mt-1 font-data text-sm font-bold text-board-ink">{seats}</dd>
          </div>
        )}
      </dl>
    </div>
  </div>
);

export default FunctionStub;
