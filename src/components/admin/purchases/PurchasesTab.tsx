// src/components/admin/purchases/PurchasesTab.tsx
import { useState } from 'react';
import { Download, Search, TrendingUp } from 'lucide-react';
import PurchaseRow from './PurchaseRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Card, CardContent } from '../../ui/card';

const selectCls = 'w-40 h-9 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:ring-gray-300 dark:focus:ring-zinc-600';
const contentCls = 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white';
const itemCls    = 'text-gray-700 dark:text-zinc-300 focus:bg-gray-100 dark:dark:focus:bg-zinc-800 focus:text-gray-900 dark:focus:text-white cursor-pointer';

const fmtCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const PurchasesTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />)}
    </div>
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-100 dark:border-zinc-800/60">
          <Skeleton className="h-7 w-7 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0" />
          <Skeleton className="h-3 w-12 bg-gray-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28 bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-2.5 w-36 bg-gray-200 dark:bg-zinc-800" />
          </div>
          <Skeleton className="h-3.5 w-32 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-3 w-10 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  </div>
);

const PurchasesTab = ({ purchases, loading, searchTerm, onSearchChange }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter,   setDateFilter]   = useState('all');

  const filtered = purchases.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      p.user?.first_name?.toLowerCase().includes(q) ||
      p.user?.last_name?.toLowerCase().includes(q)  ||
      p.user?.email?.toLowerCase().includes(q)       ||
      p.movie?.title?.toLowerCase().includes(q)      ||
      p.id.toString().includes(q);

    const matchStatus = filterStatus === 'all' || p.status === filterStatus;

    let matchDate = true;
    if (dateFilter !== 'all' && p.created_at) {
      const d = new Date(p.created_at);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (dateFilter === 'today')  matchDate = d >= today;
      if (dateFilter === 'week')   matchDate = d >= new Date(now.getTime() - 7  * 86400000);
      if (dateFilter === 'month')  matchDate = d >= new Date(now.getTime() - 30 * 86400000);
    }
    return matchSearch && matchStatus && matchDate;
  });

  const revenue = filtered.reduce((s, p) => s + (p.total_amount || 0), 0);
  const confirmed = filtered.filter(p => p.status === 'confirmed').length;
  const pending   = filtered.filter(p => p.status === 'pending').length;
  const tickets   = filtered.reduce((s, p) => s + (p.quantity || 0), 0);

  const exportCSV = () => {
    const rows = [
      ['ID','Cliente','Email','Película','Cantidad','Total','Estado','Fecha'],
      ...filtered.map(p => [
        p.id,
        `"${p.user?.first_name} ${p.user?.last_name}"`,
        p.user?.email,
        `"${p.movie?.title}"`,
        p.quantity,
        p.total_amount,
        p.status,
        new Date(p.created_at).toLocaleDateString('es-ES'),
      ]),
    ].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv;charset=utf-8;' }));
    a.download = `compras_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <PurchasesTabSkeleton />;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por cliente, película o ID..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 h-9 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all"   className={itemCls}>Todas las fechas</SelectItem>
              <SelectItem value="today" className={itemCls}>Hoy</SelectItem>
              <SelectItem value="week"  className={itemCls}>Última semana</SelectItem>
              <SelectItem value="month" className={itemCls}>Último mes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all"       className={itemCls}>Todos los estados</SelectItem>
              <SelectItem value="confirmed" className={itemCls}>Confirmadas</SelectItem>
              <SelectItem value="pending"   className={itemCls}>Pendientes</SelectItem>
              <SelectItem value="cancelled" className={itemCls}>Canceladas</SelectItem>
              <SelectItem value="refunded"  className={itemCls}>Reembolsadas</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 h-9 px-3 bg-emerald-700/20 hover:bg-emerald-700/30 border border-emerald-600/30 text-emerald-400 text-sm rounded-lg transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Compras',     value: filtered.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Confirmadas', value: confirmed,        color: 'text-emerald-400' },
          { label: 'Pendientes',  value: pending,          color: 'text-amber-400' },
          { label: 'Tickets',     value: tickets,          color: 'text-blue-400' },
          { label: 'Ingresos',    value: fmtCOP(revenue),  color: 'text-emerald-400', small: true },
        ].map(s => (
          <Card key={s.label} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {s.label === 'Ingresos' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                <p className="text-xs text-zinc-600">{s.label}</p>
              </div>
              <p className={`font-bold ${s.color} ${s.small ? 'text-base' : 'text-xl'}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-zinc-600 text-sm">
            {searchTerm || filterStatus !== 'all' || dateFilter !== 'all'
              ? 'Sin compras que coincidan con los filtros'
              : 'No hay compras registradas'}
          </div>
        ) : (
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-gray-200 dark:border-zinc-800 hover:bg-transparent bg-gray-50 dark:bg-zinc-900/60">
                {['ID','Cliente','Película','Cantidad','Total','Estado','Fecha'].map(h => (
                  <TableHead key={h} className="text-[10px] text-zinc-600 uppercase tracking-widest py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filtered.map(p => <PurchaseRow key={p.id} purchase={p} />)}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PurchasesTab;
