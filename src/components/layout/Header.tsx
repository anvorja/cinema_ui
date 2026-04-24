// src/components/layout/Header.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { GlassCard, GlassInput } from '../common';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Sidebar } from './Sidebar';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import UserProfile from '../auth/UserProfile.jsx';
import useAuth from '../../hooks/useAuth';
import { searchMovies } from '../../services/api';
import { debounce } from 'lodash';
import { Button } from '../ui/button';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
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
        { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
        { name: 'Pronto',    href: '/pronto',    isActive: location.pathname === '/pronto' },
        { name: 'Comidas',   href: '/comidas',   isActive: location.pathname === '/comidas' },
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
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
                    <GlassCard
                        variant="premium"
                        className={`mx-4 transition-all duration-300 ${
                            isScrolled ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-md'
                        }`}
                    >
                        <div className="flex items-center justify-between px-4 py-2.5">

                            {/* ── Left: hamburger + logo ── */}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="text-white/80 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                                    aria-label="Abrir menú"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>

                                <Link to="/" className="flex items-center gap-2.5 group transition-all duration-200">
                                    <span className="text-white font-bold text-lg tracking-widest">
                                        CINEMAPLUS
                                    </span>
                                </Link>
                            </div>

                            {/* ── Center: desktop navigation ── */}
                            <nav className="hidden lg:flex items-center gap-1">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            item.isActive
                                                ? 'bg-white/20 text-white shadow-sm'
                                                : 'text-white/70 hover:text-white hover:bg-white/[0.1]'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* ── Right: search + user ── */}
                            <div className="flex items-center gap-2">
                                {/* Desktop search */}
                                <div className="hidden md:flex items-center relative search-container">
                                    <GlassInput
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Buscar películas..."
                                        className="w-44 lg:w-60 pl-9 pr-8 h-9 text-sm"
                                    />
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                                    {searchQuery && !isSearching && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
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

                                {/* Mobile search icon */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden text-white/70 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                                            aria-label="Buscar"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">Buscar</TooltipContent>
                                </Tooltip>

                                {/* User area */}
                                {isAuthenticated ? (
                                    <UserProfileDropdown
                                        user={user}
                                        onOpenProfile={() => setShowProfileModal(true)}
                                    />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLoginClick}
                                        className="hidden sm:flex text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/35 rounded-xl h-9 px-4 text-sm font-medium transition-all"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </header>

                {/* Search results portal */}
                {showSearchResults && createPortal(
                    <div
                        className="fixed w-80 search-results-portal"
                        style={{ top: '76px', right: '120px', zIndex: 99999 }}
                    >
                        <GlassCard variant="premium" className="p-0 overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-white/[0.07]">
                                    {searchResults.map((movie: any) => (
                                        <button
                                            key={movie.id}
                                            onClick={() => handleSearchResultClick(movie)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.05] transition-colors text-left"
                                        >
                                            {movie.poster_url ? (
                                                <img
                                                    src={movie.poster_url}
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
            </>
        </TooltipProvider>
    );
};

export { Header };
