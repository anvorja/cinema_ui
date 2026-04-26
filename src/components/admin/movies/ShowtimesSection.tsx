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
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });

  const grouped   = groupByDate(showtimes);
  const today     = localDateStr();
  const endDate   = addDays(today, daysAhead - 1);
  const totalFns  = showtimes.length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-md shrink-0">
            <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
              Horarios programados
            </p>
            {!loading && (
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
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
            className="h-8 px-2 text-xs border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {[7, 14, 30, 60, 90, 120].map(d => (
              <option key={d} value={d}>{d} días</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={fetchShowtimes}
            disabled={loading}
            className="h-8 px-2.5 text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          {/* Reprogramar */}
          <button
            onClick={handleReprogramar}
            disabled={reprogramming || loading}
            className="h-8 px-3 text-xs font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5"
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
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
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
      <div className="divide-y divide-gray-100 dark:divide-zinc-800">
        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400 dark:text-zinc-500">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Cargando horarios...
          </div>
        )}

        {!loading && grouped.length === 0 && (
          <div className="py-10 text-center">
            <Calendar className="h-8 w-8 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              Sin horarios programados en este rango
            </p>
            <p className="text-xs text-gray-300 dark:text-zinc-600 mt-1">
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
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    : <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  }
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 capitalize">
                    {label}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">
                      HOY
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-zinc-500 shrink-0 ml-4">
                  {dayShowtimes.length} función{dayShowtimes.length !== 1 ? 'es' : ''}
                </span>
              </button>

              {/* Showtime rows */}
              {isExpanded && (
                <div className="px-6 pb-3 space-y-1">
                  {dayShowtimes.map(st => (
                    <div
                      key={st.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/40 group"
                    >
                      {/* Time */}
                      <span className="text-sm font-mono font-semibold text-gray-800 dark:text-zinc-200 w-14 shrink-0">
                        {st.show_time.slice(0, 5)}
                      </span>

                      {/* Theater */}
                      <span className="text-sm text-gray-600 dark:text-zinc-400 flex-1 truncate">
                        {st.theater_name}
                      </span>

                      {/* Hall */}
                      {st.hall_number != null && (
                        <span className="text-xs text-gray-400 dark:text-zinc-500 shrink-0">
                          Sala {st.hall_number}
                        </span>
                      )}

                      {/* Format */}
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 shrink-0">
                        {fmtLabel(st.format)}
                      </span>

                      {/* Availability */}
                      <span className={`text-[10px] shrink-0 ${
                        st.available_tickets === 0
                          ? 'text-red-400'
                          : st.available_tickets < 20
                          ? 'text-amber-400'
                          : 'text-emerald-500'
                      }`}>
                        {st.available_tickets}/{st.capacity}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(st.id)}
                        disabled={deletingId === st.id}
                        className="shrink-0 p-1 rounded text-gray-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
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
