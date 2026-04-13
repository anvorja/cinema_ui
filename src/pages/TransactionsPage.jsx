// src/pages/TransactionsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ReceiptRefundIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { purchaseService, getErrorMessage } from '../services/api';
import useAuth from '../hooks/useAuth';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmada', icon: CheckCircleIcon, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  cancelled:  { label: 'Cancelada',  icon: XCircleIcon,     color: 'text-red-400',   bg: 'bg-red-400/10 border-red-400/20' },
  refunded:   { label: 'Reembolsada',icon: ArrowPathIcon,   color: 'text-yellow-400',bg: 'bg-yellow-400/10 border-yellow-400/20' },
  pending:    { label: 'Pendiente',  icon: ClockIcon,       color: 'text-blue-400',  bg: 'bg-blue-400/10 border-blue-400/20' },
};

const PaymentBadge = ({ paymentInfo }) => {
  if (!paymentInfo) return <span className="text-white/40 text-xs">—</span>;

  if (paymentInfo.payment_method === 'pse') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-white/70">
        <BanknotesIcon className="w-4 h-4 text-blue-400" />
        PSE · {paymentInfo.bank_name || 'Banco'}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-white/70">
      <CreditCardIcon className="w-4 h-4 text-purple-400" />
      Tarjeta •••• {paymentInfo.last_four || '****'}
    </span>
  );
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const TransactionsPage = () => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    purchaseService.getMyPurchases({ limit: 50 })
      .then(data => setTransactions(Array.isArray(data) ? data : []))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    setError('');
    try {
      await purchaseService.cancel(id);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'refunded' } : t));
      setSuccessMsg('Compra cancelada y reembolso procesado exitosamente');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError(getErrorMessage(err));
      setTimeout(() => setError(''), 6000);
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = statusFilter === 'all'
    ? transactions
    : transactions.filter(t => t.status === statusFilter);

  const stats = {
    total: transactions.length,
    confirmed: transactions.filter(t => t.status === 'confirmed').length,
    refunded: transactions.filter(t => t.status === 'refunded' || t.status === 'cancelled').length,
    totalSpent: transactions
      .filter(t => t.status === 'confirmed')
      .reduce((sum, t) => sum + t.total_amount, 0),
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ReceiptRefundIcon className="w-7 h-7 text-blue-400" />
              Mis Transacciones
            </h1>
            <p className="text-white/50 text-sm mt-0.5">Historial completo de tus compras y pagos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'Confirmadas', value: stats.confirmed, color: 'text-green-400' },
            { label: 'Reembolsadas', value: stats.refunded, color: 'text-yellow-400' },
            { label: 'Gastado', value: formatCurrency(stats.totalSpent), color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white/50 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/15 border border-green-500/25 rounded-lg text-green-300 text-sm">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <FunnelIcon className="w-4 h-4 text-white/40" />
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'confirmed', label: 'Confirmadas' },
              { value: 'refunded', label: 'Reembolsadas' },
              { value: 'pending', label: 'Pendientes' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-blue-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ReceiptRefundIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">
              {statusFilter === 'all' ? 'No tienes transacciones registradas.' : `No hay transacciones con estado "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(tx => {
              const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const isConfirmed = tx.status === 'confirmed';
              return (
                <div
                  key={tx.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Poster */}
                    {tx.movie?.poster_url ? (
                      <img
                        src={tx.movie.poster_url}
                        alt={tx.movie.title}
                        className="w-12 h-16 object-cover rounded-lg border border-white/10 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white/30 text-xs">N/A</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-white font-semibold text-sm truncate">
                            {tx.movie?.title || 'Película'}
                          </p>
                          <p className="text-white/50 text-xs mt-0.5">
                            {tx.quantity} boleta{tx.quantity !== 1 ? 's' : ''} · {tx.movie?.genre || ''}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                        <div>
                          <p className="text-white/40 text-xs">Transacción</p>
                          <p className="text-white/70 text-xs font-mono truncate">
                            {tx.payment_info?.transaction_id || `#${tx.id}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Método de pago</p>
                          <PaymentBadge paymentInfo={tx.payment_info} />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Fecha de compra</p>
                          <p className="text-white/70 text-xs">{formatDate(tx.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Monto</p>
                          <p className="text-blue-300 text-sm font-semibold">{formatCurrency(tx.total_amount)}</p>
                        </div>
                        {tx.show_date && (
                          <div className="col-span-2">
                            <p className="text-white/40 text-xs">Función</p>
                            <p className="text-white/70 text-xs">
                              {new Date(tx.show_date + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
                              {tx.show_time && <span className="ml-1 text-blue-300 font-medium">· {tx.show_time}</span>}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tickets */}
                      {tx.tickets?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tx.tickets.map(ticket => (
                            <span
                              key={ticket.id}
                              className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/50 font-mono"
                              title={`Asiento: ${ticket.seat_number}`}
                            >
                              {ticket.ticket_code} · {ticket.seat_number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cancel */}
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancel(tx.id)}
                        disabled={cancellingId === tx.id}
                        className="flex-shrink-0 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {cancellingId === tx.id ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin rounded-full h-3 w-3 border border-red-400/30 border-t-red-400" />
                            Cancelando
                          </span>
                        ) : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
