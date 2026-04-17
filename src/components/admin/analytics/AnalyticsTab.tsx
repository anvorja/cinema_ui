// src/components/admin/analytics/AnalyticsTab.tsx — Recharts version
import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import {
  DollarSign, TrendingUp, TrendingDown, RefreshCw,
  Ticket, AlertCircle, Film,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Skeleton } from '../../ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../ui/table';

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

// ── Custom Tooltip para AreaChart ─────────────────────────────────────────────
const AreaTooltip = ({ active, payload, label, period }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-zinc-400 text-xs mb-2">{fmtPeriodLabel(label, period)}</p>
      <p className="text-white font-bold text-base">{fmtCOP(payload[0].value)}</p>
      {payload[1] && (
        <p className="text-zinc-500 text-xs mt-1">{payload[1].value} boletos</p>
      )}
    </div>
  );
};

// ── Custom Tooltip para BarChart ──────────────────────────────────────────────
const BarTooltip = ({ active, payload, label, formatValue }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl text-sm max-w-[220px]">
      <p className="text-zinc-400 text-xs mb-1 truncate">{label}</p>
      <p className="text-white font-bold">{formatValue ? formatValue(payload[0].value) : payload[0].value}</p>
    </div>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
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
    <Skeleton className="h-80 bg-zinc-800 rounded-xl" />
    <Skeleton className="h-64 bg-zinc-800 rounded-xl" />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
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

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-red-400">
        <AlertCircle className="h-5 w-5" /> {error}
      </div>
    );
  }

  const topMovies = (movieReport?.items || []).slice(0, 8);
  const maxRevenue = topMovies.length > 0 ? Math.max(...topMovies.map((m: any) => m.net_revenue)) : 1;

  // Preparar datos temporales con label formateado
  const timeData = (dateReport?.items || []).map((d: any) => ({
    ...d,
    label: fmtPeriodLabel(d.period, period),
  }));

  const periodLabels: Record<string, string> = { daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual' };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
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

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ingresos totales"
          value={fmtCOP(salesReport?.total_revenue || 0)}
          subtitle={`${salesReport?.total_purchases || 0} compras confirmadas`}
          icon={DollarSign}
          accent="text-emerald-400" ring="ring-emerald-500/20 bg-emerald-500/10"
        />
        <KpiCard
          title="Boletos vendidos"
          value={(salesReport?.total_tickets_sold || 0).toLocaleString()}
          subtitle={`Prom. ${fmtCOP(salesReport?.average_purchase_amount || 0)} / compra`}
          icon={Ticket}
          accent="text-blue-400" ring="ring-blue-500/20 bg-blue-500/10"
        />
        <KpiCard
          title="Reembolsos"
          value={salesReport?.total_refunds || 0}
          subtitle={fmtCOP(salesReport?.total_refunded_amount || 0)}
          icon={TrendingDown}
          accent="text-red-400" ring="ring-red-500/20 bg-red-500/10"
        />
        <KpiCard
          title="Cancelaciones"
          value={salesReport?.total_cancelled || 0}
          subtitle="Órdenes canceladas"
          icon={AlertCircle}
          accent="text-amber-400" ring="ring-amber-500/20 bg-amber-500/10"
        />
      </div>

      {/* ── Gráficos de barras ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos por película */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2 pt-5 px-6">
            <p className="text-sm font-semibold text-white">Ingresos netos por película</p>
            <p className="text-xs text-zinc-600">Top {topMovies.length}</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {topMovies.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-12">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topMovies} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis
                    type="number" dataKey="net_revenue"
                    tick={{ fill: '#52525b', fontSize: 10 }}
                    tickFormatter={fmtShort}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    type="category" dataKey="movie_title" width={110}
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + '…' : v}
                  />
                  <Tooltip content={<BarTooltip formatValue={fmtCOP} />} cursor={{ fill: '#27272a' }} />
                  <Bar dataKey="net_revenue" radius={[0, 4, 4, 0]}>
                    {topMovies.map((_: any, i: number) => (
                      <Cell key={i} fill={i === 0 ? '#3b82f6' : '#1d4ed8'} fillOpacity={1 - i * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Boletos por película */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2 pt-5 px-6">
            <p className="text-sm font-semibold text-white">Boletos vendidos por película</p>
            <p className="text-xs text-zinc-600">Top {topMovies.length}</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {topMovies.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-12">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topMovies} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                  <XAxis
                    type="number" dataKey="tickets_sold"
                    tick={{ fill: '#52525b', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    type="category" dataKey="movie_title" width={110}
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + '…' : v}
                  />
                  <Tooltip content={<BarTooltip formatValue={(v: number) => `${v.toLocaleString()} boletos`} />} cursor={{ fill: '#27272a' }} />
                  <Bar dataKey="tickets_sold" radius={[0, 4, 4, 0]}>
                    {topMovies.map((_: any, i: number) => (
                      <Cell key={i} fill={i === 0 ? '#8b5cf6' : '#6d28d9'} fillOpacity={1 - i * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Evolución temporal (AreaChart) ── */}
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
                  <TabsTrigger
                    key={val} value={val}
                    className="text-xs text-zinc-500 data-[state=active]:text-white data-[state=active]:bg-zinc-700 h-6 px-3"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4 pt-4">
          {timeData.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-16">Sin datos para el período seleccionado</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timeData} margin={{ left: 8, right: 16, top: 8, bottom: 4 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#52525b', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#52525b', fontSize: 10 }}
                    tickFormatter={fmtShort}
                    axisLine={false} tickLine={false}
                    width={52}
                  />
                  <Tooltip content={<AreaTooltip period={period} />} />
                  <Area
                    type="monotone" dataKey="revenue"
                    stroke="#3b82f6" strokeWidth={2}
                    fill="url(#gradRevenue)"
                    dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#60a5fa', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Mini stats del período */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800">
                {[
                  { label: 'Periodos', value: timeData.length },
                  { label: 'Mayor ingreso', value: fmtCOP(Math.max(...timeData.map((d: any) => d.revenue))) },
                  { label: 'Promedio', value: fmtCOP(timeData.reduce((s: number, d: any) => s + d.revenue, 0) / timeData.length) },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{s.label}</p>
                    <p className="text-sm font-semibold text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Tabla detallada con Progress de cuota ── */}
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
                  {['Película', 'Cuota', 'Compras', 'Boletos', 'Bruto', 'Reembolso', 'Neto'].map(h => (
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
                          <Progress
                            value={pct}
                            className="h-1.5 w-20 bg-zinc-800 [&>div]:bg-blue-500"
                          />
                          <span className="text-[11px] text-zinc-600 w-7">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{m.purchases_count}</TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{m.tickets_sold.toLocaleString()}</TableCell>
                      <TableCell className="py-3 text-sm text-zinc-400">{fmtCOP(m.revenue)}</TableCell>
                      <TableCell className="py-3">
                        {m.refunded_amount > 0
                          ? <span className="text-sm text-red-400">{fmtCOP(m.refunded_amount)}</span>
                          : <span className="text-sm text-zinc-700">—</span>
                        }
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
