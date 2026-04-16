// src/components/admin/theaters/TheaterRow.jsx
import React from 'react';
import { Building2, ToggleLeft, ToggleRight } from 'lucide-react';

const TheaterRow = ({ theater, onToggle }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{theater.name}</div>
            <div className="text-sm text-gray-400">ID: {theater.id}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-300">{theater.location}</div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-400">{theater.description || '—'}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          theater.is_active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${theater.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
          {theater.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {theater.created_at ? formatDate(theater.created_at) : 'N/A'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onToggle(theater.id)}
          className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
            theater.is_active
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
              : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
          }`}
          title={theater.is_active ? 'Desactivar teatro' : 'Activar teatro'}
        >
          {theater.is_active ? (
            <><ToggleRight className="h-4 w-4 mr-1" />Desactivar</>
          ) : (
            <><ToggleLeft className="h-4 w-4 mr-1" />Activar</>
          )}
        </button>
      </td>
    </tr>
  );
};

export default TheaterRow;
