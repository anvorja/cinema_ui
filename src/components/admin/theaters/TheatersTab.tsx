// src/components/admin/theaters/TheatersTab.tsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import TheaterRow from './TheaterRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Card, CardContent } from '../../ui/card';

const selectCls = 'w-40 h-9 bg-board-panel border-board-line2 text-board-ink text-sm focus:ring-board-line2';
const contentCls = 'bg-board-panel border-board-line text-board-ink';
const itemCls    = 'text-board-ink focus:bg-board-panel2 focus:text-board-ink cursor-pointer';

const TheatersTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-board-panel2 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-board-panel2 rounded-lg" />
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 bg-board-panel2 rounded-xl" />)}
    </div>
    <div className="rounded-xl border border-board-line overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b border-board-line">
          <Skeleton className="h-8 w-8 rounded-full bg-board-panel2 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32 bg-board-panel2" />
            <Skeleton className="h-2.5 w-16 bg-board-panel2" />
          </div>
          <Skeleton className="h-3 w-40 bg-board-panel2" />
          <Skeleton className="h-3 w-28 bg-board-panel2" />
          <Skeleton className="h-5 w-14 bg-board-panel2 rounded-full" />
          <Skeleton className="h-5 w-9 bg-board-panel2 rounded-full" />
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-board-mute" />
          <input
            type="text"
            placeholder="Buscar teatros..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 h-9 bg-board-panel border border-board-line2 rounded-lg text-sm text-board-ink placeholder-board-mute focus:outline-none focus:ring-1 focus:ring-board-line2"
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
          { label: 'Total',    value: theaters.length,                          color: 'text-board-ink' },
          { label: 'Activos',  value: theaters.filter(t => t.is_active).length,  color: 'text-board-okink' },
          { label: 'Inactivos',value: theaters.filter(t => !t.is_active).length, color: 'text-board-alarmink' },
        ].map(s => (
          <Card key={s.label} className="bg-board-panel border-board-line">
            <CardContent className="p-3">
              <p className="text-xs text-board-mute mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-board-line overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-board-mute text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Sin teatros que coincidan con los filtros'
              : 'No hay teatros registrados'}
          </div>
        ) : (
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-board-line hover:bg-transparent bg-board-ground">
                {['Teatro','Ubicación','Descripción','Estado','Creado','Activo'].map(h => (
                  <TableHead key={h} className="text-[10px] text-board-mute uppercase tracking-widest py-3">{h}</TableHead>
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
