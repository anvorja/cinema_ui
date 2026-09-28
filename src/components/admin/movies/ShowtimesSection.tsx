import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, RefreshCw, Trash2, ChevronDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Showtime {
  id: number;
  show_date: string;
  show_time: string;
  format: string;
  capacity: number;
  available_tickets: number;
  theater_id: number;
  theater_name: string;
  hall_number: number | null;
}

interface GroupedByDate {
  date: string;
  label: string;
  showtimes: Showtime[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const FORMAT_LABELS: Record<string, string> = {
  '2d_dubbed':       '2D Dob.',
  '2d_subtitled':    '2D Sub.',
  '3d_dubbed':       '3D Dob.',
  '3d_subtitled':    '3D Sub.',
  'imax':            'IMAX',
  'imax_dubbed':     'IMAX Dob.',
  'imax_subtitled':  'IMAX Sub.',
  'two_d_dubbed':    '2D Dob.',
  'two_d_subtitled': '2D Sub.',
};

const fmtLabel = (f: string) =>
  FORMAT_LABELS[f?.toLowerCase()] ?? f ?? '—';

const fmtDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
};

const localDateStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const addDays = (base: string, n: number) => {
  const d = new Date(base + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const groupByDate = (showtimes: Showtime[]): GroupedByDate[] => {
  const map = new Map<string, Showtime[]>();
  showtimes.forEach(st => {
    const key = st.show_date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(st);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, sts]) => ({
      date,
      label: fmtDate(date),
      showtimes: sts.sort((a, b) =>
        a.theater_name.localeCompare(b.theater_name) || a.show_time.localeCompare(b.show_time)
      ),
    }));
};

// ── Component ──────────────────────────────────────────────────────────────────
const ShowtimesSection = ({ movieId }: { movieId: string | number }) => {
  const { adminApi } = useApi();
  const { toast } = useToast();

  const [showtimes,     setShowtimes]     = useState<Showtime[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [reprogramming, setReprogramming] = useState(false);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [daysAhead,     setDaysAhead]     = useState(30);
  const [result,        setResult]        = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const fetchShowtimes = useCallback(async () => {
    if (!movieId) return;
    setLoading(true);
    try {
      const start = localDateStr();
      const end   = addDays(start, daysAhead - 1);
      const data  = await adminApi.getMovieShowtimes(movieId, start, end);
      const list: Showtime[] = Array.isArray(data) ? data : [];
      setShowtimes(list);
      // Auto-expand first two dates
      const dates = [...new Set(list.map(s => s.show_date))].sort().slice(0, 2);
      setExpandedDates(new Set(dates));
    } catch {
      toast.error('No se pudieron cargar los horarios');
    } finally {
      setLoading(false);
    }
  }, [movieId, daysAhead, adminApi]); // eslint-disable-line

  useEffect(() => { fetchShowtimes(); }, [fetchShowtimes]);

  const handleReprogramar = async () => {
    setReprogramming(true);
    setResult(null);
    try {
      const created: Showtime[] = await adminApi.reprogramarShowtimes(movieId, daysAhead);
      const n = Array.isArray(created) ? created.length : 0;
      setResult({ type: 'ok', text: `${n} horario${n !== 1 ? 's' : ''} creado${n !== 1 ? 's' : ''} (los existentes se conservaron)` });
      await fetchShowtimes();
    } catch (err: any) {
      setResult({ type: 'err', text: err?.message ?? 'Error al reprogramar' });
    } finally {
      setReprogramming(false);
    }
  };

  const handleDelete = async (showtimeId: number) => {
    if (!confirm('¿Eliminar esta función? Esta acción no se puede deshacer.')) return;
    setDeletingId(showtimeId);
    try {
      await adminApi.deleteShowtime(movieId, showtimeId);
      setShowtimes(prev => prev.filter(s => s.id !== showtimeId));
      toast.success('Función eliminada');
    } catch {
      toast.error('No se pudo eliminar la función');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleDate = (date: string) =>
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });

  const grouped   = groupByDate(showtimes);
  const today     = localDateStr();
  const endDate   = addDays(today, daysAhead - 1);
  const totalFns  = showtimes.length;

  return (
    <div className="bg-board-panel border border-board-line rounded-xl overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-board-line">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-board-panel2 rounded-md shrink-0">
            <Calendar className="h-3.5 w-3.5 text-board-mute" />
          </div>
          <div>
            <p className="text-xs font-semibold text-board-mute uppercase tracking-widest">
              Horarios programados
            </p>
            {!loading && (
              <p className="text-[11px] text-board-mute mt-0.5">
                {totalFns} funciones · {today} → {endDate}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Days selector */}
          <select
            value={daysAhead}
            onChange={e => setDaysAhead(Number(e.target.value))}
            className="h-8 px-2 text-xs border border-board-line bg-board-panel text-board-ink rounded-lg focus:outline-none focus:ring-1 focus:ring-board-amber"
          >
            {[7, 14, 30, 60, 90, 120].map(d => (
              <option key={d} value={d}>{d} días</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchShowtimes}
            disabled={loading}
            className="h-8 px-2.5 text-xs text-board-mute hover:text-board-ink bg-board-panel2 hover:bg-board-panel2 border border-board-line rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          {/* Reprogramar */}
          <button
            onClick={handleReprogramar}
            disabled={reprogramming || loading}
            className="h-8 px-3 text-xs font-medium bg-board-amber hover:bg-board-amberpress disabled:opacity-50 disabled:cursor-not-allowed text-board-onamber rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Clock className={`h-3.5 w-3.5 ${reprogramming ? 'animate-spin' : ''}`} />
            {reprogramming ? 'Programando...' : `Reprogramar ${daysAhead} días`}
          </button>
        </div>
      </div>

      {/* ── Result banner ────────────────────────────────────────────────────── */}
      {result && (
        <div className={`flex items-center gap-2 px-6 py-2.5 text-xs border-b ${
          result.type === 'ok'
            ? 'bg-board-ok border-board-ok text-board-okink'
            : 'bg-board-alarm border-board-alarm text-board-alarmink'
        }`}>
          {result.type === 'ok'
            ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            : <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          }
          {result.text}
          <button onClick={() => setResult(null)} className="ml-auto text-current opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="divide-y divide-board-line">
        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-board-mute">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Cargando horarios...
          </div>
        )}

        {!loading && grouped.length === 0 && (
          <div className="py-10 text-center">
            <Calendar className="h-8 w-8 text-board-ink2 mx-auto mb-2" />
            <p className="text-sm text-board-mute">
              Sin horarios programados en este rango
            </p>
            <p className="text-xs text-board-ink2 mt-1">
              Usa "Reprogramar" para generar funciones automáticamente
            </p>
          </div>
        )}

        {!loading && grouped.map(({ date, label, showtimes: dayShowtimes }) => {
          const isExpanded = expandedDates.has(date);
          const isToday    = date === today;

          return (
            <div key={date}>
              {/* Date row (accordion header) */}
              <button
                onClick={() => toggleDate(date)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-board-ground transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-board-mute shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-board-mute shrink-0" />
                  }
                  <span className="text-sm font-medium text-board-ink capitalize">
                    {label}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-board-amber text-board-amberink rounded">
                      HOY
                    </span>
                  )}
                </div>
                <span className="text-xs text-board-mute shrink-0 ml-4">
                  {dayShowtimes.length} función{dayShowtimes.length !== 1 ? 'es' : ''}
                </span>
              </button>

              {/* Showtime rows */}
              {isExpanded && (
                <div className="px-6 pb-3 space-y-1">
                  {dayShowtimes.map(st => (
                    <div
                      key={st.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-board-ground group"
                    >
                      {/* Time */}
                      <span className="text-sm font-mono font-semibold text-board-ink w-14 shrink-0">
                        {st.show_time.slice(0, 5)}
                      </span>

                      {/* Theater */}
                      <span className="text-sm text-board-ink2 flex-1 truncate">
                        {st.theater_name}
                      </span>

                      {/* Hall */}
                      {st.hall_number != null && (
                        <span className="text-xs text-board-mute shrink-0">
                          Sala {st.hall_number}
                        </span>
                      )}

                      {/* Format */}
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-board-panel2 text-board-mute shrink-0">
                        {fmtLabel(st.format)}
                      </span>

                      {/* Availability */}
                      <span className={`text-[10px] shrink-0 ${
                        st.available_tickets === 0
                          ? 'text-board-alarmink'
                          : st.available_tickets < 20
                          ? 'text-board-amberink'
                          : 'text-board-okink'
                      }`}>
                        {st.available_tickets}/{st.capacity}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(st.id)}
                        disabled={deletingId === st.id}
                        className="shrink-0 p-1 rounded text-board-ink2 hover:text-board-alarmink hover:bg-board-alarm transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                        title="Eliminar función"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowtimesSection;
