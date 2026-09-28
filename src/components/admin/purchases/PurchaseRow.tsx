// src/components/admin/purchases/PurchaseRow.tsx
import { User, Film, Ticket } from 'lucide-react';
import { TableRow, TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const fmtCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const STATUS: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmada',   className: 'border-board-ok/30 text-board-okink bg-board-ok/10' },
  pending:   { label: 'Pendiente',    className: 'border-board-amber/30 text-board-amberink bg-board-amber/10'   },
  cancelled: { label: 'Cancelada',    className: 'border-board-alarm/30 text-board-alarmink bg-board-alarm/10'     },
  refunded:  { label: 'Reembolsada',  className: 'border-board-amber/30 text-board-amberink bg-board-amber/10'    },
};

const PurchaseRow = ({ purchase }: { purchase: any }) => {
  const status = STATUS[purchase.status] ?? { label: 'Desconocido', className: 'border-board-line2 text-board-mute bg-board-panel2/50' };

  return (
    <TableRow className="border-board-line hover:bg-board-ground transition-colors">
      {/* ID */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-board-amber/15 ring-1 ring-board-amber/30 flex items-center justify-center shrink-0">
            <Ticket className="w-3.5 h-3.5 text-board-amberink" />
          </div>
          <span className="text-sm font-mono font-medium text-board-ink2">#{purchase.id}</span>
        </div>
      </TableCell>

      {/* Cliente */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-board-amber/15 ring-1 ring-board-amber/30 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-board-amberink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-board-ink truncate">
              {purchase.user?.first_name} {purchase.user?.last_name}
            </p>
            <p className="text-[11px] text-board-mute truncate">{purchase.user?.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Película */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-board-amber/15 ring-1 ring-board-amber/30 flex items-center justify-center shrink-0">
            <Film className="w-3.5 h-3.5 text-board-amberink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-board-ink truncate">
              {purchase.movie?.title || 'Sin título'}
            </p>
            {purchase.movie?.genre && (
              <p className="text-[11px] text-board-mute">{purchase.movie.genre}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Cantidad */}
      <TableCell className="py-3">
        <span className="text-sm font-medium text-board-ink">{purchase.quantity}</span>
        <span className="ml-1 text-[11px] text-board-mute">{purchase.quantity === 1 ? 'ticket' : 'tickets'}</span>
      </TableCell>

      {/* Total */}
      <TableCell className="py-3 text-sm font-semibold text-board-okink">
        {fmtCOP(purchase.total_amount || 0)}
      </TableCell>

      {/* Estado */}
      <TableCell className="py-3">
        <Badge variant="outline" className={`text-[11px] ${status.className}`}>
          {status.label}
        </Badge>
      </TableCell>

      {/* Fecha */}
      <TableCell className="py-3 text-sm text-board-mute">
        {purchase.created_at ? fmtDate(purchase.created_at) : '—'}
      </TableCell>
    </TableRow>
  );
};

export default PurchaseRow;
