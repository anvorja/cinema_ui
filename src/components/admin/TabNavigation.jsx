// src/components/admin/TabNavigation.jsx
import React from 'react';
import { Film, Users, ShoppingCart, Building2, QrCode, BarChart2 } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'movies',
      label: 'Películas',
      icon: Film,
      description: 'Gestionar catálogo de películas'
    },
    {
      id: 'theaters',
      label: 'Teatros',
      icon: Building2,
      description: 'Activar / desactivar salas'
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      description: 'Administrar clientes'
    },
    {
      id: 'purchases',
      label: 'Compras',
      icon: ShoppingCart,
      description: 'Historial de transacciones'
    },
    {
      id: 'tickets',
      label: 'Boletería',
      icon: QrCode,
      description: 'Validar boletos en entrada'
    },
    {
      id: 'analytics',
      label: 'Analítica',
      icon: BarChart2,
      description: 'Ventas, ingresos y reembolsos'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
      <nav className="flex flex-col sm:flex-row">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 sm:border-b-0 sm:border-r border-gray-700 last:border-r-0 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 sm:border-b-2 sm:border-b-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">
                  {tab.label}
                </div>
                <div className="text-xs opacity-75 hidden lg:block">
                  {tab.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;