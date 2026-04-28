// src/components/layout/MobileProfileMenu.tsx
import { Link } from 'react-router-dom';
import { User, Ticket, Settings, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import useAuth from '../../hooks/useAuth';

interface MobileProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: { name?: string; first_name?: string; last_name?: string; email?: string; avatar?: string } | null;
    onOpenProfile: () => void;
}

const menuItems = [
    { label: 'Mis Compras',   to: '/profile/purchases', icon: Ticket,   color: 'text-purple-400' },
    { label: 'Configuración', to: '/profile/settings',  icon: Settings, color: 'text-blue-400' },
];

const getDisplayName = (user: MobileProfileMenuProps['user']) => {
    if (user?.first_name || user?.last_name) {
        return [user?.first_name, user?.last_name].filter(Boolean).join(' ');
    }
    return user?.name || '';
};

const getUserInitials = (user: MobileProfileMenuProps['user']) => {
    if (user?.first_name && user?.last_name) {
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) return user.first_name[0].toUpperCase();
    if (user?.name) return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    return 'U';
};

const MobileProfileMenu = ({ isOpen, onClose, user, onOpenProfile }: MobileProfileMenuProps) => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        onClose();
        try {
            await logout();
        } catch {
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');
            setTimeout(() => { window.location.href = '/'; }, 500);
        }
    };

    const handleOpenProfile = () => {
        onClose();
        onOpenProfile();
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <SheetContent
                side="bottom"
                className="p-0 bg-slate-950 border-t border-white/[0.08] text-white rounded-t-2xl max-h-[85vh] flex flex-col [&>button]:text-white/50 [&>button]:hover:text-white [&>button]:top-3 [&>button]:right-4"
            >
                <SheetTitle className="sr-only">Menú de perfil</SheetTitle>

                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* User info */}
                <div className="flex items-center gap-3.5 px-5 py-4 border-b border-white/[0.08] shrink-0">
                    <Avatar className="h-12 w-12 ring-2 ring-white/15 shrink-0">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold">
                            {getUserInitials(user)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-base leading-tight truncate">
                            {getDisplayName(user)}
                        </p>
                        <p className="text-white/45 text-sm leading-tight truncate mt-0.5">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Menu items */}
                <div className="px-3 py-3 space-y-0.5 flex-1 overflow-y-auto">
                    {/* Mi Perfil */}
                    <button
                        onClick={handleOpenProfile}
                        className="group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-white/65 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.1] transition-all duration-150"
                    >
                        <User className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span className="text-sm font-medium">Mi Perfil</span>
                    </button>

                    {menuItems.map(({ label, to, icon: Icon, color }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={onClose}
                            className="group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-white/65 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.1] transition-all duration-150"
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                            <span className="text-sm font-medium">{label}</span>
                        </Link>
                    ))}

                    <Separator className="bg-white/[0.07] my-2" />

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/[0.1] active:bg-red-500/[0.15] transition-all duration-150"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Cerrar sesión</span>
                    </button>
                </div>

                {/* Safe area bottom padding */}
                <div className="h-safe-area-inset-bottom pb-4 shrink-0" />
            </SheetContent>
        </Sheet>
    );
};

export { MobileProfileMenu };
