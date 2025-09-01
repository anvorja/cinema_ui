// src/components/layout/UserProfileDropdown.jsx
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

const UserProfileDropdown = ({ onClose, user }) => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Mis Compras', href: '/profile/purchases', icon: TicketIcon },
    { name: 'Mis Transacciones', href: '/profile/transactions', icon: CreditCardIcon },
    { name: 'Mis Tarjetas Cineco', href: '/profile/cards', icon: CreditCardIcon },
    { name: 'Configuración', href: '/profile/settings', icon: Cog6ToothIcon }
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-64">
      <GlassCard variant="premium" className="p-0 overflow-hidden">
        {/* User Info */}
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
              <p className="text-white font-medium">{user?.name || 'Andrés'}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
          {user?.points && (
            <div className="mt-3 text-center">
              <p className="text-sm text-white/60">Estás a</p>
              <p className="text-lg font-bold text-yellow-400">{user.points} visitas</p>
              <p className="text-sm text-white/60">de ser Cliente Platino 👑</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
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
};

export { UserProfileDropdown };