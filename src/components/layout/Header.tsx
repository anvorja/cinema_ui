// src/components/layout/Header.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Menu, Search, X, User, CreditCard } from 'lucide-react';
import { GlassCard } from '../common';
import { UserProfileDropdown } from './UserProfileDropdown';
import { MobileProfileMenu } from './MobileProfileMenu';
import { Sidebar } from './Sidebar';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import UserProfile from '../auth/UserProfile.jsx';
import useAuth from '../../hooks/useAuth';
import { searchMovies } from '../../services/api';
import { debounce } from 'lodash';
import { Button } from '../ui/button';
import { optimizeCloudinaryUrl } from '../../utils/movieUtils';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const lastScrollYRef = useRef(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [searchAnchor, setSearchAnchor] = useState<{ top: number; right: number } | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Scroll effect: isScrolled styling + hide-on-scroll-down for mobile
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setIsScrolled(currentY > 20);
            if (currentY > 80) {
                setIsHeaderVisible(currentY < lastScrollYRef.current);
            } else {
                setIsHeaderVisible(true);
            }
            lastScrollYRef.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
        setShowMobileSearch(false);
    }, [location]);

    // Atajo "/" para enfocar la búsqueda (solo fuera de campos de texto)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (e.key !== '/' || t.closest('input, textarea, [contenteditable="true"]')) return;
            e.preventDefault();
            searchInputRef.current?.focus();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    // Ancla el desplegable de resultados al campo de búsqueda visible
    useEffect(() => {
        if (!showSearchResults) return;
        const place = () => {
            const el = document.querySelector<HTMLElement>(showMobileSearch ? '.search-container-mobile' : '.search-container');
            if (!el) return;
            const r = el.getBoundingClientRect();
            setSearchAnchor({ top: r.bottom + 8, right: Math.max(window.innerWidth - r.right, 8) });
        };
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
    }, [showSearchResults, showMobileSearch, isScrolled]);

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSearchResults) {
                const el = event.target as Element;
                if (!el.closest('.search-container') && !el.closest('.search-container-mobile') && !el.closest('.search-results-portal')) {
                    setShowSearchResults(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSearchResults]);

    // Session expired listener
    useEffect(() => {
        const handleSessionExpired = () => setShowLoginModal(true);
        window.addEventListener('auth:session-expired', handleSessionExpired);
        return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
    }, []);

    const navigationItems = [
        { name: 'Películas', href: '/' },
        { name: 'Comidas', href: '/comidas' },
    ];

    // Debounced search
    const debouncedSearchRef = useRef(
        debounce(async (query: string, setResults: any, setShow: any, setSearching: any) => {
            if (!query.trim()) { setResults([]); setShow(false); return; }
            setSearching(true);
            try {
                const response = await searchMovies(query, { limit: 5 });
                const results = Array.isArray(response) ? response : response.data || [];
                setResults(results);
                setShow(true);
            } catch {
                setResults([]);
                setShow(false);
            } finally {
                setSearching(false);
            }
        }, 300)
    );

    const debouncedSearch = useCallback((query: string) => {
        debouncedSearchRef.current(query, setSearchResults, setShowSearchResults, setIsSearching);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
    };

    const handleSearchResultClick = (movie: any) => {
        navigate(`/movie/${movie.id}`);
        clearSearch();
    };

    const handleViewAllResults = () => {
        navigate(`/cartelera?search=${encodeURIComponent(searchQuery)}`);
        clearSearch();
    };

    const handleLoginClick = () => setShowLoginModal(true);
    const handleSwitchToRegister = () => { setShowLoginModal(false); setShowRegisterModal(true); };
    const handleSwitchToLogin    = () => { setShowRegisterModal(false); setShowLoginModal(true); };
    const closeAllModals         = () => { setShowLoginModal(false); setShowRegisterModal(false); };

    return (
        <TooltipProvider delayDuration={300}>
            <>
                <header className={`fixed top-0 left-0 right-0 z-50 transition-[padding,transform] duration-300 ease-out ${isScrolled ? 'py-2' : 'py-3 sm:py-4'} ${!isHeaderVisible && !showMobileSearch ? '-translate-y-full' : 'translate-y-0'}`}>
                    <GlassCard
                        variant="premium"
                        className={`mx-3 sm:mx-4 lg:mx-auto lg:max-w-7xl rounded-2xl transition-all duration-300 ${
                            isScrolled ? 'bg-slate-950/55 backdrop-blur-2xl border-white/15' : 'bg-white/10 backdrop-blur-md'
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2">

                            {/* ── Left: hamburger (mobile only) + logo ── */}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 h-10 w-10 rounded-xl"
                                    aria-label="Abrir menú"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>

                                <Link to="/" className="flex items-center gap-2.5 group transition-all duration-200">
                                    <span className="text-white font-bold text-base sm:text-lg tracking-widest">
                                        CINEMAPLUS
                                    </span>
                                </Link>
                            </div>

                            {/* ── Center: desktop navigation ── */}
                            <nav className="hidden lg:flex items-center gap-1">
                                {navigationItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        end={item.href === '/'}
                                        className={({ isActive }) =>
                                            `relative px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 after:absolute after:left-1/2 after:bottom-0.5 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:bg-white after:transition-all after:duration-300 ${
                                                isActive
                                                    ? 'text-white after:w-5'
                                                    : 'text-white/70 hover:text-white hover:bg-white/[0.08] after:w-0'
                                            }`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* ── Right: recharge + search + user ── */}
                            <div className="flex items-center gap-3">
                                {/* Desktop: Recargar Cinema+ — icon only on lg, icon+text on xl+ */}
                                <Link
                                    to="/recharge"
                                    className="hidden lg:flex items-center justify-center w-9 h-9 xl:w-auto xl:px-3 xl:gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300/90 hover:bg-amber-500/25 hover:text-amber-200 hover:border-amber-400/40 transition-all duration-200 text-sm font-semibold"
                                    title="Recargar Tarjeta Cinema+"
                                >
                                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                                    <span className="hidden xl:inline">Recargar</span>
                                </Link>

                                {/* Desktop search */}
                                <div className="hidden md:flex items-center relative search-container">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        aria-label="Buscar películas"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Buscar películas..."
                                        style={{
                                            background: isSearchFocused ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.28)',
                                            borderColor: isSearchFocused ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
                                        }}
                                        className={`${isSearchFocused || searchQuery ? 'w-56 xl:w-72' : 'w-40 xl:w-56'} pl-9 pr-9 h-10 rounded-xl border text-sm text-white transition-[width,background-color,border-color] duration-300 ease-out outline-none placeholder:text-white/55 focus-visible:ring-2 focus-visible:ring-white/40`}
                                    />
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                                    {!searchQuery && !isSearchFocused && (
                                        <kbd className="hidden xl:block absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/20 px-1.5 text-[11px] font-medium text-white/55">/</kbd>
                                    )}
                                    {searchQuery && !isSearching && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            aria-label="Limpiar búsqueda"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/20 border-t-white/60" />
                                        </div>
                                    )}
                                </div>

                                {/* Móvil: abre la fila de búsqueda */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setShowMobileSearch((v) => !v);
                                        setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
                                    }}
                                    className="md:hidden text-white/80 hover:text-white hover:bg-white/10 h-10 w-10 rounded-xl"
                                    aria-label={showMobileSearch ? 'Cerrar búsqueda' : 'Buscar películas'}
                                    aria-expanded={showMobileSearch}
                                >
                                    {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                                </Button>

                                {/* User area */}
                                {isAuthenticated ? (
                                    <>
                                        {/* Desktop: dropdown completo */}
                                        <span className="hidden sm:block">
                                            <UserProfileDropdown
                                                user={user}
                                                onOpenProfile={() => setShowProfileModal(true)}
                                            />
                                        </span>
                                        {/* Mobile: abre menú de perfil (bottom sheet) */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowMobileProfileMenu(true)}
                                            className="sm:hidden text-white/80 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                                            aria-label="Mi perfil"
                                        >
                                            <User className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {/* Desktop: botón de texto */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleLoginClick}
                                            className="hidden sm:flex text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/35 rounded-xl h-9 px-4 text-sm font-medium transition-all"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                        {/* Mobile: ícono de persona */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleLoginClick}
                                            className="sm:hidden text-white/70 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                                            aria-label="Iniciar sesión"
                                        >
                                            <User className="h-4 w-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Fila de búsqueda móvil */}
                        <div className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${showMobileSearch ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                                <div className="search-container-mobile relative px-3 pb-3">
                                    <Search className="absolute left-6 top-[calc(50%-6px)] -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                                    <input
                                        ref={mobileSearchInputRef}
                                        type="search"
                                        aria-label="Buscar películas"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        tabIndex={showMobileSearch ? 0 : -1}
                                        placeholder="Buscar películas..."
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/20 bg-black/25 text-base text-white outline-none placeholder:text-white/55 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </header>

                {/* Search results portal */}
                {showSearchResults && createPortal(
                    <div
                        className="fixed w-[calc(100vw-1.5rem)] sm:w-80 search-results-portal"
                        style={{ top: searchAnchor?.top ?? 76, right: searchAnchor?.right ?? 12, zIndex: 99999 }}
                    >
                        <GlassCard variant="premium" className="p-0 overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-white/[0.07]">
                                    {searchResults.map((movie: any) => (
                                        <button
                                            key={movie.id}
                                            onClick={() => handleSearchResultClick(movie)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.08] transition-colors text-left"
                                        >
                                            {movie.poster_url ? (
                                                <img
                                                    src={optimizeCloudinaryUrl(movie.poster_url, 100)}
                                                    alt={movie.title}
                                                    className="w-11 h-16 object-cover rounded-md border border-white/15 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-11 h-16 bg-white/10 rounded-md flex items-center justify-center shrink-0">
                                                    <span className="text-white/30 text-xs">img</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white/90 font-medium text-sm truncate">{movie.title}</h3>
                                                <p className="text-white/50 text-xs truncate mt-0.5">{movie.genre} · {movie.duration}min</p>
                                                <p className="text-white/35 text-xs mt-0.5">
                                                    {movie.status === 'current' ? 'En cartelera' : 'Próximamente'}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleViewAllResults}
                                        className="w-full p-3 text-center text-white/60 hover:text-white/90 hover:bg-white/[0.05] transition-colors text-sm font-medium"
                                    >
                                        Ver todos los resultados →
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 text-center text-white/40">
                                    <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Sin resultados para "{searchQuery}"</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>,
                    document.body
                )}

                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    navigationItems={navigationItems}
                    onLoginClick={handleLoginClick}
                    onRegisterClick={handleSwitchToRegister}
                />

                {/* Auth modals */}
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={closeAllModals}
                    onSwitchToRegister={handleSwitchToRegister}
                />
                <RegisterModal
                    isOpen={showRegisterModal}
                    onClose={closeAllModals}
                    onSwitchToLogin={handleSwitchToLogin}
                />

                {/* Profile modal */}
                {showProfileModal && (
                    <UserProfile onClose={() => setShowProfileModal(false)} />
                )}

                {/* Mobile profile bottom sheet */}
                <MobileProfileMenu
                    isOpen={showMobileProfileMenu}
                    onClose={() => setShowMobileProfileMenu(false)}
                    user={user}
                    onOpenProfile={() => {
                        setShowMobileProfileMenu(false);
                        setShowProfileModal(true);
                    }}
                />
            </>
        </TooltipProvider>
    );
};

export { Header };
