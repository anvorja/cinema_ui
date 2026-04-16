// src/components/admin/analytics/AnalyticsTab.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import {
  DollarSign, TrendingUp, TrendingDown, RefreshCw,
  BarChart2, Calendar, Film, AlertCircle
} from 'lucide-react';

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const SummaryCard = ({ title, value, subtitle, icon, color, bgColor, trend }: { title: any; value: any; subtitle: any; icon: any; color: any; bgColor: any; trend?: any }) => (
  <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-xl font-bold text-white truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${bgColor} ml-3 shrink-0`}>
        {React.createElement(icon, { className: `h-5 w-5 ${color}` })}
      </div>
    </div>
    {trend != null && (
      <div className={`mt-3 flex items-center text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {trend >= 0
          ? <TrendingUp className="h-3 w-3 mr-1" />
          : <TrendingDown className="h-3 w-3 mr-1" />}
        {Math.abs(trend)}% vs periodo anterior
      </div>
    )}
  </div>
);

const BarChart = ({ data, labelKey, valueKey, title, color = 'bg-blue-500', formatValue }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
        <p className="text-gray-500 text-sm text-center py-8">Sin datos disponibles</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => d[valueKey]));

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-5">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => {
          const pct = maxVal > 0 ? (item[valueKey] / maxVal) * 100 : 0;
          return (
            <div key={idx}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span className="truncate max-w-[60%]">{item[labelKey]}</span>
                <span className="text-white font-medium ml-2">
                  {formatValue ? formatValue(item[valueKey]) : item[valueKey].toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LineChart = ({ data, title, period }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
        <p className="text-gray-500 text-sm text-center py-8">Sin datos disponibles</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const height = 120;

  const formatPeriod = (iso) => {
    const d = new Date(iso);
    if (period === 'monthly') return d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' });
    if (period === 'weekly') return `S ${d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}`;
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  };

  const points = data.map((d, i) => {
    const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
    const y = maxRevenue > 0 ? 100 - (d.revenue / maxRevenue) * 90 : 50;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-5">{title}</h3>
      <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#3b82f6" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="flex justify-between mt-2 overflow-hidden">
        {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((p, i) => (
          <span key={i} className="text-xs text-gray-500">{formatPeriod(p.period)}</span>
        ))}
      </div>
    </div>
  );
};

const RefundsTable = ({ movieData }) => {
  const refundedMovies = (movieData?.items || []).filter(m => m.refunded_amount > 0);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300">Reembolsos por película</h3>
      </div>
      {refundedMovies.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Sin reembolsos registrados</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-700">
              <th className="text-left px-6 py-3">Película</th>
              <th className="text-right px-6 py-3">Reembolsado</th>
              <th className="text-right px-6 py-3">Ingreso neto</th>
            </tr>
          </thead>
          <tbody>
            {refundedMovies.map((m) => (
              <tr key={m.movie_id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-3 text-white">{m.movie_title}</td>
                <td className="px-6 py-3 text-right text-red-400">{formatCOP(m.refunded_amount)}</td>
                <td className="px-6 py-3 text-right text-green-400">{formatCOP(m.net_revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const AnalyticsTab = () => {
  const { adminApi } = useApi();
  const [salesReport, setSalesReport] = useState(null);
  const [movieReport, setMovieReport] = useState(null);
  const [dateReport, setDateReport] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (selectedPeriod = 'daily') => {
    setLoading(true);
    setError(null);
    try {
      const [sales, movies, dates] = await Promise.all([
        adminApi.getSalesReport(),
        adminApi.getReportByMovie(),
        adminApi.getReportByDate(selectedPeriod),
      ]);
      setSalesReport(sales);
      setMovieReport(movies);
      setDateReport(dates);
    } catch {
      setError('Error cargando datos de analítica');
    } finally {
      setLoading(false);
    }
  }, [adminApi]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePeriodChange = (p) => {
    setPeriod(p);
    loadData(p);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <RefreshCw className="h-6 w-6 animate-spin mr-3" />
        Cargando analítica...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-400">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  const topMovies = (movieReport?.items || []).slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Dashboard de Analítica</h2>
          <p className="text-sm text-gray-400 mt-0.5">Ventas, ingresos y reembolsos</p>
        </div>
        <button
          onClick={() => loadData()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Ingresos totales"
          value={formatCOP(salesReport?.total_revenue || 0)}
          subtitle={`${salesReport?.total_purchases || 0} compras confirmadas`}
          icon={DollarSign}
          color="text-green-400"
          bgColor="bg-green-900/20"
        />
        <SummaryCard
          title="Boletos vendidos"
          value={(salesReport?.total_tickets_sold || 0).toLocaleString()}
          subtitle={`Promedio ${formatCOP(salesReport?.average_purchase_amount || 0)} / compra`}
          icon={BarChart2}
          color="text-blue-400"
          bgColor="bg-blue-900/20"
        />
        <SummaryCard
          title="Reembolsos"
          value={salesReport?.total_refunds || 0}
          subtitle={formatCOP(salesReport?.total_refunded_amount || 0)}
          icon={TrendingDown}
          color="text-red-400"
          bgColor="bg-red-900/20"
        />
        <SummaryCard
          title="Cancelaciones"
          value={salesReport?.total_cancelled || 0}
          subtitle="Órdenes canceladas"
          icon={AlertCircle}
          color="text-yellow-400"
          bgColor="bg-yellow-900/20"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por película */}
        <BarChart
          data={topMovies}
          labelKey="movie_title"
          valueKey="net_revenue"
          title="Ingresos netos por película (top 8)"
          color="bg-blue-500"
          formatValue={formatCOP}
        />

        {/* Boletos por película */}
        <BarChart
          data={topMovies}
          labelKey="movie_title"
          valueKey="tickets_sold"
          title="Boletos vendidos por película"
          color="bg-purple-500"
          formatValue={(v) => `${v.toLocaleString()} blt.`}
        />
      </div>

      {/* Evolución temporal */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-300">Evolución de ingresos</h3>
          </div>
          <div className="flex gap-2">
            {['daily', 'weekly', 'monthly'].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {p === 'daily' ? 'Diario' : p === 'weekly' ? 'Semanal' : 'Mensual'}
              </button>
            ))}
          </div>
        </div>
        <LineChart data={dateReport?.items || []} title="" period={period} />
        {(dateReport?.items || []).length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            {[
              { label: 'Total periodos', value: dateReport.items.length },
              { label: 'Mayor ingreso', value: formatCOP(Math.max(...dateReport.items.map(d => d.revenue))) },
              { label: 'Promedio por periodo', value: formatCOP(dateReport.items.reduce((s, d) => s + d.revenue, 0) / dateReport.items.length) },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Movies table with occupancy */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
          <Film className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-300">Detalle de ventas por película</h3>
        </div>
        {topMovies.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Sin ventas registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-700 bg-gray-900/30">
                  <th className="text-left px-6 py-3">Película</th>
                  <th className="text-right px-6 py-3">Compras</th>
                  <th className="text-right px-6 py-3">Boletos</th>
                  <th className="text-right px-6 py-3">Ingresos brutos</th>
                  <th className="text-right px-6 py-3">Reembolsado</th>
                  <th className="text-right px-6 py-3">Ingreso neto</th>
                </tr>
              </thead>
              <tbody>
                {topMovies.map((m) => (
                  <tr key={m.movie_id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{m.movie_title}</td>
                    <td className="px-6 py-3 text-right text-gray-300">{m.purchases_count}</td>
                    <td className="px-6 py-3 text-right text-gray-300">{m.tickets_sold.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right text-gray-300">{formatCOP(m.revenue)}</td>
                    <td className="px-6 py-3 text-right text-red-400">
                      {m.refunded_amount > 0 ? formatCOP(m.refunded_amount) : '—'}
                    </td>
                    <td className="px-6 py-3 text-right text-green-400 font-semibold">{formatCOP(m.net_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refunds detail */}
      <RefundsTable movieData={movieReport} />
    </div>
  );
};

export default AnalyticsTab;
