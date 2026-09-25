// src/pages/PaymentsHistoryPage.tsx
//
// Historial de pagos con Wompi (payment-service): boletas y recargas
// Cinema+, cada uno con su referencia cinemaplus-<uuid>. Los enlaces que
// vencieron sin pagarse ("Sin completar": no se cobró nada) se ocultan salvo
// que la persona los pida.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, BanknotesIcon, CreditCardIcon, TicketIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import { getErrorMessage, paymentService } from '../services/api';
import { PAYMENT_STATUS, REFUND_LABELS, formatCOP, paymentMethodLabel } from '../utils/payments';

interface Payment {
  id: string;
  reference: string;
  kind: 'tickets' | 'recharge';
  order_id: number | null;
  description: string;
  amount: number;
  status: string;
  transaction_id: string | null;
  payment_method_type: string | null;
  last_four: string | null;
  refund_status: string | null;
  created_at: string;
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

const PaymentsHistoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    paymentService
      .getMine()
      .then(setPayments)
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const expiredCount = payments.filter(p => p.status === 'expired').length;
  const visible = showExpired ? payments : payments.filter(p => p.status !== 'expired');

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BanknotesIcon className="w-7 h-7 text-blue-400" />
              Historial de pagos
            </h1>
            <p className="text-white/50 text-sm mt-0.5">Boletas y recargas pagadas con Wompi</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <p className="text-white/60">Inicia sesión para ver tus pagos.</p>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-blue-400" />
          </div>
        ) : error ? (
          <div role="alert" className="p-3 bg-red-500/15 border border-red-500/25 rounded-lg text-red-300 text-sm">{error}</div>
        ) : visible.length === 0 ? (
          <p className="text-white/50 text-sm py-8 text-center">Todavía no hay pagos.</p>
        ) : (
          <ul className="space-y-3">
            {visible.map(p => {
              const status = PAYMENT_STATUS[p.status] || PAYMENT_STATUS.error;
              const Icon = p.kind === 'recharge' ? CreditCardIcon : TicketIcon;
              return (
                <li key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-white font-medium truncate">{p.description}</p>
                        <p className="text-white font-semibold tabular-nums">{formatCOP(p.amount)}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                        <span>{formatDateTime(p.created_at)}</span>
                        {p.transaction_id && <span>· {paymentMethodLabel(p.payment_method_type, p.last_four)}</span>}
                        <span className={`px-2 py-0.5 rounded-full border ${status.className}`}>{status.label}</span>
                        {p.refund_status && (
                          <span className="px-2 py-0.5 rounded-full border bg-yellow-500/15 text-yellow-300 border-yellow-500/30">
                            {REFUND_LABELS[p.refund_status] || p.refund_status}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-mono text-[11px] text-white/40 break-all">{p.reference}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {expiredCount > 0 && (
          <button
            onClick={() => setShowExpired(v => !v)}
            aria-expanded={showExpired}
            className="mt-4 text-sm text-white/50 hover:text-white/80 underline"
          >
            {showExpired
              ? 'Ocultar los intentos sin completar'
              : `Mostrar ${expiredCount} ${expiredCount === 1 ? 'intento' : 'intentos'} sin completar (no se cobró nada)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentsHistoryPage;
