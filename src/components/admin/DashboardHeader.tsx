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
    <header className="sticky top-0 z-10 flex h-12 items-center gap-3
      border-b border-gray-200 dark:border-zinc-800/60
      bg-white/90 dark:bg-zinc-950/90
      backdrop-blur-sm px-4">

      <SidebarTrigger className="text-gray-400 dark:text-zinc-500
        hover:text-gray-700 dark:hover:text-white
        hover:bg-gray-100 dark:hover:bg-zinc-800
        rounded-md p-1.5 transition-colors" />

      <Separator orientation="vertical" className="h-4 bg-gray-200 dark:bg-zinc-800" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-gray-400 dark:text-zinc-600">Admin</span>
        <span className="text-gray-300 dark:text-zinc-700">/</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {NAV_LABELS[activeTab] ?? activeTab}
        </span>
      </div>

      <div className="flex-1" />

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors
          text-gray-500 dark:text-zinc-500
          hover:text-gray-900 dark:hover:text-white
          hover:bg-gray-100 dark:hover:bg-zinc-800
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:block">Actualizar</span>
      </button>
    </header>
  );
};

export default DashboardHeader;
