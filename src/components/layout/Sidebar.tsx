// src/components/layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clapperboard, User, CreditCard, LogOut, Utensils, Ticket, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import UserProfile from "../auth/UserProfile.jsx";
import useAuth from "../../hooks/useAuth.js";

interface NavItem {
    name: string;
    href?: string;
    icon: React.ElementType;
    color: string;
    action?: () => void;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    [key: string]: any;
}

const baseNavItems: NavItem[] = [
    { name: 'Películas', href: '/',        icon: Clapperboard, color: 'text-blue-300 bg-blue-500/15' },
    { name: 'Comidas',   href: '/comidas', icon: Utensils,     color: 'text-orange-300 bg-orange-500/15' },
];

const accountNavItems: NavItem[] = [
    { name: 'Mis compras',  href: '/profile/purchases', icon: Ticket,     color: 'text-emerald-300 bg-emerald-500/15' },
    { name: 'Mis tarjetas', href: '/profile/cards',     icon: CreditCard, color: 'text-violet-300 bg-violet-500/15' },
];

const Sidebar = ({ isOpen, onClose, onLoginClick, onRegisterClick }: SidebarProps) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserProfile, setShowUserProfile] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isItemActive = (href: string) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname.startsWith(href);
    };

    const displayName = user?.first_name
        ? [user.first_name, user.last_name].filter(Boolean).join(' ')
        : user?.name || '';
    const initials = (displayName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = async () => {
        try {
            onClose();
            await logout();
        } catch {
            onClose();
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');
            setTimeout(() => { window.location.href = '/'; }, 500);
        }
    };

    const navItems: NavItem[] = isAuthenticated
        ? [
            ...baseNavItems,
            ...accountNavItems,
            { name: 'Mi perfil', icon: User, color: 'text-cyan-300 bg-cyan-500/15', action: () => setShowUserProfile(true) },
        ]
        : baseNavItems;

    const itemClass = (active: boolean) => [
        'group flex items-center gap-3.5 w-full min-h-12 pl-2 pr-3 py-2 rounded-2xl text-[15px] font-medium',
        'transition-colors duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70',
        active
            ? 'bg-white/[0.14] border-white/20 text-white shadow-lg shadow-black/20'
            : 'border-transparent text-white/75 hover:text-white hover:bg-white/[0.08]',
    ].join(' ');

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <SheetContent
                    side="left"
                    className="w-[88vw] sm:w-[22rem] sm:max-w-none p-0 gap-0 bg-slate-950/70 backdrop-blur-2xl border-r border-white/15 text-white flex flex-col overflow-hidden [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:hover:opacity-100 [&>button]:top-5 [&>button]:right-4"
                >
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

                    {/* Resplandor ambiental: da profundidad al vidrio sin competir con el contenido */}
                    <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                    <div aria-hidden="true" className="pointer-events-none absolute bottom-16 -right-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

                    {/* Cabecera: identidad de usuario o marca */}
                    <div className="relative shrink-0 px-5 pt-5 pb-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => setShowUserProfile(true)}
                                className="flex items-center gap-3 pr-10 text-left w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                            >
                                <span className="h-12 w-12 shrink-0 rounded-2xl glass flex items-center justify-center text-base font-bold text-white">
                                    {initials}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-base font-semibold text-white">{displayName || 'Mi cuenta'}</span>
                                    <span className="block truncate text-sm text-white/65">{user?.email}</span>
                                </span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <img src="/icons8.png" alt="" className="w-10 h-10 rounded-xl shrink-0" />
                                <div>
                                    <p className="text-white font-bold text-base tracking-widest">CINEMAPLUS</p>
                                    <p className="text-sm text-white/65">Elige tu función en segundos</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <ScrollArea className="relative flex-1">
                        <nav className="px-3 pb-4" aria-label="Principal">
                            <ul className="space-y-1">
                                {navItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    const active = item.href ? isItemActive(item.href) : false;
                                    const inner = (
                                        <>
                                            <span className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${item.color}`}>
                                                <Icon className="w-[18px] h-[18px]" />
                                            </span>
                                            <span className="flex-1 text-left">{item.name}</span>
                                        </>
                                    );
                                    return (
                                        <li key={item.name}>
                                            {isAuthenticated && idx === baseNavItems.length && (
                                                <Separator className="bg-white/10 my-3" />
                                            )}
                                            {item.action ? (
                                                <button onClick={item.action} className={itemClass(false)}>{inner}</button>
                                            ) : (
                                                <Link to={item.href!} onClick={onClose} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
                                                    {inner}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Tarjeta Cinema+ */}
                            <button
                                className="group mt-4 w-full text-left rounded-2xl p-4 bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-300/25 hover:border-amber-300/45 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                                onClick={() => { onClose(); navigate('/recharge'); }}
                            >
                                <span className="flex items-center gap-2 text-amber-200 text-sm font-semibold">
                                    <CreditCard className="w-4 h-4" />
                                    Tarjeta Cinema+
                                </span>
                                <span className="mt-1 flex items-center justify-between text-sm text-white/75">
                                    Recarga y paga más rápido
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </button>
                        </nav>
                    </ScrollArea>

                    {/* Pie: acciones de cuenta */}
                    <div className="relative shrink-0 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-white/10 bg-slate-950/40">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="group w-full min-h-11 flex items-center justify-center gap-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-red-500/15 border border-white/15 hover:border-red-400/35 transition-colors text-white/80 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium text-sm">Cerrar sesión</span>
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => { onClose(); onLoginClick(); }}
                                    className="w-full min-h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => { onClose(); onRegisterClick(); }}
                                    className="w-full min-h-11 px-4 rounded-xl border border-white/20 hover:bg-white/[0.08] text-white/80 hover:text-white font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                                >
                                    Crear una cuenta
                                </button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {showUserProfile && (
                <UserProfile onClose={() => setShowUserProfile(false)} />
            )}
        </>
    );
};

export { Sidebar };
