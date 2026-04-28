// src/pages/CardRechargePaymentPage.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { CreditCard } from 'lucide-react';
import { FloatingParticles, GlassCard, PremiumButton } from '../components/common';
import useAuth from '../hooks/useAuth';
import { LoginModal } from '../components/auth/LoginModal';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

const generateTransactionId = () =>
  'TXN' + Date.now() + Math.random().toString(36).substring(2, 11).toUpperCase();

const colombianBanks = [
  { code: '1007', name: 'Bancolombia' },
  { code: '1009', name: 'Citibank Colombia' },
  { code: '1013', name: 'BBVA Colombia' },
  { code: '1023', name: 'Banco de Occidente' },
  { code: '1032', name: 'Banco Caja Social' },
  { code: '1040', name: 'Banco Agrario' },
  { code: '1051', name: 'Davivienda' },
  { code: '1052', name: 'Banco AV Villas' },
  { code: '1058', name: 'Banco Popular' },
  { code: '1060', name: 'Banco de Bogotá' },
  { code: '1062', name: 'Banco Falabella' },
  { code: '1069', name: 'Scotiabank Colpatria' },
  { code: '1291', name: 'Nequi' },
];

const CardRechargePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { amount } = (location.state as { amount: number }) || {};

  const [orderOpen, setOrderOpen] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'pse'>('card');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [pseData, setPseData] = useState({
    bankCode: '', bankName: '', documentType: 'CC', documentNumber: '', payerEmail: '',
  });
  const [pseRedirecting, setPseRedirecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!amount) {
    navigate('/recharge');
    return null;
  }

  const formatCardNumber = (value: string) =>
    value.replace(/\s/g, '').replace(/[^0-9]/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '').substring(0, 4);
    return cleaned.length >= 2 ? cleaned.substring(0, 2) + '/' + cleaned.substring(2) : cleaned;
  };

  const isCardFormValid = () =>
    !!(cardData.number && cardData.name && cardData.expiry && cardData.cvv);

  const isPseFormValid = () =>
    !!(pseData.bankCode && pseData.documentType && pseData.documentNumber.length >= 4 && pseData.payerEmail.includes('@'));

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setPaymentError(null);

    if (selectedMethod === 'pse') {
      setPseRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPseRedirecting(false);
    }

    setLoading(true);
    try {
      const txnId = generateTransactionId();
      setTransactionId(txnId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowConfirmation(true);
      setTimeout(() => {
        navigate('/payment-success', {
          state: { recharge: true, amount, transactionId: txnId, success: true },
        });
      }, 2000);
    } catch {
      setPaymentError('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const firstName = (user as any)?.first_name || (user as any)?.firstName || '';
  const lastName = (user as any)?.last_name || (user as any)?.lastName || '';
  const userName = [firstName, lastName].filter(Boolean).join(' ');
  const userEmail = (user as any)?.email || '';
  const userPhone = (user as any)?.phone || '';

  /* ── PSE redirect screen ── */
  if (pseRedirecting) {
    const selectedBank = colombianBanks.find(b => b.code === pseData.bankCode);
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FloatingParticles count={30} className="opacity-20" />
        <div className="max-w-md mx-auto text-center">
          <GlassCard className="p-8">
            <BanknotesIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Conectando con tu banco</h2>
            <p className="text-white/70 mb-2">{selectedBank?.name || 'Tu banco'}</p>
            <p className="text-white/50 text-sm mb-6">Validando tu identidad de forma segura...</p>
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/40 text-xs">No cierres esta ventana</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  /* ── Success screen ── */
  if (showConfirmation) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FloatingParticles count={50} className="opacity-30" />
        <div className="max-w-md mx-auto text-center">
          <GlassCard className="p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Recarga Exitosa!</h2>
            <p className="text-white/80 mb-4">Tu tarjeta Cinema+ ha sido recargada</p>
            <p className="text-sm text-white/60">ID: {transactionId}</p>
            <div className="mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto" />
              <p className="text-white/60 text-sm mt-2">Redirigiendo...</p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

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
                <span className="text-white font-semibold">{formatCurrency(amount)}</span>
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

          {/* Payment section */}
          <h2 className="text-white font-bold text-xl mb-4">Pago</h2>

          <GlassCard className="mb-4 overflow-hidden">
            {/* Total row */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="text-white/60 text-sm">Total</span>
              <span className="text-white font-bold text-lg">{formatCurrency(amount)}</span>
            </div>

            {/* Payment method selector */}
            <div className="px-6 py-5">
              <p className="text-white font-semibold text-sm mb-3">Opciones de pago</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-white/50 text-xs font-semibold">
                    <CreditCardIcon className="w-4 h-4 text-purple-400" />
                    VISA · MC · AMEX
                  </div>
                  <p className="text-white text-sm font-medium">Tarjeta de Débito / Crédito</p>
                </button>

                <button
                  onClick={() => setSelectedMethod('pse')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedMethod === 'pse'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BanknotesIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-white/50 text-xs font-semibold">DÉBITO BANCARIO</span>
                  </div>
                  <p className="text-white text-sm font-medium">PSE</p>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Card form */}
          {selectedMethod === 'card' && (
            <GlassCard className="mb-4 p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Información de la Tarjeta</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Número de tarjeta</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={e => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Nombre del titular</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={e => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE COMPLETO"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Fecha de vencimiento</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={e => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">CVV</label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4) }))}
                      placeholder="123"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* PSE form */}
          {selectedMethod === 'pse' && (
            <GlassCard className="mb-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BanknotesIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-white font-semibold text-lg">Pago con PSE</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Serás autenticado de forma segura con tu banco para completar el débito.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Banco</label>
                  <select
                    value={pseData.bankCode}
                    onChange={e => {
                      const bank = colombianBanks.find(b => b.code === e.target.value);
                      setPseData(prev => ({ ...prev, bankCode: e.target.value, bankName: bank?.name || '' }));
                    }}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none appearance-none"
                  >
                    <option value="" className="bg-slate-800">Selecciona tu banco</option>
                    {colombianBanks.map(bank => (
                      <option key={bank.code} value={bank.code} className="bg-slate-800">{bank.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Tipo de documento</label>
                    <select
                      value={pseData.documentType}
                      onChange={e => setPseData(prev => ({ ...prev, documentType: e.target.value }))}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none appearance-none"
                    >
                      <option value="CC" className="bg-slate-800">CC — Cédula</option>
                      <option value="CE" className="bg-slate-800">CE — Extranjería</option>
                      <option value="NIT" className="bg-slate-800">NIT — Empresa</option>
                      <option value="PP" className="bg-slate-800">PP — Pasaporte</option>
                      <option value="TI" className="bg-slate-800">TI — Tarjeta identidad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Número de documento</label>
                    <input
                      type="text"
                      value={pseData.documentNumber}
                      onChange={e => setPseData(prev => ({ ...prev, documentNumber: e.target.value.replace(/[^0-9]/g, '').substring(0, 15) }))}
                      placeholder="1234567890"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    value={pseData.payerEmail}
                    onChange={e => setPseData(prev => ({ ...prev, payerEmail: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                  <p className="text-white/40 text-xs mt-1">Recibirás el comprobante de pago en este correo.</p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Security notice */}
          <GlassCard className="mb-6 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-medium text-sm">Pago 100% Seguro</p>
                <p className="text-white/60 text-xs">Tus datos están protegidos con cifrado SSL de 256 bits</p>
              </div>
            </div>
          </GlassCard>

          {/* Error */}
          {paymentError && (
            <div className="mb-4 p-4 rounded-lg border bg-red-500/20 border-red-500/40 text-red-300 text-sm">
              {paymentError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Atrás
            </button>

            <PremiumButton
              onClick={handlePayment}
              disabled={
                loading ||
                (selectedMethod === 'card' && !isCardFormValid()) ||
                (selectedMethod === 'pse' && !isPseFormValid())
              }
              className="flex-1 flex items-center justify-center gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Procesando...
                </>
              ) : selectedMethod === 'pse' ? (
                <>
                  <BanknotesIcon className="w-5 h-5" />
                  Pagar con PSE {formatCurrency(amount)}
                </>
              ) : (
                <>
                  <CreditCardIcon className="w-5 h-5" />
                  Pagar {formatCurrency(amount)}
                </>
              )}
            </PremiumButton>
          </div>

          {!isAuthenticated && (
            <p className="text-yellow-400 text-xs mt-3 text-center">
              Inicia sesión primero para completar el pago
            </p>
          )}
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
