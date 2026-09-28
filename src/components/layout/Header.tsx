// src/components/layout/Header.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Menu, Search, X, User, CreditCard } from 'lucide-react';
import BoardClock from '../board/BoardClock';
import BoardTip from '../board/BoardTip';
import BoardThemeToggle from '../board/BoardThemeToggle';
import { UserProfileDropdown } from './UserProfileDropdown';
import { MobileProfileMenu } from './MobileProfileMenu';
import { Sidebar } from './Sidebar';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import UserProfile from '../auth/UserProfile.jsx';
import useAuth from '../../hooks/useAuth';
import { searchMovies } from '../../services/api';
import { debounce } from 'lodash';
import { optimizeCloudinaryUrl } from '../../utils/movieUtils';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

const Header = () => {
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

    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Scroll effect: isScrolled styling + hide-on-scroll-down for mobile
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
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
    }, [location]);

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSearchResults) {
                const el = event.target as Element;
                if (!el.closest('.search-container') && !el.closest('.search-results-portal')) {
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
                <header className={`fixed top-0 left-0 right-0 z-50 border-b border-board-line bg-board-ground transition-transform duration-200 ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}`}>
                    <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-3 sm:px-6">

                        {/* ── Izquierda: menú (móvil) + marca ── */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden flex h-11 w-11 items-center justify-center rounded-[3px] text-board-ink2 hover:bg-board-panel2 hover:text-board-ink"
                                aria-label="Abrir menú"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <Link to="/" className="flex items-baseline gap-2" aria-label="CinemaPlus, inicio">
                                <span className="font-board text-[26px] font-bold leading-none tracking-[0.08em] text-board-ink">
                                    CINEMA<span className="text-board-amberink">PLUS</span>
                                </span>
                            </Link>
                        </div>

                        {/* ── Centro: navegación de escritorio ── */}
                        <nav className="hidden lg:flex items-stretch self-stretch" aria-label="Principal">
                            {navigationItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    end={item.href === '/'}
                                    className={({ isActive }) =>
                                        `flex items-center px-5 font-board text-[17px] font-semibold tracking-[0.08em] border-b-2 ${
                                            isActive
                                                ? 'border-board-amber text-board-ink'
                                                : 'border-transparent text-board-mute hover:text-board-ink'
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* ── Derecha: hora, recarga, búsqueda, usuario ── */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <BoardClock className="hidden sm:block text-[15px]" />
                            <BoardThemeToggle />

<BoardTip label="Recargar tarjeta Cinema+" side="bottom"><Link
                                to="/recharge"
                                className="hidden lg:flex h-10 items-center gap-2 rounded-[3px] border border-board-line2 px-3 font-board text-[15px] font-semibold tracking-[0.06em] text-board-ink hover:border-board-amber hover:text-board-amberink"
                                aria-label="Recargar tarjeta Cinema+"
                            >
                                <CreditCard className="h-4 w-4 shrink-0" />
                                <span className="hidden xl:inline">RECARGAR</span>
                            </Link></BoardTip>

                            {/* Búsqueda escritorio */}
                            <div className="hidden md:flex items-center relative search-container">
                                <label htmlFor="header-search" className="sr-only">Buscar películas</label>
                                <input
                                    id="header-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Buscar película"
                                    className={`h-10 w-40 xl:w-56 rounded-[3px] border bg-board-panel pl-9 pr-8 text-[15px] text-board-ink outline-none placeholder:text-board-mute ${isSearchFocused ? 'border-board-amber' : 'border-board-line'}`}
                                />
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-board-mute" />
                                {searchQuery && !isSearching && (
                                    <button type="button" onClick={clearSearch} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-board-mute hover:text-board-ink">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2"><span className="block h-3 w-2 bg-board-amber motion-safe:animate-pulse" /></div>}
                            </div>

                            {/* Usuario */}
                            {isAuthenticated ? (
                                <>
                                    <span className="hidden sm:block">
                                        <UserProfileDropdown user={user} onOpenProfile={() => setShowProfileModal(true)} />
                                    </span>
                                    <button
                                        onClick={() => setShowMobileProfileMenu(true)}
                                        className="sm:hidden flex h-11 w-11 items-center justify-center rounded-[3px] text-board-ink2 hover:bg-board-panel2 hover:text-board-ink"
                                        aria-label="Mi perfil"
                                    >
                                        <User className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLoginClick}
                                        className="hidden sm:flex h-10 items-center rounded-[3px] border border-board-amber px-4 font-board text-[15px] font-bold tracking-[0.08em] text-board-amberink hover:bg-board-amber hover:text-board-onamber"
                                    >
                                        INGRESAR
                                    </button>
                                    <button
                                        onClick={handleLoginClick}
                                        className="sm:hidden flex h-11 w-11 items-center justify-center rounded-[3px] text-board-ink2 hover:bg-board-panel2 hover:text-board-ink"
                                        aria-label="Iniciar sesión"
                                    >
                                        <User className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Search results portal */}
                {showSearchResults && createPortal(
                    <div
                        className="fixed w-80 search-results-portal"
                        style={{ top: '60px', right: '120px', zIndex: 99999 }}
                    >
                        <div className="max-h-96 overflow-y-auto border border-board-line2 bg-board-panel">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-board-line">
                                    {searchResults.map((movie: any) => (
                                        <button
                                            key={movie.id}
                                            onClick={() => handleSearchResultClick(movie)}
                                            className="flex w-full items-center gap-3 p-3 text-left hover:bg-board-panel2"
                                        >
                                            {movie.poster_url ? (
                                                <img
                                                    src={optimizeCloudinaryUrl(movie.poster_url, 100)}
                                                    alt=""
                                                    className="h-16 w-11 shrink-0 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-11 shrink-0 items-center justify-center bg-board-panel2 font-data text-xs text-board-mute">—</div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-board text-lg font-semibold leading-tight text-board-ink">{movie.title}</h3>
                                                <p className="mt-0.5 truncate text-sm text-board-mute">{movie.genre} · {movie.duration} min</p>
                                                <p className="mt-0.5 font-data text-[11px] uppercase text-board-amberink">
                                                    {movie.status === 'current' ? 'En cartelera' : 'Próximamente'}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleViewAllResults}
                                        className="w-full p-3 text-center font-board text-base font-semibold tracking-[0.06em] text-board-amberink hover:bg-board-panel2"
                                    >
                                        VER TODOS LOS RESULTADOS →
                                    </button>
                                </div>
                            ) : (
                                <div className="p-5 text-center text-board-mute">
                                    <Search className="mx-auto mb-2 h-6 w-6" />
                                    <p className="text-sm">Sin resultados para "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
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
