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
      <TableRow className="border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 ring-1 ring-blue-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{theater.name}</p>
              <p className="text-[11px] text-zinc-600">ID {theater.id}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-400">{theater.location}</TableCell>

        <TableCell className="py-3 text-sm text-zinc-500 max-w-[200px] truncate">
          {theater.description || '—'}
        </TableCell>

        <TableCell className="py-3">
          <Badge variant="outline" className={theater.is_active
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px]'
            : 'border-zinc-700 text-zinc-500 bg-zinc-800/50 text-[11px]'
          }>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${theater.is_active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
            {theater.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </TableCell>

        <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-500">
          {theater.created_at ? fmt(theater.created_at) : '—'}
        </TableCell>

        <TableCell className="py-3">
          <Switch
            checked={theater.is_active}
            onCheckedChange={() => setConfirmOpen(true)}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-zinc-700"
          />
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              {willDisable ? 'Desactivar teatro' : 'Activar teatro'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-zinc-400">
              {willDisable
                ? <>El teatro <strong className="text-gray-900 dark:text-white">{theater.name}</strong> dejará de aparecer como opción de compra para los usuarios.</>
                : <>El teatro <strong className="text-gray-900 dark:text-white">{theater.name}</strong> volverá a estar disponible para la venta de entradas.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(theater.id)}
              className={willDisable
                ? 'bg-red-600 hover:bg-red-700 text-white border-0'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-0'
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
