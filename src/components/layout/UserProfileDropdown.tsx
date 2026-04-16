// src/components/layout/UserProfileDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
    UserIcon,
    CreditCardIcon,
    TicketIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '../common';
import useAuth from "../../hooks/useAuth.js";

// Icono moderno de logout personalizado
const LogoutIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
        />
    </svg>
);

const UserProfileDropdown = ({ onClose, onOpenProfile, user }) => {
    const { logout, loading } = useAuth();
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const buttonRef = useRef(null);

    // Calcular posición del dropdown
    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, []);

    const menuItems = [
        {
            name: 'Mi Perfil',
            action: () => { onOpenProfile?.(); onClose(); },
            icon: UserIcon,
            type: 'action'
        },
        { name: 'Mis Compras', href: '/profile/purchases', icon: TicketIcon, type: 'link' },
        { name: 'Mis Transacciones', href: '/profile/transactions', icon: CreditCardIcon, type: 'link' },
        { name: 'Mis Tarjetas Cineco', href: '/profile/cards', icon: CreditCardIcon, type: 'link' },
        { name: 'Configuración', href: '/profile/settings', icon: Cog6ToothIcon, type: 'link' }
    ];

    // 🔥 FUNCIÓN DE LOGOUT SIMPLIFICADA Y CORREGIDA
    const handleLogout = async () => {
        try {
            console.log('🔴 LOGOUT DEBUG: Inicio del proceso');

            if (loading || isLoggingOut) {
                console.log('🔴 LOGOUT DEBUG: Ya está en proceso, cancelando');
                return;
            }

            setIsLoggingOut(true);
            console.log('🔴 LOGOUT DEBUG: Estado isLoggingOut establecido');

            console.log('🚪 UserProfileDropdown: Iniciando logout...');

            // Cerrar dropdown primero
            console.log('🔴 LOGOUT DEBUG: Cerrando dropdown');
            onClose();

            // Pequeña pausa para que se cierre el dropdown
            await new Promise(resolve => setTimeout(resolve, 200));

            // Ejecutar logout
            console.log('🔴 LOGOUT DEBUG: Llamando función logout');
            await logout();

            console.log('✅ UserProfileDropdown: Logout completado');

        } catch (error) {
            console.error('❌ UserProfileDropdown: Error en logout:', error);

            // Incluso si hay error, cerrar el dropdown
            onClose();

            // Limpieza de emergencia
            localStorage.removeItem('cinema_token');
            localStorage.removeItem('cinema_user');

            // Redirigir después de un breve delay
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === 'action') {
            item.action(); // action already calls onClose() internally
        }
    };

    const DropdownContent = () => (
        <div
            data-portal="user-dropdown"
            className="fixed w-64"
            style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                zIndex: 99999
            }}
        >
            <GlassCard variant="premium" className="p-0 overflow-hidden shadow-2xl">
                {/* Header con información del usuario */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-white/20"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div>
                            <p className="text-white font-medium">{user?.name || 'Usuario'}</p>
                            <p className="text-white/60 text-sm">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;

                        return item.type === 'link' ? (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {IconComponent && <IconComponent className="w-5 h-5" />}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ) : (
                            <button
                                key={item.name}
                                onClick={() => handleItemClick(item)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {IconComponent && <IconComponent className="w-5 h-5" />}
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-2 border-t border-white/10">
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🔴 LOGOUT DEBUG: onMouseDown ejecutado');
                            handleLogout();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLogout();
                            }
                        }}
                        className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-lg 
      transition-all duration-200
      ${loading || isLoggingOut
                            ? 'text-red-300 bg-red-400/5 cursor-not-allowed opacity-70'
                            : 'text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer'
                        }
    `}
                    >
                        {loading || isLoggingOut ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <span className="font-medium">Cerrando sesión...</span>
                            </>
                        ) : (
                            <>
                                <LogoutIcon className="w-5 h-5" />
                                <span className="font-medium">Cerrar sesión</span>
                            </>
                        )}
                    </div>
                </div>

            </GlassCard>
        </div>
    );

    return createPortal(<DropdownContent />, document.body);
};

export { UserProfileDropdown };