// SOLUCIÓN ALTERNATIVA: Renderizar el dropdown en un portal
// Si cambiar z-index no funciona, usa esta versión:

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  UserIcon,
  CreditCardIcon,
  TicketIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import UserProfile from "../auth/UserProfile.jsx";

const UserProfileDropdown = ({ onClose, user }) => {
  const { logout } = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
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
      action: () => setShowUserProfile(true),
      icon: UserIcon,
      type: 'action'
    },
    { name: 'Mis Compras', href: '/profile/purchases', icon: TicketIcon, type: 'link' },
    { name: 'Mis Transacciones', href: '/profile/transactions', icon: CreditCardIcon, type: 'link' },
    { name: 'Mis Tarjetas Cineco', href: '/profile/cards', icon: CreditCardIcon, type: 'link' },
    { name: 'Configuración', href: '/profile/settings', icon: Cog6ToothIcon, type: 'link' }
  ];

const handleLogout = () => {
  console.log('🚪 UserProfileDropdown: Logout clicked');
  logout();
  onClose();
};

  const handleItemClick = (item) => {
    if (item.type === 'action') {
      item.action();
    }
    onClose();
  };

  const DropdownContent = () => (
    <div
      className="fixed w-64 z-[9999]"
      style={{
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`
      }}
    >
      <GlassCard variant="premium" className="p-0 overflow-hidden shadow-2xl">
        {/* Resto del contenido igual que antes... */}
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
          {menuItems.map((item) => (
            item.type === 'link' ? (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          ))}
        </div>

        <div className="p-2 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <>
      {/* Renderizar dropdown usando portal */}
      {createPortal(<DropdownContent />, document.body)}

      {/* Modal de perfil */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </>
  );
};

export { UserProfileDropdown };