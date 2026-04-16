// src/components/admin/users/UserRow.jsx
import React from 'react';
import { Shield, User, ToggleLeft, ToggleRight } from 'lucide-react';

const UserRow = ({ user, onToggle }) => {
  const handleToggle = () => {
    onToggle(user.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isAdmin = user.role === 'admin';

  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            isAdmin ? 'bg-purple-900' : 'bg-blue-900'
          }`}>
            {isAdmin ? (
              <Shield className="h-5 w-5 text-purple-400" />
            ) : (
              <User className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-sm text-gray-400">
              ID: {user.id}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">
          {user.email}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">
          {user.phone || 'N/A'}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isAdmin 
            ? 'bg-purple-900 text-purple-200' 
            : 'bg-blue-900 text-blue-200'
        }`}>
          {isAdmin ? (
            <>
              <Shield className="h-3 w-3 mr-1" />
              Administrador
            </>
          ) : (
            <>
              <User className="h-3 w-3 mr-1" />
              Cliente
            </>
          )}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active 
            ? 'bg-green-900 text-green-200' 
            : 'bg-red-900 text-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            user.is_active ? 'bg-green-400' : 'bg-red-400'
          }`} />
          {user.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {user.created_at ? formatDate(user.created_at) : 'N/A'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {!isAdmin ? (
          <button
            onClick={handleToggle}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
              user.is_active 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
            }`}
            title={user.is_active ? 'Deshabilitar usuario' : 'Habilitar usuario'}
          >
            {user.is_active ? (
              <>
                <ToggleRight className="h-4 w-4 mr-1" />
                Deshabilitar
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 mr-1" />
                Habilitar
              </>
            )}
          </button>
        ) : (
          <span className="text-gray-500 text-sm">
            Sin acciones
          </span>
        )}
      </td>
    </tr>
  );
};

export default UserRow;