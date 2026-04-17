// src/components/admin/movies/MoviesTab.tsx
import { useState } from 'react';
import { Plus, Search, Grid, List, Film, Clapperboard, Eye, EyeOff } from 'lucide-react';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import { Card, CardContent } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';

const selectCls = 'w-40 h-9 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:ring-gray-300 dark:focus:ring-zinc-600';
const contentCls = 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white';
const itemCls    = 'text-gray-700 dark:text-zinc-300 focus:bg-gray-100 dark:focus:bg-zinc-800 focus:text-gray-900 dark:focus:text-white cursor-pointer';

// ── Skeleton ───────────────────────────────────────────────────────────────────
const MoviesTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-40 bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-20 bg-zinc-800 rounded-lg ml-auto" />
      <Skeleton className="h-9 w-32 bg-zinc-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 bg-zinc-800 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full aspect-[2/3] bg-zinc-800 rounded-xl" />
          <Skeleton className="h-3 w-3/4 bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const MoviesTab = ({ movies, loading, onCreateMovie, onUpdateMovie, onToggleMovie, searchTerm, onSearchChange }) => {
  const [movieModal, setMovieModal] = useState<{ isOpen: boolean; movie: any | null }>({ isOpen: false, movie: null });
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

  const handleCreate = async (data: any) => {
    await onCreateMovie(data);
    setMovieModal({ isOpen: false, movie: null });
  };

  const handleUpdate = async (data: any) => {
    await onUpdateMovie(movieModal.movie.id, data);
    setMovieModal({ isOpen: false, movie: null });
  };

  if (loading) return <MoviesTabSkeleton />;

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por título, género o director..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-600"
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
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-0.5 ml-auto sm:ml-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nueva Película */}
        <button
          onClick={() => setMovieModal({ isOpen: true, movie: null })}
          className="flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Película</span>
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: movies.length,                               color: 'text-gray-900 dark:text-white', icon: Film },
          { label: 'Activas',   value: movies.filter(m => m.is_active).length,      color: 'text-emerald-400', icon: Eye },
          { label: 'Inactivas', value: movies.filter(m => !m.is_active).length,     color: 'text-red-400',     icon: EyeOff },
          { label: 'Preventa',  value: movies.filter(m => m.is_presale).length,     color: 'text-amber-400',   icon: Clapperboard },
        ].map(s => (
          <Card key={s.label} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-4 w-4 ${s.color} shrink-0`} />
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-600">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 py-20 text-center">
          <Film className="h-10 w-10 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-zinc-600 text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Sin películas que coincidan con los filtros'
              : 'No hay películas registradas'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setMovieModal({ isOpen: true, movie: null })}
              className="mt-4 flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors mx-auto"
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
              onEdit={movie => setMovieModal({ isOpen: true, movie })}
              onToggle={onToggleMovie}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-gray-200 dark:border-zinc-800 hover:bg-transparent bg-gray-50 dark:bg-zinc-900/60">
                {['Película', 'Género', 'Clasif.', 'Duración', 'Precio', 'Estado', 'Estreno', 'Activo'].map(h => (
                  <TableHead key={h} className="text-[10px] text-gray-500 dark:text-zinc-600 uppercase tracking-widest py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filtered.map(m => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  viewMode="list"
                  onEdit={movie => setMovieModal({ isOpen: true, movie })}
                  onToggle={onToggleMovie}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Sheet / Modal */}
      <MovieModal
        movie={movieModal.movie}
        isOpen={movieModal.isOpen}
        onClose={() => setMovieModal({ isOpen: false, movie: null })}
        onSave={movieModal.movie ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default MoviesTab;
