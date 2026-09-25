// src/pages/CardRechargePaymentPage.tsx
//
// Recarga de la tarjeta Cinema+ con Wompi: payment-service crea el cobro
// (referencia cinemaplus-<uuid>) y devuelve el enlace del Web Checkout. Wompi
// devuelve a /pago/resultado, igual que en la compra de boletas.
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CreditCard } from 'lucide-react';
import { FloatingParticles, GlassCard, PremiumButton } from '../components/common';
import useAuth from '../hooks/useAuth';
import { LoginModal } from '../components/auth/LoginModal';
import { getErrorMessage, paymentService } from '../services/api';
import { savePendingCheckout } from '../utils/pendingCheckout';
import { formatCOP } from '../utils/payments';

const CardRechargePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { amount } = (location.state as { amount: number }) || {};

  const [orderOpen, setOrderOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!amount) return <Navigate to="/recharge" replace />;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setPaymentError(null);
    setLoading(true);
    try {
      const payment = await paymentService.createRecharge(amount);
      savePendingCheckout({
        kind: 'recharge',
        reference: payment.reference,
        amount: payment.amount,
        startedAt: new Date().toISOString(),
      });
      window.location.assign(payment.checkout_url);
    } catch (error) {
      setPaymentError(getErrorMessage(error));
      setLoading(false);
    }
  };

  const firstName = (user as any)?.first_name || (user as any)?.firstName || '';
  const lastName = (user as any)?.last_name || (user as any)?.lastName || '';
  const userName = [firstName, lastName].filter(Boolean).join(' ');
  const userEmail = (user as any)?.email || '';
  const userPhone = (user as any)?.phone || '';

  return (
    <>
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FloatingParticles count={25} className="opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">

          {/* Order summary (collapsible) */}
          <GlassCard className="mb-4 overflow-hidden">
            <button
              onClick={() => setOrderOpen(v => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-white font-semibold hover:bg-white/[0.03] transition-colors"
            >
              <span>Mis compras</span>
              {orderOpen
                ? <ChevronUpIcon className="w-5 h-5 text-white/60" />
                : <ChevronDownIcon className="w-5 h-5 text-white/60" />}
            </button>
            {orderOpen && (
              <div className="px-6 pb-4 border-t border-white/10 pt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Recarga Portal Cinema+</p>
                </div>
                <span className="text-white font-semibold">{formatCOP(amount)}</span>
              </div>
            )}
          </GlassCard>

          {/* User info */}
          <GlassCard className="mb-4 px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">Su información</p>
                <p className="text-white/60 text-xs">
                  {[userName, userEmail, userPhone].filter(Boolean).join(', ')}
                </p>
              </div>
              <button
                onClick={() => navigate('/profile/settings')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors shrink-0"
              >
                Cambiar
              </button>
            </div>
          </GlassCard>

          <p className="text-white/40 text-xs mb-6">
            Al proceder al pago está aceptando nuestras{' '}
            <span className="text-blue-400 cursor-pointer hover:underline">Políticas de Privacidad y Términos y condiciones.</span>
          </p>

          <h2 className="text-white font-bold text-xl mb-4">Pago</h2>

          <GlassCard className="mb-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="text-white/60 text-sm">Total</span>
              <span className="text-white font-bold text-lg">{formatCOP(amount)}</span>
            </div>
            <div className="px-6 py-5 flex items-start gap-3">
              <LockClosedIcon className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm">Pagas en Wompi</p>
                <p className="text-white/60 text-xs">
                  Tarjeta, PSE, Nequi o Bancolombia. Tus datos de pago nunca pasan por Cinema+.
                </p>
              </div>
            </div>
          </GlassCard>

          {paymentError && (
            <div role="alert" className="mb-4 p-4 rounded-lg border text-sm bg-red-500/20 border-red-500/40 text-red-300">
              {paymentError}
            </div>
          )}

          <PremiumButton
            onClick={handlePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Llevándote a Wompi…
              </>
            ) : (
              <>
                <LockClosedIcon className="w-5 h-5" />
                Pagar con Wompi {formatCOP(amount)}
              </>
            )}
          </PremiumButton>

          <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
            <ShieldCheckIcon className="w-4 h-4" />
            Pago procesado por Wompi (Bancolombia)
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default CardRechargePaymentPage;
