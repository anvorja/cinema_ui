// src/components/admin/purchases/PurchaseRow.jsx
import React from 'react';
import { User, Film, Calendar, DollarSign, Ticket } from 'lucide-react';

const PurchaseRow = ({ purchase }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completada',
          className: 'bg-green-900 text-green-200',
          icon: '✓'
        };
      case 'pending':
        return {
          label: 'Pendiente',
          className: 'bg-yellow-900 text-yellow-200',
          icon: '⏳'
        };
      case 'cancelled':
        return {
          label: 'Cancelada',
          className: 'bg-red-900 text-red-200',
          icon: '✗'
        };
      default:
        return {
          label: 'Desconocido',
          className: 'bg-gray-900 text-gray-200',
          icon: '?'
        };
    }
  };

  const statusConfig = getStatusConfig(purchase.status);

  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
            <Ticket className="h-4 w-4 text-blue-400" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">
              #{purchase.id}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-purple-900 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-purple-400" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">
              {purchase.user?.first_name} {purchase.user?.last_name}
            </div>
            <div className="text-sm text-gray-400">
              {purchase.user?.email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 bg-orange-900 rounded-full flex items-center justify-center">
            <Film className="h-4 w-4 text-orange-400" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">
              {purchase.movie?.title || 'Película no encontrada'}
            </div>
            {purchase.movie?.genre && (
              <div className="text-sm text-gray-400">
                {purchase.movie.genre}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm font-medium text-white">
            {purchase.quantity}
          </span>
          <span className="ml-1 text-xs text-gray-400">
            {purchase.quantity === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm font-medium text-white">
            {formatPrice(purchase.total_amount || 0)}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
          <span className="mr-1">{statusConfig.icon}</span>
          {statusConfig.label}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          {purchase.created_at ? formatDate(purchase.created_at) : 'N/A'}
        </div>
      </td>
    </tr>
  );
};

export default PurchaseRow;