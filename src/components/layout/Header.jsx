// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { GlassCard, PremiumButton, GlassInput } from '../ui';
import { UserProfileDropdown } from './UserProfileDropdown';
import { Sidebar } from './Sidebar';
import { LoginModal } from '../auth/LoginModal.jsx';
import { RegisterModal } from '../auth/RegisterModal.jsx';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserProfile) {
                const dropdown = event.target.closest('.user-profile-dropdown');
                const button = event.target.closest('.user-profile-button');

                if (!dropdown && !button) {
                    setShowUserProfile(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserProfile]);

    const navigationItems = [
        { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
        { name: 'Pronto', href: '/pronto', isActive: location.pathname === '/pronto' },
        { name: 'Comidas', href: '/comidas', isActive: location.pathname === '/comidas' }
    ];

    const handleUserClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('User button clicked, current state:', showUserProfile);
        setShowUserProfile(!showUserProfile);
    };

    const handleCloseDropdown = () => {
        console.log('Closing dropdown');
        setShowUserProfile(false);
    };

    const handleLoginClick = () => {
        console.log('Opening login modal');
        setShowLoginModal(true);
    };

    const handleSwitchToRegister = () => {
        console.log('Switching to register modal');
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSwitchToLogin = () => {
        console.log('Switching to login modal');
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const closeAllModals = () => {
        console.log('Closing all modals');
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'py-2' : 'py-4'
            }`}>
                <GlassCard
                    variant="premium"
                    className={`mx-4 transition-all duration-300 ${
                        isScrolled ? 'bg-black/30 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-md'
                    }`}
                >
                    <div className="flex items-center justify-between px-6 py-3">
                        {/* Logo and Hamburger */}
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu */}
                            <button
                                onClick={() => {
                                    console.log('Sidebar button clicked!');
                                    setIsSidebarOpen(true);
                                }}
                                className="p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105"
                            >
                                <Bars3Icon className="w-6 h-6 text-white" />
                            </button>

                            {/* Logo */}
                            <Link
                                to="/"
                                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">CC</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-white">CINE COLOMBIA</h1>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                        item.isActive
                                            ? 'bg-white/20 text-white shadow-lg scale-105'
                                            : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search and User Section */}
                        <div className="flex items-center gap-4">
                            {/* Search - CORREGIDO sin rightIcon */}
                            <div className="hidden md:flex items-center relative">
                                <GlassInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Buscar..."
                                    className="w-48 lg:w-64 pl-10"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                            </div>

                            {/* Search Button Mobile */}
                            <button className="md:hidden p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105">
                                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                            </button>

                            {/* User Profile or Login Button */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={handleUserClick}
                                        className="user-profile-button flex items-center gap-2 p-2 rounded-xl glass-hover transition-all duration-200 hover:scale-105"
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full border-2 border-white/20"
                                            />
                                        ) : (
                                            <UserCircleIcon className="w-8 h-8 text-white" />
                                        )}
                                        <span className="hidden sm:block text-white font-medium">{user?.name}</span>
                                    </button>

                                    {/* Dropdown con clase específica para el click outside */}
                                    {showUserProfile && (
                                        <div className="user-profile-dropdown">
                                            <UserProfileDropdown
                                                onClose={handleCloseDropdown}
                                                user={user}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <PremiumButton
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex"
                                    onClick={handleLoginClick}
                                >
                                    Iniciar Sesión
                                </PremiumButton>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </header>

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navigationItems={navigationItems}
            />

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Modales de autenticación */}
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
        </>
    );
};

export { Header };
