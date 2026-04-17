// src/components/admin/movies/MovieCard.tsx
import { useState } from 'react';
import { Edit2, Film, Clock, Ticket, Star, Eye, EyeOff } from 'lucide-react';
import { TableRow, TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '../../ui/alert-dialog';

const fmtCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  in_theaters: { label: 'En cartelera', cls: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  coming_soon: { label: 'Próximamente', cls: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  ended:       { label: 'Terminada',    cls: 'border-zinc-600/50  text-zinc-500  bg-zinc-800/50'    },
};

// ── Grid mode: Poster Card ─────────────────────────────────────────────────────
const PosterCard = ({ movie, onEdit, onToggle }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = STATUS_MAP[movie.status] ?? STATUS_MAP.ended;
  const occupancy = movie.max_capacity > 0
    ? Math.round(((movie.max_capacity - (movie.available_tickets ?? 0)) / movie.max_capacity) * 100)
    : 0;

  return (
    <>
      <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer">
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-3">
              <Film className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
              <p className="text-xs text-gray-400 dark:text-zinc-600 text-center px-4 leading-relaxed">{movie.title}</p>
            </div>
          )}

          {/* Gradient overlay — siempre visible en la parte inferior */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Hover overlay con acciones */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onEdit(movie)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                movie.is_active
                  ? 'bg-red-600/80 hover:bg-red-600 text-white'
                  : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
              }`}
            >
              {movie.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {movie.is_active ? 'Ocultar' : 'Activar'}
            </button>
          </div>

          {/* Badges superiores */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
            <Badge variant="outline" className={`text-[10px] backdrop-blur-sm ${status.cls}`}>
              {status.label}
            </Badge>
            <div className="flex flex-col items-end gap-1">
              {!movie.is_active && (
                <Badge variant="outline" className="text-[10px] backdrop-blur-sm border-zinc-600 text-zinc-400 bg-black/60">
                  Inactiva
                </Badge>
              )}
              {movie.is_presale && (
                <Badge variant="outline" className="text-[10px] backdrop-blur-sm border-amber-500/40 text-amber-400 bg-black/60">
                  Preventa
                </Badge>
              )}
            </div>
          </div>

          {/* Info en la parte inferior del poster */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1.5">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-400 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {movie.genre}
              </span>
              <span className="text-[10px] text-zinc-400 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star className="h-2.5 w-2.5" />{movie.rating}
              </span>
              <span className="text-[10px] text-zinc-400 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />{movie.duration}m
              </span>
            </div>
          </div>
        </div>

        {/* Footer fuera del poster */}
        <div className="px-3 py-2.5 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800">
          <span className="text-sm font-semibold text-emerald-400">{fmtCOP(movie.price)}</span>
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3 w-3 text-gray-400 dark:text-zinc-600" />
            <span className="text-[11px] text-gray-400 dark:text-zinc-500">
              {movie.available_tickets ?? 0}/{movie.max_capacity}
            </span>
            {/* Mini occupancy bar */}
            <div className="w-12 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancy > 80 ? 'bg-red-500' : occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AlertDialog toggle */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className={movie.is_active ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}>
              {movie.is_active ? 'Ocultar película' : 'Activar película'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-zinc-400">
              {movie.is_active
                ? `"${movie.title}" dejará de estar visible para los usuarios.`
                : `"${movie.title}" volverá a aparecer en la cartelera.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(movie.id, movie.is_active)}
              className={movie.is_active
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
            >
              {movie.is_active ? 'Ocultar' : 'Activar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── List mode: Table Row ───────────────────────────────────────────────────────
const ListRow = ({ movie, onEdit, onToggle }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = STATUS_MAP[movie.status] ?? STATUS_MAP.ended;

  return (
    <>
      <TableRow className="border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
        {/* Poster + Título */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-9 h-[52px] object-cover rounded shrink-0"
              />
            ) : (
              <div className="w-9 h-[52px] bg-gray-100 dark:bg-zinc-800 rounded flex items-center justify-center shrink-0">
                <Film className="h-4 w-4 text-gray-300 dark:text-zinc-600" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{movie.title}</p>
              {movie.director && (
                <p className="text-[11px] text-gray-400 dark:text-zinc-600 truncate max-w-[180px]">{movie.director}</p>
              )}
            </div>
          </div>
        </TableCell>

        {/* Género */}
        <TableCell className="py-3">
          <span className="text-xs text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
            {movie.genre}
          </span>
        </TableCell>

        {/* Rating */}
        <TableCell className="py-3">
          <span className="text-xs font-mono text-gray-600 dark:text-zinc-400">{movie.rating}</span>
        </TableCell>

        {/* Duración */}
        <TableCell className="py-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500">
            <Clock className="h-3 w-3" />
            {movie.duration} min
          </div>
        </TableCell>

        {/* Precio */}
        <TableCell className="py-3 text-sm font-semibold text-emerald-400">
          {fmtCOP(movie.price)}
        </TableCell>

        {/* Estado cartelera */}
        <TableCell className="py-3">
          <Badge variant="outline" className={`text-[10px] ${status.cls}`}>
            {status.label}
          </Badge>
        </TableCell>

        {/* Estreno */}
        <TableCell className="py-3 text-xs text-gray-500 dark:text-zinc-500">
          {movie.release_date ? fmtDate(movie.release_date) : '—'}
        </TableCell>

        {/* Activo + acciones */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={movie.is_active}
              onCheckedChange={() => setConfirmOpen(true)}
              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-zinc-700"
            />
            <button
              onClick={() => onEdit(movie)}
              className="p-1.5 text-gray-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className={movie.is_active ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}>
              {movie.is_active ? 'Ocultar película' : 'Activar película'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-zinc-400">
              {movie.is_active
                ? `"${movie.title}" dejará de estar visible para los usuarios.`
                : `"${movie.title}" volverá a aparecer en la cartelera.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(movie.id, movie.is_active)}
              className={movie.is_active
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
            >
              {movie.is_active ? 'Ocultar' : 'Activar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── Export ─────────────────────────────────────────────────────────────────────
const MovieCard = ({ movie, onEdit, onToggle, viewMode = 'grid' }) => {
  if (viewMode === 'list') return <ListRow movie={movie} onEdit={onEdit} onToggle={onToggle} />;
  return <PosterCard movie={movie} onEdit={onEdit} onToggle={onToggle} />;
};

export default MovieCard;
