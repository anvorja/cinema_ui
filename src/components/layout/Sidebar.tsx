// src/components/layout/Sidebar.tsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, CreditCard, LogOut, Utensils } from 'lucide-react';
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
    { name: 'Películas', href: '/',        icon: Home,     color: 'text-blue-400' },
    { name: 'Comidas',   href: '/comidas', icon: Utensils, color: 'text-orange-400' },
];

const Sidebar = ({ isOpen, onClose, onLoginClick, onRegisterClick }: SidebarProps) => {
    const { isAuthenticated, logout } = useAuth();
    const [showUserProfile, setShowUserProfile] = useState(false);
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

    const navItems: NavItem[] = isAuthenticated
        ? [
            ...baseNavItems,
            { name: 'Mi Perfil', icon: User, color: 'text-cyan-400', action: () => setShowUserProfile(true) },
        ]
        : baseNavItems;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <SheetContent
                    side="left"
                    className="w-80 p-0 bg-slate-950 border-r border-white/[0.08] text-white flex flex-col [&>button]:text-white/50 [&>button]:hover:text-white [&>button]:hover:opacity-100"
                >
                    {/* Accessible title (sr-only) */}
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

                    {/* ── Logo header ── */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
                        <img src="/icons8.png" alt="Cinemaplus" className="w-9 h-9 rounded-xl shrink-0" />
                        <span className="text-white font-bold text-base tracking-widest">CINEMAPLUS</span>
                    </div>

                    {/* ── Navigation ── */}
                    <ScrollArea className="flex-1">
                        <nav className="px-3 py-5 space-y-5">
                            {sections.map((section, idx) => (
                                <div key={section.title}>
                                    {idx > 0 && (
                                        <Separator className="bg-white/[0.06] mb-5" />
                                    )}
                                    <p className="px-3 mb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.18em]">
                                        {section.title}
                                    </p>
                                    <div className="space-y-0.5">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = item.href ? isItemActive(item.href) : false;

                                            const cls = [
                                                'group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium',
                                                'transition-all duration-200 border',
                                                active
                                                    ? 'bg-gradient-to-r from-blue-500/[0.18] to-purple-500/[0.14] border-blue-500/25 text-white'
                                                    : 'border-transparent text-white/60 hover:text-white/90 hover:bg-white/[0.06]',
                                            ].join(' ');

                                            return item.action ? (
                                                <button key={item.name} onClick={item.action} className={cls}>
                                                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.color}`} />
                                                    <span>{item.name}</span>
                                                </button>
                                            ) : (
                                                <Link key={item.name} to={item.href!} onClick={onClose} className={cls}>
                                                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.color}`} />
                                                    <span className="flex-1">{item.name}</span>
                                                    {active && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-pulse" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* ── Cinema+ promo card ── */}
                            <div>
                                <Separator className="bg-white/[0.06] mb-5" />
                                <button
                                    className="group w-full text-left"
                                    onClick={() => { onClose(); navigate('/recharge'); }}
                                >
                                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-amber-500/[0.12] to-orange-500/[0.12] border border-amber-500/20 hover:from-amber-500/[0.2] hover:to-orange-500/[0.2] hover:border-amber-400/35 transition-all duration-200">
                                        <CreditCard className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                                        <span className="text-amber-200/80 font-semibold text-xs tracking-wide">
                                            RECARGAR TARJETA CINEMA+
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </nav>
                    </ScrollArea>

                    {/* ── Footer: auth actions ── */}
                    <div className="px-3 pb-5 pt-4 border-t border-white/[0.08] shrink-0">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="group w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-500/[0.08] hover:bg-red-500/[0.15] border border-red-500/[0.18] hover:border-red-500/30 transition-all duration-200 text-red-400/80 hover:text-red-300"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium text-sm">Cerrar sesión</span>
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => { onClose(); onLoginClick(); }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => { onClose(); onRegisterClick(); }}
                                    className="w-full py-2 px-4 rounded-xl border border-white/[0.12] hover:bg-white/[0.06] hover:border-white/20 text-white/55 hover:text-white/80 font-medium text-sm transition-all duration-200"
                                >
                                    ¿No tienes cuenta? Regístrate
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
