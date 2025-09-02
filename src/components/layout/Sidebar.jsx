// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home, Film, Clock, User, CreditCard, LogOut, Utensils, Truck } from 'lucide-react';
import { PremiumButton } from '../ui';
import UserProfile from "../auth/UserProfile.jsx";
import useAuth from "../../hooks/useAuth.js";

const Sidebar = ({ isOpen, onClose, onLoginClick, onRegisterClick }) => {
    const { isAuthenticated, logout } = useAuth();
    const [showUserProfile, setShowUserProfile] = useState(false);
    const location = useLocation();

    const menuSections = [
        {
            title: 'CINE',
            items: [
                {
                    name: 'Inicio',
                    href: '/',
                    icon: Home,
                    color: 'text-blue-400'
                },
                {
                    name: 'Cartelera',
                    href: '/cartelera',
                    icon: Film,
                    color: 'text-purple-400'
                },
                {
                    name: 'Pronto',
                    href: '/pronto',
                    icon: Clock,
                    color: 'text-green-400'
                }
            ]
        },
        {
            title: 'COMIDAS',
            items: [
                {
                    name: 'Menú',
                    href: '/comidas',
                    icon: Utensils,
                    color: 'text-orange-400'
                },
                {
                    name: 'Domicilios',
                    href: '/domicilios',
                    icon: Truck,
                    color: 'text-gray-400'
                }
            ]
        }
    ];

    // Función para verificar si un item está activo
    const isItemActive = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname === href;
    };

    // Función para renderizar íconos dinámicamente
    const renderIcon = (IconComponent, colorClass) => {
        if (!IconComponent) return null;
        return <IconComponent className={`w-5 h-5 ${colorClass} group-hover:scale-110 transition-transform`} />;
    };

    if (isAuthenticated) {
        menuSections.push({
            title: 'MI CUENTA',
            items: [
                {
                    name: 'Mi Perfil',
                    action: () => setShowUserProfile(true),
                    icon: User,
                    type: 'action',
                    color: 'text-cyan-400'
                }
            ]
        });
    }

    const handleLogout = async () => {
        try {
            console.log('🚪 Sidebar: Iniciando logout...');
            onClose();
            await logout();
            console.log('✅ Sidebar: Logout completado');
        } catch (error) {
            console.error('❌ Sidebar: Error en logout:', error);
            onClose();
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === 'action') {
            item.action();
        } else {
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-slate-950/95 backdrop-blur-xl z-50 transform transition-all duration-300 ease-in-out border-r border-white/10 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">

                    {/* Header mejorado */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">C+</span>
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg">CINEMAPLUS</span>
                            </div>
                        </div>

                        {/* Botón colapsar moderno */}
                        <button
                            onClick={onClose}
                            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                        >
                            <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Navigation mejorada */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {menuSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-3">
                                    {section.title}
                                </h3>
                                <div className="space-y-2">
                                    {section.items.map((item) => (
                                        item.type === 'action' ? (
                                            <button
                                                key={item.name}
                                                onClick={() => handleItemClick(item)}
                                                className="group w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:bg-white/10 border border-transparent hover:border-white/10"
                                            >
                                                {renderIcon(item.icon, item.color)}
                                                <span className="text-white/80 group-hover:text-white font-medium">
                                                    {item.name}
                                                </span>
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={() => handleItemClick(item)}
                                                className={`group w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 border ${
                                                    isItemActive(item.href) 
                                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                                                        : 'border-transparent hover:bg-white/10 hover:border-white/10'
                                                }`}
                                            >
                                                {renderIcon(item.icon, item.color)}
                                                <span className={`font-medium transition-colors ${
                                                    isItemActive(item.href) 
                                                        ? 'text-white' 
                                                        : 'text-white/80 group-hover:text-white'
                                                }`}>
                                                    {item.name}
                                                </span>

                                                {/* Indicador de elemento activo */}
                                                {isItemActive(item.href) && (
                                                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                                )}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Sección OTROS más moderna */}
                        <div>
                            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-3">
                                OTROS
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full group">
                                    <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-400/50 transition-all duration-200 shadow-lg shadow-yellow-500/10">
                                        <CreditCard className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-yellow-100 font-semibold text-sm">
                                            RECARGAR TARJETA CINEMA+
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-gradient-to-t from-slate-950 to-transparent">
{isAuthenticated ? (
    <button
        onClick={handleLogout}
        className="group w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 text-red-100 hover:text-white"
    >
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Cerrar Sesión</span>
    </button>
) : (
    <div className="space-y-3">
        <PremiumButton
            variant="default"
            className="w-full h-12 font-semibold"
            shimmer
            onClick={onLoginClick}  // ← AGREGAR ESTE onClick
        >
            Iniciar Sesión
        </PremiumButton>
        <PremiumButton
            variant="ghost"
            className="w-full h-11 text-sm"
            onClick={onRegisterClick}  // ← AGREGAR ESTE onClick
        >
            ¿No estás registrado? Regístrate aquí
        </PremiumButton>
    </div>
)}
                    </div>
                </div>
            </div>

            {/* Modal de perfil */}
            {showUserProfile && (
                <UserProfile
                    onClose={() => setShowUserProfile(false)}
                />
            )}
        </>
    );
};

export { Sidebar };