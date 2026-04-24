// src/components/admin/users/UsersTab.tsx
import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import UserRow from './UserRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';
import { Card, CardContent } from '../../ui/card';

const selectCls = 'w-36 h-9 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white text-sm focus:ring-gray-300 dark:focus:ring-zinc-600';
const contentCls = 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white';
const itemCls = 'text-gray-700 dark:text-zinc-300 focus:bg-gray-100 dark:dark:focus:bg-zinc-800 focus:text-gray-900 dark:focus:text-white cursor-pointer';

const UsersTabSkeleton = () => (
  <div className="space-y-5">
    <div className="flex gap-3">
      <Skeleton className="h-9 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-36 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
      <Skeleton className="h-9 w-36 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-5 gap-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />)}
    </div>
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-100 dark:border-zinc-800/60">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-28 bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-2.5 w-16 bg-gray-200 dark:bg-zinc-800" />
          </div>
          <Skeleton className="h-3 w-36 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-14 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <Skeleton className="h-5 w-14 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <Skeleton className="h-5 w-9 bg-gray-200 dark:bg-zinc-800 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

const UsersTab = ({ users, loading, onToggleUser, searchTerm, onSearchChange }) => {
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.includes(q);
    const matchRole   = filterRole   === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && u.is_active) ||
      (filterStatus === 'inactive' && !u.is_active);
    return matchSearch && matchRole && matchStatus;
  });

  const exportCSV = () => {
    const rows = [
      ['ID','Nombre','Apellido','Email','Teléfono','Rol','Estado','Registro'],
      ...filtered.map(u => [
        u.id, u.first_name, u.last_name, u.email, u.phone,
        u.role === 'admin' ? 'Administrador' : 'Cliente',
        u.is_active ? 'Activo' : 'Inactivo',
        new Date(u.created_at).toLocaleDateString('es-ES'),
      ]),
    ].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv;charset=utf-8;' }));
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <UsersTabSkeleton />;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 h-9 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all"      className={itemCls}>Todos los roles</SelectItem>
              <SelectItem value="customer" className={itemCls}>Clientes</SelectItem>
              <SelectItem value="admin"    className={itemCls}>Administradores</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className={selectCls}><SelectValue /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all"      className={itemCls}>Todos los estados</SelectItem>
              <SelectItem value="active"   className={itemCls}>Activos</SelectItem>
              <SelectItem value="inactive" className={itemCls}>Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 h-9 px-3 bg-emerald-700/20 hover:bg-emerald-700/30 border border-emerald-600/30 text-emerald-400 text-sm rounded-lg transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total',    value: users.length,                                      color: 'text-gray-900 dark:text-white' },
          { label: 'Clientes', value: users.filter(u => u.role === 'customer').length,    color: 'text-blue-400' },
          { label: 'Admins',   value: users.filter(u => u.role === 'admin').length,       color: 'text-violet-400' },
          { label: 'Activos',  value: users.filter(u => u.is_active).length,             color: 'text-emerald-400' },
          { label: 'Filtrados',value: filtered.length,                                    color: 'text-amber-400' },
        ].map(s => (
          <Card key={s.label} className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 dark:text-zinc-600 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 dark:text-zinc-600 text-sm">
            {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
              ? 'Sin usuarios que coincidan con los filtros'
              : 'No hay usuarios registrados'}

          </div>
        ) : (
          <Table className="">
            <TableHeader className="">
              <TableRow className="border-gray-200 dark:border-zinc-800 hover:bg-transparent bg-gray-50 dark:bg-zinc-900/60">
                {['Usuario','Email','Teléfono','Rol','Estado','Registro','Activo'].map(h => (
                  <TableHead key={h} className="text-[10px] text-gray-500 dark:text-zinc-600 uppercase tracking-widest py-3">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {filtered.map(u => <UserRow key={u.id} user={u} onToggle={onToggleUser} />)}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
