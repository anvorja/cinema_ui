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
    { name: 'Películas', href: '/',        icon: Home,     color: 'text-board-amberink' },
    { name: 'Comidas',   href: '/comidas', icon: Utensils, color: 'text-board-amberink' },
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
            { name: 'Mi Perfil', icon: User, color: 'text-board-amberink', action: () => setShowUserProfile(true) },
        ]
        : baseNavItems;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <SheetContent
                    side="left"
                    className="w-80 p-0 bg-board-ground border-r border-board-line text-board-ink flex flex-col [&>button]:text-white/50 [&>button]:hover:text-white [&>button]:hover:opacity-100"
                >
                    {/* Accessible title (sr-only) */}
                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

                    {/* ── Logo header ── */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-board-line shrink-0">
                        <span className="font-board text-2xl font-bold tracking-[0.08em]">CINEMA<span className="text-board-amberink">PLUS</span></span>
                    </div>

                    {/* ── Navigation ── */}
                    <ScrollArea className="flex-1">
                        <nav className="px-3 py-5">
                            <div className="space-y-0.5">
                                {navItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    const active = item.href ? isItemActive(item.href) : false;
                                    const cls = [
                                        'group flex items-center gap-3 w-full min-h-[48px] px-3 rounded-[3px] font-board text-xl font-semibold tracking-[0.06em] uppercase',
                                        'border',
                                        active
                                            ? 'bg-board-panel2 border-board-amber text-board-ink'
                                            : 'border-transparent text-board-ink2 hover:text-board-ink hover:bg-board-panel',
                                    ].join(' ');

                                    return (
                                        <div key={item.name}>
                                            {isAuthenticated && idx === navItems.length - 1 && (
                                                <Separator className="bg-board-line my-3" />
                                            )}
                                            {item.action ? (
                                                <button onClick={item.action} className={cls}>
                                                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${item.color}`} />
                                                    <span>{item.name}</span>
                                                </button>
                                            ) : (
                                                <Link to={item.href!} onClick={onClose} className={cls}>
                                                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${item.color}`} />
                                                    <span className="flex-1">{item.name}</span>
                                                    {active && <span className="h-2 w-2 bg-board-amber" aria-hidden="true" />}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── Cinema+ promo card ── */}
                            <div>
                                <Separator className="bg-board-line mb-5" />
                                <button
                                    className="group w-full text-left"
                                    onClick={() => { onClose(); navigate('/recharge'); }}
                                >
                                    <div className="flex items-center gap-3 px-3 min-h-[48px] rounded-[3px] border border-board-line2 hover:border-board-amber">
                                        <CreditCard className="w-4 h-4 text-amber-400 transition-transform shrink-0" />
                                        <span className="font-board text-lg font-semibold tracking-[0.06em] text-board-ink">
                                            RECARGAR TARJETA CINEMA+
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </nav>
                    </ScrollArea>

                    {/* ── Footer: auth actions ── */}
                    <div className="px-3 pb-5 pt-4 border-t border-board-line shrink-0">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="group w-full flex items-center justify-center gap-2.5 px-4 min-h-[48px] rounded-[3px] border border-board-line2 hover:border-board-alarm text-board-ink2 hover:text-board-alarmink"
                            >
                                <LogOut className="w-4 h-4 transition-transform" />
                                <span className="font-medium text-sm">Cerrar sesión</span>
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => { onClose(); onLoginClick(); }}
                                    className="w-full h-12 px-4 rounded-[3px] bg-board-amber hover:bg-board-amberpress text-board-onamber font-board text-lg font-bold tracking-[0.08em]"
                                >
                                    INICIAR SESIÓN
                                </button>
                                <button
                                    onClick={() => { onClose(); onRegisterClick(); }}
                                    className="w-full min-h-[44px] px-4 rounded-[3px] border border-board-line2 hover:border-board-ink text-board-ink2 hover:text-board-ink text-[15px]"
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
