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
      <TableRow className="border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
        <TableCell className="py-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isAdmin ? 'bg-violet-500/15 ring-1 ring-violet-500/30' : 'bg-blue-500/15 ring-1 ring-blue-500/30'
            }`}>
              {isAdmin
                ? <Shield className="w-4 h-4 text-violet-400" />
                : <User className="w-4 h-4 text-blue-400" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.first_name} {user.last_name}</p>
              <p className="text-[11px] text-zinc-600">ID {user.id}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-400">{user.email}</TableCell>

        <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-500">{user.phone || '—'}</TableCell>

        <TableCell className="py-3">
          {isAdmin ? (
            <Badge className="bg-violet-500/15 text-violet-300 border-violet-500/25 gap-1 text-[11px]">
              <Shield className="w-3 h-3" /> Admin
            </Badge>
          ) : (
            <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/25 gap-1 text-[11px]">
              <User className="w-3 h-3" /> Cliente
            </Badge>
          )}
        </TableCell>

        <TableCell className="py-3">
          <Badge variant="outline" className={user.is_active
            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[11px]'
            : 'border-zinc-700 text-zinc-500 bg-zinc-800/50 text-[11px]'
          }>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
            {user.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        </TableCell>

        <TableCell className="py-3 text-sm text-gray-500 dark:text-zinc-500">
          {user.created_at ? fmt(user.created_at) : '—'}
        </TableCell>

        <TableCell className="py-3">
          {!isAdmin ? (
            <Switch
              checked={user.is_active}
              onCheckedChange={() => setConfirmOpen(true)}
              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-zinc-700"
            />
          ) : (
            <span className="text-xs text-zinc-700">—</span>
          )}
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              {willDisable ? 'Deshabilitar usuario' : 'Habilitar usuario'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-zinc-400">
              {willDisable
                ? <><strong className="text-gray-900 dark:text-white">{user.first_name} {user.last_name}</strong> no podrá iniciar sesión hasta ser reactivado.</>
                : <><strong className="text-gray-900 dark:text-white">{user.first_name} {user.last_name}</strong> recuperará acceso completo al sistema.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onToggle(user.id)}
              className={willDisable
                ? 'bg-red-600 hover:bg-red-700 text-white border-0'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-0'
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
