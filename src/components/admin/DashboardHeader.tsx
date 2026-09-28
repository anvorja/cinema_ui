// src/components/admin/DashboardHeader.tsx
import { RefreshCw } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';

const NAV_LABELS: Record<string, string> = {
  movies:    'Películas',
  theaters:  'Teatros',
  users:     'Usuarios',
  purchases: 'Compras',
  tickets:   'Boletería',
  analytics: 'Analítica',
};

interface DashboardHeaderProps {
  activeTab: string;
  onRefresh: () => void;
  loading: boolean;
}

const DashboardHeader = ({ activeTab, onRefresh, loading }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-board-line bg-board-ground px-4">
      <SidebarTrigger className="rounded-[3px] p-2 text-board-mute hover:bg-board-panel2 hover:text-board-ink" />

      <Separator orientation="vertical" className="h-5 bg-board-line" />

      <h1 className="font-board text-2xl font-bold leading-none tracking-[0.06em] text-board-ink uppercase">
        {NAV_LABELS[activeTab] ?? activeTab}
      </h1>

      <div className="flex-1" />

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex h-10 items-center gap-2 rounded-[3px] border border-board-line2 px-3 font-board text-base font-semibold tracking-[0.06em] uppercase text-board-ink2 hover:border-board-amber hover:text-board-amberink disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:block">Actualizar</span>
      </button>
    </header>
  );
};

export default DashboardHeader;
