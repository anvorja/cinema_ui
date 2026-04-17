// src/components/admin/AdminSidebar.tsx
import { Film, Building2, Users, ShoppingCart, QrCode, BarChart2, LogOut, RefreshCw } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../ui/sidebar';

const NAV_ITEMS = [
  { id: 'movies',    label: 'Películas',  icon: Film,         description: 'Catálogo' },
  { id: 'theaters',  label: 'Teatros',    icon: Building2,    description: 'Salas' },
  { id: 'users',     label: 'Usuarios',   icon: Users,        description: 'Clientes' },
  { id: 'purchases', label: 'Compras',    icon: ShoppingCart, description: 'Transacciones' },
  { id: 'tickets',   label: 'Boletería',  icon: QrCode,       description: 'Validar boletos' },
  { id: 'analytics', label: 'Analítica',  icon: BarChart2,    description: 'Ventas e ingresos' },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: any;
  onLogout: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const AdminSidebar = ({ activeTab, onTabChange, user, onLogout, onRefresh, loading }: AdminSidebarProps) => {
  return (
    <Sidebar
      className="border-r-0"
      style={
        {
          '--sidebar-background': '9 9 11',        // zinc-950
          '--sidebar-foreground': '250 250 250',
          '--sidebar-border': '39 39 42',           // zinc-800
          '--sidebar-accent': '24 24 27',           // zinc-900
          '--sidebar-accent-foreground': '250 250 250',
          '--sidebar-primary': '59 130 246',        // blue-500
          '--sidebar-primary-foreground': '255 255 255',
          '--sidebar-muted': '82 82 91',            // zinc-500
          '--sidebar-muted-foreground': '113 113 122',
          '--sidebar-ring': '59 130 246',
        } as React.CSSProperties
      }
    >
      {/* ── Logo / Branding ── */}
      <SidebarHeader className="px-4 py-5 bg-zinc-950 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none">Cinema Admin</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Panel de control</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="bg-zinc-950 px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-zinc-600 uppercase tracking-widest px-2 mb-1">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      className={`
                        group relative h-9 rounded-lg px-3 transition-all duration-150
                        ${isActive
                          ? 'bg-blue-600/15 text-blue-400 hover:bg-blue-600/20'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                        }
                      `}
                      tooltip={item.description}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-white'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 rounded-r-full" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: user + actions ── */}
      <SidebarFooter className="bg-zinc-950 border-t border-zinc-800/60 px-3 py-3 space-y-1">
        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <span className="text-blue-400 text-xs font-bold">
              {user?.first_name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate leading-none">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        <SidebarSeparator className="bg-zinc-800/60 my-1" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onRefresh}
              disabled={loading}
              className="h-8 rounded-lg px-3 text-zinc-500 hover:text-white hover:bg-zinc-800/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              tooltip="Actualizar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs">Actualizar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="h-8 rounded-lg px-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              tooltip="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
