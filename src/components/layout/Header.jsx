// src/components/layout/Header.jsx - VERSIÓN ACTUALIZADA
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
import { useAuth } from '../../hooks/useAuth';
import {LoginModal} from "../auth/LoginModal.jsx";
import {RegisterModal} from "../auth/RegisterModal.jsx";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserProfile, setShowUserProfile] = useState(false);
    // 👇 Estados para los modales de autenticación
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

    const navigationItems = [
        { name: 'Cartelera', href: '/cartelera', isActive: location.pathname === '/cartelera' },
        { name: 'Pronto', href: '/pronto', isActive: location.pathname === '/pronto' },
        { name: 'Comidas', href: '/comidas', isActive: location.pathname === '/comidas' }
    ];

    // 👇 Funciones para manejar modales
    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const closeAllModals = () => {
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
                            {/* Hamburger Menu - 👇 CORREGIDO: Removido lg:hidden */}
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
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search and User Actions */}
                        <div className="flex items-center gap-3">
                            {/* Search Bar - Hidden on mobile */}
                            <div className="hidden md:block relative">
                                <GlassInput
                                    type="text"
                                    placeholder="Buscar películas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-4"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                            </div>

                            {/* Search Icon for Mobile */}
                            <button className="md:hidden p-2 rounded-lg glass-hover transition-all duration-200 hover:scale-105">
                                <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                            </button>

                            {/* User Profile */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserProfile(!showUserProfile)}
                                        className="flex items-center gap-2 p-2 rounded-xl glass-hover transition-all duration-200 hover:scale-105"
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

                                    {showUserProfile && (
                                        <UserProfileDropdown
                                            onClose={() => setShowUserProfile(false)}
                                            user={user}
                                        />
                                    )}
                                </div>
                            ) : (
                                <PremiumButton
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex"
                                    onClick={handleLoginClick} // 👈 CORREGIDO: Ahora abre el modal
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

            {/* 👇 MODALES DE AUTENTICACIÓN */}
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