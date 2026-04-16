// src/pages/CardsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { purchaseService } from '../services/api';
import useAuth from '../hooks/useAuth';

const CARD_GRADIENTS = [
  'from-blue-600 to-purple-700',
  'from-purple-600 to-pink-700',
  'from-slate-600 to-blue-700',
  'from-emerald-600 to-teal-700',
];

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

const CardsPage = () => {
  const { isAuthenticated } = useAuth();
  const [usedMethods, setUsedMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    purchaseService.getMyPurchases({ limit: 50 })
      .then(data => {
        const purchases = Array.isArray(data) ? data : [];

        // Extraer métodos de pago únicos del historial
        const seen = new Map();
        purchases.forEach(p => {
          if (!p.payment_info) return;
          const pi = p.payment_info;

          if (pi.payment_method === 'pse') {
            const key = `pse-${pi.bank_name}`;
            if (!seen.has(key)) {
              seen.set(key, {
                type: 'pse',
                bank_name: pi.bank_name,
                payer_email: pi.payer_email,
                last_used: p.created_at,
              });
            }
          } else if (pi.last_four) {
            const key = `card-${pi.last_four}`;
            if (!seen.has(key)) {
              seen.set(key, {
                type: 'card',
                last_four: pi.last_four,
                card_holder: pi.card_holder,
                last_used: p.created_at,
              });
            }
          }
        });

        setUsedMethods([...seen.values()]);
      })
      .catch(() => setUsedMethods([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">

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
              <CreditCardIcon className="w-7 h-7 text-purple-400" />
              Mis Tarjetas Cineco
            </h1>
            <p className="text-white/50 text-sm mt-0.5">Métodos de pago utilizados en tus compras</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
          <InformationCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 text-sm font-medium">Sobre los métodos de pago</p>
            <p className="text-blue-300/70 text-xs mt-1">
              CinemaPlus no almacena datos completos de tarjetas. Por seguridad, los datos de
              pago se ingresan en cada transacción. Aquí ves un resumen de los métodos que has
              usado en compras anteriores.
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { icon: LockClosedIcon, text: 'Cifrado SSL/TLS' },
            { icon: ShoppingCartIcon, text: 'PCI-DSS compliant' },
            { icon: CreditCardIcon, text: 'Procesado por PayU' },
          ].map(badge => (
            <div key={badge.text} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <badge.icon className="w-3.5 h-3.5 text-green-400" />
              <span className="text-white/60 text-xs">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Methods list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-purple-400" />
          </div>
        ) : usedMethods.length === 0 ? (
          <div className="text-center py-16">
            <CreditCardIcon className="w-14 h-14 text-white/15 mx-auto mb-4" />
            <p className="text-white/50 text-sm">No has realizado ninguna compra aún.</p>
            <p className="text-white/30 text-xs mt-1">Los métodos de pago usados aparecerán aquí.</p>
            <Link
              to="/cartelera"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Ver cartelera
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
              Métodos usados anteriormente
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {usedMethods.map((method, idx) => (
                method.type === 'card' ? (
                  // Visual de tarjeta de crédito
                  <div
                    key={idx}
                    className={`relative bg-gradient-to-br ${CARD_GRADIENTS[idx % CARD_GRADIENTS.length]} rounded-2xl p-5 shadow-xl overflow-hidden`}
                  >
                    {/* Card decoration */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <CreditCardIcon className="w-8 h-8 text-white/80" />
                        <span className="text-white/60 text-xs uppercase tracking-widest">
                          {method.last_four?.startsWith('4') ? 'VISA' : 'MASTERCARD'}
                        </span>
                      </div>

                      <p className="text-white/70 text-lg tracking-widest font-mono mb-4">
                        •••• •••• •••• {method.last_four}
                      </p>

                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider">Titular</p>
                          <p className="text-white text-sm font-medium mt-0.5">
                            {method.card_holder || 'TITULAR'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50 text-xs uppercase tracking-wider">Último uso</p>
                          <p className="text-white/80 text-xs mt-0.5">{formatDate(method.last_used)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // PSE
                  <div
                    key={idx}
                    className="relative bg-gradient-to-br from-teal-700 to-emerald-800 rounded-2xl p-5 shadow-xl overflow-hidden"
                  >
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <BanknotesIcon className="w-8 h-8 text-white/80" />
                        <span className="text-white/60 text-xs uppercase tracking-widest">PSE</span>
                      </div>
                      <p className="text-white font-semibold text-base mb-1">{method.bank_name}</p>
                      <p className="text-white/60 text-xs mb-4">{method.payer_email}</p>
                      <div className="text-right">
                        <p className="text-white/50 text-xs uppercase tracking-wider">Último uso</p>
                        <p className="text-white/80 text-xs mt-0.5">{formatDate(method.last_used)}</p>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        {usedMethods.length > 0 && (
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <p className="text-white/60 text-sm">¿Quieres comprar más boletas?</p>
            <Link
              to="/cartelera"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Ver cartelera
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsPage;
