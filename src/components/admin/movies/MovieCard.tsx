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
  in_theaters: { label: 'En cartelera', cls: 'border-board-ok/30 text-board-okink bg-board-ok/10' },
  coming_soon: { label: 'Próximamente', cls: 'border-board-amber/30 text-board-amberink bg-board-amber/10' },
  ended:       { label: 'Terminada',    cls: 'border-board-line2/50 text-board-mute bg-board-panel2/50'    },
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
      <div className="group relative rounded-xl overflow-hidden bg-board-panel border border-board-line hover:border-board-line2 transition-all duration-300 cursor-pointer">
        {/* Poster */}
        <div className="aspect-[2/3] relative overflow-hidden b-dark">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-board-panel2 flex flex-col items-center justify-center gap-3">
              <Film className="h-10 w-10 text-board-ink2" />
              <p className="text-xs text-board-mute text-center px-4 leading-relaxed">{movie.title}</p>
            </div>
          )}

          {/* Gradient overlay — siempre visible en la parte inferior */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Hover overlay con acciones */}
          <div className="absolute inset-0 bg-board-ground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onEdit(movie)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-board-amber hover:bg-board-amberpress text-board-onamber text-xs font-medium rounded-lg transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                movie.is_active
                  ? 'bg-board-alarm/80 hover:bg-board-alarm text-board-ink'
                  : 'bg-board-ok/80 hover:bg-board-ok text-board-ink'
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
                <Badge variant="outline" className="text-[10px] backdrop-blur-sm border-board-line2 text-board-mute bg-board-ground/60">
                  Inactiva
                </Badge>
              )}
              {movie.is_presale && (
                <Badge variant="outline" className="text-[10px] backdrop-blur-sm border-board-amber/40 text-board-amberink bg-board-ground/60">
                  Preventa
                </Badge>
              )}
            </div>
          </div>

          {/* Info en la parte inferior del poster */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="text-sm font-semibold text-board-ink leading-tight line-clamp-2 mb-1.5">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-board-mute bg-board-panel/10 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {movie.genre}
              </span>
              <span className="text-[10px] text-board-mute bg-board-panel/10 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star className="h-2.5 w-2.5" />{movie.rating}
              </span>
              <span className="text-[10px] text-board-mute bg-board-panel/10 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />{movie.duration}m
              </span>
            </div>
          </div>
        </div>

        {/* Footer fuera del poster */}
        <div className="px-3 py-2.5 flex items-center justify-between border-t border-board-line">
          <span className="text-sm font-semibold text-board-okink">{fmtCOP(movie.price)}</span>
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3 w-3 text-board-mute" />
            <span className="text-[11px] text-board-mute">
              {movie.available_tickets ?? 0}/{movie.max_capacity}
            </span>
            {/* Mini occupancy bar */}
            <div className="w-12 h-1 bg-board-panel2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancy > 80 ? 'bg-board-alarm' : occupancy > 50 ? 'bg-board-amber' : 'bg-board-ok'
                }`}
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AlertDialog toggle */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-board-panel border-board-line text-board-ink max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className={movie.is_active ? 'text-board-alarmink' : 'text-board-okink'}>
              {movie.is_active ? 'Ocultar película' : 'Activar película'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-board-mute">
              {movie.is_active
                ? `"${movie.title}" dejará de estar visible para los usuarios.`
                : `"${movie.title}" volverá a aparecer en la cartelera.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-board-panel2 border-board-line text-board-ink hover:bg-board-panel2 hover:text-board-ink">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(movie.id, movie.is_active)}
              className={movie.is_active
                ? 'bg-board-alarm hover:bg-board-alarm text-board-ink'
                : 'bg-board-ok hover:bg-board-ok text-board-onamber'}
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
      <TableRow className="border-board-line hover:bg-board-ground transition-colors">
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
              <div className="w-9 h-[52px] bg-board-panel2 rounded flex items-center justify-center shrink-0">
                <Film className="h-4 w-4 text-board-ink2" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-board-ink truncate max-w-[180px]">{movie.title}</p>
              {movie.director && (
                <p className="text-[11px] text-board-mute truncate max-w-[180px]">{movie.director}</p>
              )}
            </div>
          </div>
        </TableCell>

        {/* Género */}
        <TableCell className="py-3">
          <span className="text-xs text-board-ink2 bg-board-panel2 px-2 py-0.5 rounded">
            {movie.genre}
          </span>
        </TableCell>

        {/* Rating */}
        <TableCell className="py-3">
          <span className="text-xs font-mono text-board-ink2">{movie.rating}</span>
        </TableCell>

        {/* Duración */}
        <TableCell className="py-3">
          <div className="flex items-center gap-1 text-xs text-board-mute">
            <Clock className="h-3 w-3" />
            {movie.duration} min
          </div>
        </TableCell>

        {/* Precio */}
        <TableCell className="py-3 text-sm font-semibold text-board-okink">
          {fmtCOP(movie.price)}
        </TableCell>

        {/* Estado cartelera */}
        <TableCell className="py-3">
          <Badge variant="outline" className={`text-[10px] ${status.cls}`}>
            {status.label}
          </Badge>
        </TableCell>

        {/* Estreno */}
        <TableCell className="py-3 text-xs text-board-mute">
          {movie.release_date ? fmtDate(movie.release_date) : '—'}
        </TableCell>

        {/* Activo + acciones */}
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={movie.is_active}
              onCheckedChange={() => setConfirmOpen(true)}
              className="data-[state=checked]:bg-board-ok data-[state=unchecked]:bg-board-line"
            />
            <button
              onClick={() => onEdit(movie)}
              className="p-1.5 text-board-mute hover:text-board-amberink hover:bg-board-panel2 rounded-md transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-board-panel border-board-line text-board-ink max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className={movie.is_active ? 'text-board-alarmink' : 'text-board-okink'}>
              {movie.is_active ? 'Ocultar película' : 'Activar película'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-board-mute">
              {movie.is_active
                ? `"${movie.title}" dejará de estar visible para los usuarios.`
                : `"${movie.title}" volverá a aparecer en la cartelera.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-board-panel2 border-board-line text-board-ink hover:bg-board-panel2 hover:text-board-ink">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(movie.id, movie.is_active)}
              className={movie.is_active
                ? 'bg-board-alarm hover:bg-board-alarm text-board-ink'
                : 'bg-board-ok hover:bg-board-ok text-board-onamber'}
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
