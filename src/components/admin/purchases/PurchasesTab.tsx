// src/components/admin/purchases/PurchasesTab.jsx
import React, { useState } from 'react';
import { Loader, Download, Filter, Calendar, TrendingUp } from 'lucide-react';
import SearchBar from '../SearchBar';
import PurchaseRow from './PurchaseRow';

const PurchasesTab = ({
  purchases,
  loading,
  searchTerm,
  onSearchChange
}) => {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'confirmed', 'pending', 'cancelled', 'refunded'
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  // Filtrar compras
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toString().includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || purchase.status === filterStatus;

    let matchesDate = true;
    if (dateFilter !== 'all' && purchase.created_at) {
      const purchaseDate = new Date(purchase.created_at);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateFilter) {
        case 'today':
          matchesDate = purchaseDate >= todayStart;
          break;
        case 'week': {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = purchaseDate >= weekAgo;
          break;
        }
        case 'month': {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = purchaseDate >= monthAgo;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calcular estadísticas
  const totalRevenue = filteredPurchases.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0);
  const completedPurchases = filteredPurchases.filter(p => p.status === 'confirmed');
  const pendingPurchases = filteredPurchases.filter(p => p.status === 'pending');
  const totalTickets = filteredPurchases.reduce((sum, purchase) => sum + (purchase.quantity || 0), 0);

  const exportPurchases = () => {
    // Crear CSV con los datos de compras
    const headers = ['ID', 'Cliente', 'Email Cliente', 'Película', 'Cantidad', 'Total', 'Estado', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...filteredPurchases.map(purchase => [
        purchase.id,
        `"${purchase.user?.first_name} ${purchase.user?.last_name}"`,
        purchase.user?.email,
        `"${purchase.movie?.title}"`,
        purchase.quantity,
        purchase.total_amount,
        purchase.status === 'confirmed' ? 'Confirmada' :
        purchase.status === 'pending' ? 'Pendiente' :
        purchase.status === 'refunded' ? 'Reembolsada' : 'Cancelada',
        new Date(purchase.created_at).toLocaleDateString('es-ES')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `compras_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Buscar por cliente, película o ID..."
        />

        <div className="flex items-center space-x-4">
          {/* Filtro por fecha */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
              <option value="refunded">Reembolsadas</option>
            </select>
          </div>

          {/* Botón de exportar */}
          <button
            onClick={exportPurchases}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            title="Exportar compras a CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Compras</p>
          <p className="text-2xl font-bold text-white">{filteredPurchases.length}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Confirmadas</p>
          <p className="text-2xl font-bold text-green-400">{completedPurchases.length}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingPurchases.length}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Tickets</p>
          <p className="text-2xl font-bold text-blue-400">{totalTickets}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <p className="text-sm text-gray-400">Ingresos</p>
          </div>
          <p className="text-xl font-bold text-green-400">
            ${totalRevenue.toLocaleString()} COP
          </p>
        </div>
      </div>

      {/* Tabla de compras */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchTerm || filterStatus !== 'all' || dateFilter !== 'all'
                ? 'No se encontraron compras con los filtros aplicados'
                : 'No hay compras registradas'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Película
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {filteredPurchases.map((purchase) => (
                  <PurchaseRow
                    key={purchase.id}
                    purchase={purchase}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesTab;