// src/components/admin/analytics/AnalyticsTab.tsx — Shadcn-only version (Camino A)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import {
  DollarSign, TrendingUp, TrendingDown,
  RefreshCw, Ticket, AlertCircle, Film,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Skeleton } from '../../ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../ui/table';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '../../ui/tooltip';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const fmtShort = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K`
  : `$${v}`;

const fmtPeriodLabel = (iso: string, period: string) => {
  const d = new Date(iso);
  if (period === 'monthly') return d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' });
  if (period === 'weekly')  return `S ${d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}`;
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ title, value, subtitle, icon: Icon, accent, ring, trend }: any) => (
  <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-2xl font-bold text-white leading-none truncate">{value}</p>
          {subtitle && <p className="text-xs text-zinc-600 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ring-1 ${ring} shrink-0`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
      </div>
      {trend != null && (
        <div className={`mt-3 pt-3 border-t border-zinc-800 flex items-center gap-1 text-xs ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}% vs periodo anterior
        </div>
      )}
    </CardContent>
  </Card>
);

// ── Ranking bar (Progress style) ──────────────────────────────────────────────
const RankingChart = ({ data, labelKey, valueKey, title, accent, formatValue }: any) => {
  const max = data.length > 0 ? Math.max(...data.map((d: any) => d[valueKey])) : 1;
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2 pt-5 px-6">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-zinc-600">Top {data.length}</p>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        {data.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-10">Sin datos</p>
        ) : (
          <div className="space-y-3.5">
            {data.map((item: any, i: number) => {
              const pct = max > 0 ? Math.round((item[valueKey] / max) * 100) : 0;
              return (
                <TooltipProvider key={i} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group cursor-default">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] text-zinc-700 font-mono w-4 shrink-0">#{i + 1}</span>
                            <span className="text-xs text-zinc-400 truncate max-w-[160px] group-hover:text-white transition-colors">
                              {item[labelKey]}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold ${accent} ml-3 shrink-0`}>
                            {formatValue ? formatValue(item[valueKey]) : item[valueKey].toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          className={`h-1.5 bg-zinc-800 transition-all ${
                            accent.includes('blue')   ? '[&>div]:bg-blue-500'   :
                            accent.includes('violet') ? '[&>div]:bg-violet-500' :
                            '[&>div]:bg-emerald-500'
                          }`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-zinc-900 border-zinc-700 text-white text-xs max-w-[200px]"
                    >
                      <p className="font-medium mb-0.5">{item[labelKey]}</p>
                      <p className={accent}>{formatValue ? formatValue(item[valueKey]) : item[valueKey].toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ── SVG Line chart con Shadcn Tooltip en puntos ───────────────────────────────
const LineChartSVG = ({ data, period }: { data: any[]; period: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-zinc-600 text-sm text-center py-16">Sin datos para el período seleccionado</p>;
  }

  const W = 100; const H = 100;
  const PAD = { t: 8, b: 4, l: 0, r: 0 };
  const maxV  = Math.max(...data.map(d => d.revenue));
  const minV  = Math.min(...data.map(d => d.revenue));
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => ({
    x: data.length === 1 ? 50 : PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r),
    y: PAD.t + (1 - (d.revenue - minV) / range) * (H - PAD.t - PAD.b),
    ...d,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  const labelIndices = data.length <= 6
    ? data.map((_, i) => i)
    : [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 180 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y}
              stroke="#27272a" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          ))}

          <path d={areaD} fill="url(#areaGradA)" />
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

          {/* Puntos con Tooltip */}
          {pts.map((p, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <circle
                  cx={p.x} cy={p.y} r="2"
                  fill={hovered === i ? '#60a5fa' : '#3b82f6'}
                  stroke={hovered === i ? '#93c5fd' : 'transparent'}
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-zinc-900 border-zinc-700 text-white text-xs"
              >
                <p className="text-zinc-400 mb-0.5">{fmtPeriodLabel(p.period, period)}</p>
                <p className="font-bold text-white">{fmtCOP(p.revenue)}</p>
                {p.tickets_sold != null && (
                  <p className="text-zinc-500">{p.tickets_sold} boletos</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </svg>

        {/* Eje X con labels */}
        <div className="flex justify-between mt-1">
          {labelIndices.map(i => (
            <span key={i} className="text-[10px] text-zinc-600">
              {fmtPeriodLabel(data[i].period, period)}
            </span>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 bg-zinc-800 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-72 bg-zinc-800 rounded-xl" />
      <Skeleton className="h-72 bg-zinc-800 rounded-xl" />
    </div>
    <Skeleton className="h-72 bg-zinc-800 rounded-xl" />
    <Skeleton className="h-64 bg-zinc-800 rounded-xl" />
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const periodLabels: Record<string, string> = { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual' };

const AnalyticsTab = () => {
  const { adminApi } = useApi();
  const [salesReport, setSalesReport] = useState<any>(null);
  const [movieReport, setMovieReport]  = useState<any>(null);
  const [dateReport,  setDateReport]   = useState<any>(null);
  const [period, setPeriod]            = useState('daily');
  const [loading, setLoading]          = useState(true);
  const [error,   setError]            = useState<string | null>(null);

  const loadData = useCallback(async (p = 'daily') => {
    setLoading(true);
    setError(null);
    try {
      const [sales, movies, dates] = await Promise.all([
        adminApi.getSalesReport(),
        adminApi.getReportByMovie(),
        adminApi.getReportByDate(p),
      ]);
      setSalesReport(sales);
      setMovieReport(movies);
      setDateReport(dates);
    } catch {
      setError('No se pudieron cargar los datos de analítica.');
    } finally {
      setLoading(false);
    }
  }, [adminApi]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePeriod = (p: string) => { setPeriod(p); loadData(p); };

  if (loading) return <AnalyticsSkeleton />;
  if (error) return (
    <div className="flex items-center justify-center py-20 gap-2 text-red-400">
      <AlertCircle className="h-5 w-5" /> {error}
    </div>
  );

  const topMovies  = (movieReport?.items || []).slice(0, 8);
  const maxRevenue = topMovies.length > 0 ? Math.max(...topMovies.map((m: any) => m.net_revenue)) : 1;
  const timeData   = (dateReport?.items || []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Analítica</h2>
          <p className="text-xs text-zinc-600 mt-0.5">Ventas, ingresos y reembolsos</p>
        </div>
        <button
          onClick={() => loadData(period)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Ingresos totales"  value={fmtCOP(salesReport?.total_revenue || 0)}
          subtitle={`${salesReport?.total_purchases || 0} compras confirmadas`}
          icon={DollarSign} accent="text-emerald-400" ring="ring-emerald-500/20 bg-emerald-500/10" />
        <KpiCard title="Boletos vendidos"  value={(salesReport?.total_tickets_sold || 0).toLocaleString()}
          subtitle={`Prom. ${fmtCOP(salesReport?.average_purchase_amount || 0)} / compra`}
          icon={Ticket} accent="text-blue-400" ring="ring-blue-500/20 bg-blue-500/10" />
        <KpiCard title="Reembolsos"        value={salesReport?.total_refunds || 0}
          subtitle={fmtCOP(salesReport?.total_refunded_amount || 0)}
          icon={TrendingDown} accent="text-red-400" ring="ring-red-500/20 bg-red-500/10" />
        <KpiCard title="Cancelaciones"     value={salesReport?.total_cancelled || 0}
          subtitle="Órdenes canceladas"
          icon={AlertCircle} accent="text-amber-400" ring="ring-amber-500/20 bg-amber-500/10" />
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingChart
          data={topMovies} labelKey="movie_title" valueKey="net_revenue"
          title="Ingresos netos por película"
          accent="text-blue-400"
          formatValue={fmtCOP}
        />
        <RankingChart
          data={topMovies} labelKey="movie_title" valueKey="tickets_sold"
          title="Boletos vendidos por película"
          accent="text-violet-400"
          formatValue={(v: number) => `${v.toLocaleString()} boletos`}
        />
      </div>

      {/* Evolución temporal */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0 pt-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Evolución de ingresos</p>
              <p className="text-xs text-zinc-600 mt-0.5">{periodLabels[period]}</p>
            </div>
            <Tabs value={period} onValueChange={handlePeriod} className="w-auto">
              <TabsList className="bg-zinc-800 border border-zinc-700 h-8">
                {Object.entries(periodLabels).map(([val, label]) => (
                  <TabsTrigger key={val} value={val}
                    className="text-xs text-zinc-500 data-[state=active]:text-white data-[state=active]:bg-zinc-700 h-6 px-3">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-4">
          <LineChartSVG data={timeData} period={period} />

          {timeData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800">
              {[
                { label: 'Periodos',   value: timeData.length },
                { label: 'Mayor',      value: fmtCOP(Math.max(...timeData.map((d: any) => d.revenue))) },
                { label: 'Promedio',   value: fmtCOP(timeData.reduce((s: number, d: any) => s + d.revenue, 0) / timeData.length) },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{s.label}</p>
                  <p className="text-sm font-semibold text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla detallada */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-0 pt-5 px-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 pb-4">
            <Film className="h-4 w-4 text-zinc-500" />
            <p className="text-sm font-semibold text-white">Detalle por película</p>
            <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px] ml-auto">
              {topMovies.length} películas
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {topMovies.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-12">Sin ventas registradas</p>
          ) : (
            <Table className="">
              <TableHeader className="">
                <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/60">
                  {['Película','Cuota','Compras','Boletos','Bruto','Reembolso','Neto'].map(h => (
                    <TableHead key={h} className="text-[10px] text-zinc-600 uppercase tracking-widest py-3">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {topMovies.map((m: any, i: number) => {
                  const pct = maxRevenue > 0 ? Math.round((m.net_revenue / maxRevenue) * 100) : 0;
                  return (
                    <TableRow key={m.movie_id} className="border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-700 font-mono w-4">#{i + 1}</span>
                          <span className="text-sm font-medium text-white">{m.movie_title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 w-32">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 w-20 bg-zinc-800 [&>div]:bg-blue-500" />
                          <span className="text-[11px] text-zinc-600 w-7">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{m.purchases_count}</TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{m.tickets_sold.toLocaleString()}</TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{fmtCOP(m.revenue)}</TableCell>
                      <TableCell className="py-3">
                        {m.refunded_amount > 0
                          ? <span className="text-sm text-red-400">{fmtCOP(m.refunded_amount)}</span>
                          : <span className="text-sm text-zinc-700">—</span>}
                      </TableCell>
                      <TableCell className="py-3 text-sm font-semibold text-emerald-400">
                        {fmtCOP(m.net_revenue)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default AnalyticsTab;
