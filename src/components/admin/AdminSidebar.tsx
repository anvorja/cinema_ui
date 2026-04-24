// src/components/admin/AdminSidebar.tsx
import { Film, Building2, Users, ShoppingCart, QrCode, BarChart2, LogOut, RefreshCw, Sun, Moon } from 'lucide-react';
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
import { useTheme } from '../../hooks/useTheme';

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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // CSS vars are driven by index.css :root / .dark — no inline override needed
    <Sidebar className="border-r-0">

      {/* ── Logo / Branding ── */}
      <SidebarHeader className="px-4 py-5 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground leading-none">Cinema Admin</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Panel de control</p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="bg-sidebar px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 mb-1">
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
                          ? 'bg-blue-600/15 text-blue-500 hover:bg-blue-600/20'
                          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        }
                      `}
                      tooltip={item.description}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-500' : ''}`} />
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
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border px-3 py-3 space-y-1">
        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <span className="text-blue-500 text-xs font-bold">
              {user?.first_name?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate leading-none">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
          </div>
        </div>

        <SidebarSeparator className="bg-sidebar-border my-1" />

        <SidebarMenu>
          {/* Actualizar */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onRefresh}
              disabled={loading}
              className="h-8 rounded-lg px-3 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              tooltip="Actualizar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs">Actualizar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Theme toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              className="h-8 rounded-lg px-3 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
              tooltip={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {/* Animated icon swap */}
              <span className="relative w-3.5 h-3.5 shrink-0">
                <Sun
                  className={`absolute inset-0 w-3.5 h-3.5 transition-all duration-300 ${
                    isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                  }`}
                />
                <Moon
                  className={`absolute inset-0 w-3.5 h-3.5 transition-all duration-300 ${
                    isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
              </span>
              <span className="text-xs">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Cerrar sesión */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="h-8 rounded-lg px-3 text-sidebar-foreground/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
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
