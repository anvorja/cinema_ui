// src/components/admin/theaters/TheaterRow.tsx
import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { TableRow, TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from '../../ui/alert-dialog';

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const TheaterRow = ({ theater, onToggle }: { theater: any; onToggle: (id: number) => void }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const willDisable = theater.is_active;

  return (
    <>
      <TableRow className="border-board-line hover:bg-board-ground transition-colors">
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-board-amber/15 ring-1 ring-board-amber/30 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-board-amberink" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-board-ink truncate">{theater.name}</p>
              <p className="text-[11px] text-board-mute">ID {theater.id}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3 text-sm text-board-mute">{theater.location}</TableCell>

        <TableCell className="py-3 text-sm text-board-mute max-w-[200px] truncate">
          {theater.description || '—'}
        </TableCell>

        <TableCell className="py-3">
          <Badge variant="outline" className={theater.is_active
            ? 'border-board-ok/30 text-board-okink bg-board-ok/10 text-[11px]'
            : 'border-board-line2 text-board-mute bg-board-panel2/50 text-[11px]'
          }>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${theater.is_active ? 'bg-board-ok' : 'bg-board-line2'}`} />
            {theater.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </TableCell>

        <TableCell className="py-3 text-sm text-board-mute">
          {theater.created_at ? fmt(theater.created_at) : '—'}
        </TableCell>

        <TableCell className="py-3">
          <Switch
            checked={theater.is_active}
            onCheckedChange={() => setConfirmOpen(true)}
            className="data-[state=checked]:bg-board-ok data-[state=unchecked]:bg-board-line"
          />
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-board-panel border-board-line text-board-ink max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-board-ink">
              {willDisable ? 'Desactivar teatro' : 'Activar teatro'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-board-mute">
              {willDisable
                ? <>El teatro <strong className="text-board-ink">{theater.name}</strong> dejará de aparecer como opción de compra para los usuarios.</>
                : <>El teatro <strong className="text-board-ink">{theater.name}</strong> volverá a estar disponible para la venta de entradas.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-board-panel2 border-board-line text-board-ink hover:bg-board-panel2">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(theater.id)}
              className={willDisable
                ? 'bg-board-alarm hover:bg-board-alarm text-board-ink border-0'
                : 'bg-board-ok hover:bg-board-ok text-board-onamber border-0'
              }
            >
              {willDisable ? 'Desactivar' : 'Activar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TheaterRow;
