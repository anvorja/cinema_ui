// src/components/admin/purchases/PurchaseRow.tsx
import { User, Film, Ticket } from 'lucide-react';
import { TableRow, TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const fmtCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

const STATUS: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmada',   className: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  pending:   { label: 'Pendiente',    className: 'border-amber-500/30   text-amber-400   bg-amber-500/10'   },
  cancelled: { label: 'Cancelada',    className: 'border-red-500/30     text-red-400     bg-red-500/10'     },
  refunded:  { label: 'Reembolsada',  className: 'border-blue-500/30    text-blue-400    bg-blue-500/10'    },
};

const PurchaseRow = ({ purchase }: { purchase: any }) => {
  const status = STATUS[purchase.status] ?? { label: 'Desconocido', className: 'border-zinc-700 text-zinc-500 bg-zinc-800/50' };

  return (
    <TableRow className="border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
      {/* ID */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-500/15 ring-1 ring-blue-500/30 flex items-center justify-center shrink-0">
            <Ticket className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-sm font-mono font-medium text-zinc-300">#{purchase.id}</span>
        </div>
      </TableCell>

      {/* Cliente */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-violet-500/15 ring-1 ring-violet-500/30 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {purchase.user?.first_name} {purchase.user?.last_name}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-600 truncate">{purchase.user?.email}</p>
          </div>
        </div>
      </TableCell>

      {/* Película */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-500/15 ring-1 ring-amber-500/30 flex items-center justify-center shrink-0">
            <Film className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {purchase.movie?.title || 'Sin título'}
            </p>
            {purchase.movie?.genre && (
              <p className="text-[11px] text-zinc-600">{purchase.movie.genre}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Cantidad */}
      <TableCell className="py-3">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{purchase.quantity}</span>
        <span className="ml-1 text-[11px] text-zinc-600">{purchase.quantity === 1 ? 'ticket' : 'tickets'}</span>
      </TableCell>

      {/* Total */}
      <TableCell className="py-3 text-sm font-semibold text-emerald-400">
        {fmtCOP(purchase.total_amount || 0)}
      </TableCell>

      {/* Estado */}
      <TableCell className="py-3">
        <Badge variant="outline" className={`text-[11px] ${status.className}`}>
          {status.label}
        </Badge>
      </TableCell>

      {/* Fecha */}
      <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-500">
        {purchase.created_at ? fmtDate(purchase.created_at) : '—'}
      </TableCell>
    </TableRow>
  );
};

export default PurchaseRow;
