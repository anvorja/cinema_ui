// src/components/layout/UserProfileDropdown.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Ticket, CreditCard, Settings, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useAuth from '../../hooks/useAuth.js';

interface UserProfileDropdownProps {
    user: { name?: string; email?: string; avatar?: string } | null;
    onOpenProfile?: () => void;
}

const UserProfileDropdown = ({ user, onOpenProfile }: UserProfileDropdownProps) => {
    const { logout, loading } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = async () => {
        if (loading || isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logout();
        } catch {
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');
            setTimeout(() => { window.location.href = '/'; }, 500);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-1.5 py-1 rounded-xl transition-all duration-200 hover:bg-white/[0.08] outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 group">
                    <Avatar className="h-8 w-8 ring-1 ring-white/20 group-hover:ring-white/35 transition-all">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                            {getUserInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-white/85 font-medium text-sm group-hover:text-white transition-colors">
                        {user?.name}
                    </span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 bg-slate-900/95 backdrop-blur-xl border-white/[0.12] text-white shadow-2xl shadow-black/50 rounded-xl p-0 overflow-hidden"
            >
                {/* ── User info header ── */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
                    <Avatar className="h-9 w-9 ring-1 ring-white/15 shrink-0">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                            {getUserInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-white/90 font-medium text-sm leading-tight truncate">
                            {user?.name || 'Usuario'}
                        </p>
                        <p className="text-white/40 text-xs leading-tight truncate mt-0.5">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* ── Menu items ── */}
                <div className="p-1.5 space-y-0.5">
                    <DropdownMenuItem
                        inset={false}
                        onClick={onOpenProfile}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/70 hover:text-white focus:text-white hover:bg-white/[0.07] focus:bg-white/[0.07] cursor-pointer transition-colors"
                    >
                        <User className="w-4 h-4 shrink-0" />
                        <span className="text-sm">Mi Perfil</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem inset={false} className="" asChild>
                        <Link
                            to="/profile/purchases"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/70 hover:text-white focus:text-white hover:bg-white/[0.07] focus:bg-white/[0.07] cursor-pointer transition-colors text-sm"
                        >
                            <Ticket className="w-4 h-4 shrink-0" />
                            <span>Mis Compras</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem inset={false} className="" asChild>
                        <Link
                            to="/profile/transactions"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/70 hover:text-white focus:text-white hover:bg-white/[0.07] focus:bg-white/[0.07] cursor-pointer transition-colors text-sm"
                        >
                            <CreditCard className="w-4 h-4 shrink-0" />
                            <span>Mis Transacciones</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem inset={false} className="" asChild>
                        <Link
                            to="/profile/settings"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/70 hover:text-white focus:text-white hover:bg-white/[0.07] focus:bg-white/[0.07] cursor-pointer transition-colors text-sm"
                        >
                            <Settings className="w-4 h-4 shrink-0" />
                            <span>Configuración</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/[0.08] mx-0 my-0" />

                {/* ── Logout ── */}
                <div className="p-1.5">
                    <DropdownMenuItem
                        inset={false}
                        onClick={handleLogout}
                        disabled={loading || isLoggingOut}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-400/80 hover:text-red-300 focus:text-red-300 hover:bg-red-500/[0.1] focus:bg-red-500/[0.1] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span className="text-sm">
                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </span>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { UserProfileDropdown };
