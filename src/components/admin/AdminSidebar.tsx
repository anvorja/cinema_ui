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
import { useBoardTheme } from '../board/useBoardTheme';

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
  const { theme, toggle: toggleTheme } = useBoardTheme();
  const isDark = theme === 'dark';

  return (
    // CSS vars are driven by index.css :root / .dark — no inline override needed
    <Sidebar className="border-r-0">

      {/* ── Logo / Branding ── */}
      <SidebarHeader className="px-4 py-5 bg-sidebar border-b border-sidebar-border">
        <div className="min-w-0">
          <p className="font-board text-2xl font-bold leading-none tracking-[0.08em] text-sidebar-foreground">
            CINEMA<span className="text-board-amberink">PLUS</span>
          </p>
          <p className="mt-1 font-data text-[10px] uppercase text-muted-foreground">Panel de administración</p>
        </div>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="bg-sidebar px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="font-data text-[10px] text-muted-foreground uppercase tracking-widest px-2 mb-1">
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
                        group relative h-11 rounded-[3px] px-3
                        ${isActive
                          ? 'bg-board-amber/15 text-board-amberink hover:bg-board-amber/20'
                          : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        }
                      `}
                      tooltip={item.description}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-board-amberink' : ''}`} />
                      <span className="font-board text-lg font-semibold tracking-[0.06em] uppercase">{item.label}</span>
                      {isActive && (
                        <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 bg-board-amber" />
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
          <div className="w-8 h-8 rounded-[3px] bg-board-amber text-board-onamber flex items-center justify-center shrink-0">
            <span className="text-board-onamber text-xs font-bold">
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
              className="h-10 rounded-[3px] px-3 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="h-10 rounded-[3px] px-3 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
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
              className="h-10 rounded-[3px] px-3 text-sidebar-foreground/50 hover:text-board-alarmink hover:bg-board-alarm/10 transition-all"
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
