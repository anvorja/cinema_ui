// src/components/admin/theaters/TheatersTab.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import TheaterRow from './TheaterRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Card, CardContent } from '../../ui/card';

const selectCls = 'w-40 h-9 bg-zinc-900 border-zinc-700 text-white text-sm focus:ring-zinc-600';
const contentCls = 'bg-zinc-900 border-zinc-700 text-white';
const itemCls    = 'text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer';

const TheatersTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-zinc-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 bg-zinc-800 rounded-xl" />)}
    </div>
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b border-zinc-800/60">
          <Skeleton className="h-8 w-8 rounded-full bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32 bg-zinc-800" />
            <Skeleton className="h-2.5 w-16 bg-zinc-800" />
          </div>
          <Skeleton className="h-3 w-40 bg-zinc-800" />
          <Skeleton className="h-3 w-28 bg-zinc-800" />
          <Skeleton className="h-5 w-14 bg-zinc-800 rounded-full" />
          <Skeleton className="h-5 w-9  bg-zinc-800 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const TheatersTab = ({ theaters, loading, onToggleTheater, searchTerm, onSearchChange }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = theaters.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchSearch = t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active'   && t.is_active) ||
      (filterStatus === 'inactive' && !t.is_active);
    return matchSearch && matchStatus;
  });

  if (loading) return <TheatersTabSkeleton />;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar teatros..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 h-9 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all"      className={itemCls}>Todos los estados</SelectItem>
            <SelectItem value="active"   className={itemCls}>Activos</SelectItem>
            <SelectItem value="inactive" className={itemCls}>Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',    value: theaters.length,                          color: 'text-white' },
          { label: 'Activos',  value: theaters.filter(t => t.is_active).length,  color: 'text-emerald-400' },
          { label: 'Inactivos',value: theaters.filter(t => !t.is_active).length, color: 'text-red-400' },
        ].map(s => (
          <Card key={s.label} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <p className="text-xs text-zinc-600 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-zinc-600 text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Sin teatros que coincidan con los filtros'
              : 'No hay teatros registrados'}
          </div>
        ) : (
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/60">
                {['Teatro','Ubicación','Descripción','Estado','Creado','Activo'].map(h => (
                  <TableHead key={h} className="text-[10px] text-zinc-600 uppercase tracking-widest py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filtered.map(t => <TheaterRow key={t.id} theater={t} onToggle={onToggleTheater} />)}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default TheatersTab;
