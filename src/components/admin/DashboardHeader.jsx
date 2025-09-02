// src/components/admin/DashboardHeader.jsx
import React from 'react';
import { Film, LogOut, User } from 'lucide-react';

const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Film className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-white">Cinema Admin</h1>
            <p className="text-sm text-gray-400">Panel de administración</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-300">
            <User className="h-5 w-5 mr-2" />
            <div>
              <p className="text-sm font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-700"
            title="Cerrar Sesión"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span className="hidden sm:block">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;