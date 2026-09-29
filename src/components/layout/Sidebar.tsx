// src/components/layout/Sidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CreditCard, LogOut, Utensils } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import useAuth from "../../hooks/useAuth.js";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    color: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    [key: string]: any;
}

const baseNavItems: NavItem[] = [
    { name: 'Películas', href: '/',        icon: Home,         color: 'text-blue-300 bg-blue-500/15' },
    { name: 'Comidas',   href: '/comidas', icon: Utensils,     color: 'text-orange-300 bg-orange-500/15' },
];

const Sidebar = ({ isOpen, onClose, onLoginClick, onRegisterClick }: SidebarProps) => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isItemActive = (href: string) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname.startsWith(href);
    };

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

    const navItems: NavItem[] = baseNavItems;

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

                    {/* Cabecera: marca */}
                    <div className="relative shrink-0 flex items-center gap-3 px-5 py-4 border-b border-white/10">
                        <img src="/icons8.png" alt="" className="w-9 h-9 rounded-xl shrink-0" />
                        <span className="text-white font-bold text-base tracking-widest">CINEMAPLUS</span>
                    </div>

                    <ScrollArea className="relative flex-1">
                        <nav className="px-3 pb-4" aria-label="Principal">
                            <ul className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isItemActive(item.href);
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
                                            <Link to={item.href} onClick={onClose} aria-current={active ? 'page' : undefined} className={itemClass(active)}>
                                                {inner}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Tarjeta Cinema+ */}
                            <button
                                className="group mt-4 w-full text-left rounded-2xl p-4 bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-300/25 hover:border-amber-300/45 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                                onClick={() => { onClose(); navigate('/recharge'); }}
                            >
                                <span className="flex items-center gap-3">
                                    <CreditCard className="w-[18px] h-[18px] text-amber-300 shrink-0" />
                                    <span className="text-amber-100 font-semibold text-sm tracking-wide">RECARGAR TARJETA CINEMA+</span>
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
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => { onClose(); onRegisterClick(); }}
                                    className="w-full min-h-11 px-4 rounded-xl border border-white/20 hover:bg-white/[0.08] text-white/80 hover:text-white font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
                                >
                                    ¿No tienes cuenta? Regístrate
                                </button>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export { Sidebar };
