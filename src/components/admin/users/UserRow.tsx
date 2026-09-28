// src/components/admin/users/UserRow.tsx
import { useState } from 'react';
import { Shield, User } from 'lucide-react';
import { TableRow, TableCell } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
  AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction,
} from '../../ui/alert-dialog';

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

const UserRow = ({ user, onToggle }: { user: any; onToggle: (id: number) => void }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isAdmin = user.role === 'admin';
  const willDisable = user.is_active;

  return (
    <>
      <TableRow className="border-board-line hover:bg-board-ground transition-colors">
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isAdmin ? 'bg-board-amber/15 ring-1 ring-board-amber/30' : 'bg-board-amber/15 ring-1 ring-board-amber/30'
            }`}>
              {isAdmin
                ? <Shield className="w-4 h-4 text-board-amberink" />
                : <User className="w-4 h-4 text-board-amberink" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-board-ink truncate">{user.first_name} {user.last_name}</p>
              <p className="text-[11px] text-board-mute">ID {user.id}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3 text-sm text-board-mute">{user.email}</TableCell>

        <TableCell className="py-3 text-sm text-board-mute">{user.phone || '—'}</TableCell>

        <TableCell className="py-3">
          {isAdmin ? (
            <Badge className="bg-board-amber/15 text-board-amberink border-board-amber/25 gap-1 text-[11px]">
              <Shield className="w-3 h-3" /> Admin
            </Badge>
          ) : (
            <Badge className="bg-board-amber/15 text-board-amberink border-board-amber/25 gap-1 text-[11px]">
              <User className="w-3 h-3" /> Cliente
            </Badge>
          )}
        </TableCell>

        <TableCell className="py-3">
          <Badge variant="outline" className={user.is_active
            ? 'border-board-ok/30 text-board-okink bg-board-ok/10 text-[11px]'
            : 'border-board-line2 text-board-mute bg-board-panel2/50 text-[11px]'
          }>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_active ? 'bg-board-ok' : 'bg-board-line2'}`} />
            {user.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </TableCell>

        <TableCell className="py-3 text-sm text-board-mute">
          {user.created_at ? fmt(user.created_at) : '—'}
        </TableCell>

        <TableCell className="py-3">
          {!isAdmin ? (
            <Switch
              checked={user.is_active}
              onCheckedChange={() => setConfirmOpen(true)}
              className="data-[state=checked]:bg-board-ok data-[state=unchecked]:bg-board-line"
            />
          ) : (
            <span className="text-xs text-board-ink2">—</span>
          )}
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-board-panel border-board-line text-board-ink max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-board-ink">
              {willDisable ? 'Deshabilitar usuario' : 'Habilitar usuario'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-board-mute">
              {willDisable
                ? <><strong className="text-board-ink">{user.first_name} {user.last_name}</strong> no podrá iniciar sesión hasta ser reactivado.</>
                : <><strong className="text-board-ink">{user.first_name} {user.last_name}</strong> recuperará acceso completo al sistema.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-board-panel2 border-board-line text-board-ink hover:bg-board-panel2">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(user.id)}
              className={willDisable
                ? 'bg-board-alarm hover:bg-board-alarm text-board-ink border-0'
                : 'bg-board-ok hover:bg-board-ok text-board-onamber border-0'
              }
            >
              {willDisable ? 'Deshabilitar' : 'Habilitar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserRow;
