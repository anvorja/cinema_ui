// src/components/admin/movies/MoviesTab.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Grid, List, Film, Clapperboard, Eye, EyeOff } from 'lucide-react';
import MovieCard from './MovieCard';
import { Card, CardContent } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';

const selectCls = 'w-40 h-9 bg-board-panel border-board-line2 text-board-ink text-sm focus:ring-board-line2';
const contentCls = 'bg-board-panel border-board-line text-board-ink';
const itemCls    = 'text-board-ink focus:bg-board-panel2 focus:text-board-ink cursor-pointer';

// ── Skeleton ───────────────────────────────────────────────────────────────────
const MoviesTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-board-panel2 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-board-panel2 rounded-lg" />
      <Skeleton className="h-9 w-20 bg-board-panel2 rounded-lg ml-auto" />
      <Skeleton className="h-9 w-32 bg-board-panel2 rounded-lg" />
    </div>
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 bg-board-panel2 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full aspect-[2/3] bg-board-panel2 rounded-xl" />
          <Skeleton className="h-3 w-3/4 bg-board-panel2 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const MoviesTab = ({ movies, loading, onToggleMovie, searchTerm, onSearchChange }) => {
  const navigate = useNavigate();
  const [viewMode,     setViewMode]     = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = movies.filter(m => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      m.title?.toLowerCase().includes(q) ||
      m.genre?.toLowerCase().includes(q)  ||
      m.director?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active'   && m.is_active)  ||
      (filterStatus === 'inactive' && !m.is_active) ||
      (filterStatus === 'presale'  && m.is_presale);
    return matchSearch && matchStatus;
  });

  if (loading) return <MoviesTabSkeleton />;

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-board-mute" />
            <input
              type="text"
              placeholder="Buscar por título, género o director..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-board-panel border border-board-line2 rounded-lg text-sm text-board-ink placeholder-board-mute focus:outline-none focus:ring-1 focus:ring-board-line2"
            />
          </div>

          {/* Status filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all"      className={itemCls}>Todos los estados</SelectItem>
              <SelectItem value="active"   className={itemCls}>Activas</SelectItem>
              <SelectItem value="inactive" className={itemCls}>Inactivas</SelectItem>
              <SelectItem value="presale"  className={itemCls}>Preventa</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex items-center bg-board-panel border border-board-line rounded-lg p-0.5 ml-auto sm:ml-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-board-panel2 text-board-ink' : 'text-board-mute hover:text-board-ink'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-board-panel2 text-board-ink' : 'text-board-mute hover:text-board-ink'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nueva Película */}
        <button
          onClick={() => navigate('/admin/peliculas/nueva')}
          className="flex items-center gap-1.5 h-9 px-4 bg-board-amber hover:bg-board-amberpress text-board-onamber text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Película</span>
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: movies.length,                               color: 'text-board-ink', icon: Film },
          { label: 'Activas',   value: movies.filter(m => m.is_active).length,      color: 'text-board-okink', icon: Eye },
          { label: 'Inactivas', value: movies.filter(m => !m.is_active).length,     color: 'text-board-alarmink',     icon: EyeOff },
          { label: 'Preventa',  value: movies.filter(m => m.is_presale).length,     color: 'text-board-amberink',   icon: Clapperboard },
        ].map(s => (
          <Card key={s.label} className="bg-board-panel border-board-line">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-4 w-4 ${s.color} shrink-0`} />
              <div>
                <p className="text-xs text-board-mute">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-board-line py-20 text-center">
          <Film className="h-10 w-10 text-board-ink2 mx-auto mb-3" />
          <p className="text-board-mute text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Sin películas que coincidan con los filtros'
              : 'No hay películas registradas'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => navigate('/admin/peliculas/nueva')}
              className="mt-4 flex items-center gap-1.5 h-9 px-4 bg-board-amber hover:bg-board-amberpress text-board-onamber text-sm font-medium rounded-lg transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              Crear primera película
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(m => (
            <MovieCard
              key={m.id}
              movie={m}
              viewMode="grid"
              onEdit={movie => navigate(`/admin/peliculas/${movie.id}/editar`, { state: { movie } })}
              onToggle={onToggleMovie}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-board-line overflow-hidden">
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-board-line hover:bg-transparent bg-board-ground">
                {['Película', 'Género', 'Clasif.', 'Duración', 'Precio', 'Estado', 'Estreno', 'Activo'].map(h => (
                  <TableHead key={h} className="text-[10px] text-board-mute uppercase tracking-widest py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filtered.map(m => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  viewMode="list"
                  onEdit={movie => navigate(`/admin/peliculas/${movie.id}/editar`, { state: { movie } })}
                  onToggle={onToggleMovie}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

    </div>
  );
};

export default MoviesTab;
