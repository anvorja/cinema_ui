// src/components/layout/Sidebar.jsx
import { Link } from 'react-router-dom';
import { XMarkIcon, HomeIcon, FilmIcon, ClockIcon } from '@heroicons/react/24/outline';
import { PremiumButton } from '../ui';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();

  const menuSections = [
    {
      title: 'CINE',
      items: [
        { name: 'Inicio', href: '/', icon: HomeIcon },
        { name: 'Cartelera', href: '/cartelera', icon: FilmIcon },
        { name: 'Pronto', href: '/pronto', icon: ClockIcon }
      ]
    },
    {
      title: 'COMIDAS',
      items: [
        { name: 'Menú', href: '/comidas', icon: null },
        { name: 'Domicilios', href: '/domicilios', icon: null }
      ]
    }
  ];

  return (
    <div className={`fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-xl z-50 transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-white font-bold">CINE COLOMBIA</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass-hover transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-8' : ''}>
              <h3 className="text-sm font-semibold text-white/60 mb-4 px-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Special Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-white/60 mb-4 px-3">OTROS</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 transition-all duration-200">
                <span className="text-xl">💳</span>
                <span className="font-medium">RECARGAR TARJETA CINECO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          {isAuthenticated ? (
            <PremiumButton
              variant="ghost"
              className="w-full"
              onClick={logout}
            >
              Cerrar Sesión
            </PremiumButton>
          ) : (
            <div className="space-y-3">
              <PremiumButton variant="default" className="w-full">
                Iniciar Sesión
              </PremiumButton>
              <PremiumButton variant="ghost" className="w-full">
                ¿No estás registrado? Regístrate aquí
              </PremiumButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export  {Sidebar}