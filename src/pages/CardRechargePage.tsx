// src/pages/CardRechargePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Trash2, ChevronRight } from 'lucide-react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import { LoginModal } from '../components/auth/LoginModal';

const RECHARGE_AMOUNTS = [40000, 50000, 60000, 70000, 80000, 90000, 100000, 200000, 300000, 400000];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

const CardRechargePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePay = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    navigate('/recharge/payment', { state: { amount: selectedAmount } });
  };

  return (
    <>
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-amber-400" />
              Recargar Tarjeta Cinema+
            </h1>
          </div>

          <h2 className="text-white font-semibold text-lg mb-4">Escoger monto a recargar</h2>

          {/* Amount grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {RECHARGE_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-4 px-4 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 scale-[1.03]'
                    : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Cart summary */}
          {selectedAmount && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Items</p>
              </div>

              <div className="p-4 flex items-center gap-4 border-b border-white/10">
                <div className="w-14 h-14 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Recarga Portal Cinema+</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{formatCurrency(selectedAmount)}</span>
                  <button
                    onClick={() => setSelectedAmount(null)}
                    className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                    title="Quitar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                <span className="text-white/60 text-sm">Total</span>
                <span className="text-white font-bold text-lg">{formatCurrency(selectedAmount)}</span>
              </div>

              <div className="p-4">
                <button
                  onClick={handlePay}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
                >
                  Pagar
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
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

export default CardRechargePage;
