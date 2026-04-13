// src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { FloatingParticles, GlassCard, PremiumButton } from '../components/ui';
import { useBooking } from '../hooks/useBooking';
import useAuth from "../hooks/useAuth.js";
import { LoginModal } from '../components/auth/LoginModal';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { updateBooking, completeBooking } = useBooking();

  // Obtener datos del state o contexto
  const paymentData = location.state || {};
  const { movie, theater, showtime, selectedDate, ticketCount, totalAmount } = paymentData;

  // Estados locales
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [pseData, setPseData] = useState({
    bankCode: '',
    bankName: '',
    documentType: 'CC',
    documentNumber: '',
    payerEmail: ''
  });
  const [pseRedirecting, setPseRedirecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

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

  // Métodos de pago disponibles
  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, American Express',
      disabled: false
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: BanknotesIcon,
      description: 'Pago Seguro en Línea — Débito bancario',
      disabled: false
    }
  ];

  useEffect(() => {
    if (!movie || !theater) {
      navigate('/cartelera');
      return;
    }

    // Sync context so completeBooking() has the right data regardless of how we arrived here
    updateBooking({
      movie,
      theater,
      showtime: showtime || null,
      selectedDate,
      ticketCount: ticketCount || 1,
      totalAmount: totalAmount || 0,
      paymentMethod: selectedPaymentMethod,
      step: 3,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie?.id, theater?.id, showtime?.id, selectedPaymentMethod]);

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    // Remover espacios y limitar a 16 dígitos
    const cleaned = value.replace(/\s/g, '').replace(/[^0-9]/g, '').substring(0, 16);
    // Agregar espacios cada 4 dígitos
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    // Formato MM/YY
    const cleaned = value.replace(/[^0-9]/g, '').substring(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 11).toUpperCase();
  };

  const resolvePaymentError = (error) => {
    const status = error?.response?.status || error?.status;
    const detail = error?.response?.data?.detail || error?.message || '';
    const isPse = selectedPaymentMethod === 'pse';

    if (status === 402 || detail.toLowerCase().includes('rechazada') || detail.toLowerCase().includes('declined')) {
      return {
        title: isPse ? 'Débito rechazado por el banco' : 'Tarjeta rechazada',
        message: detail || (isPse
          ? 'Tu banco no autorizó el débito. Verifica que tengas saldo disponible.'
          : 'Tu banco rechazó la transacción. Verifica los datos o usa otra tarjeta.'),
        type: 'declined',
      };
    }
    if (status === 503 || detail.toLowerCase().includes('no disponible') || detail.toLowerCase().includes('temporalmente')) {
      return {
        title: 'Servicio no disponible',
        message: 'El servicio de pagos está temporalmente fuera de línea. Intenta en unos minutos.',
        type: 'unavailable',
      };
    }
    if (status === 429) {
      return {
        title: 'Demasiados intentos',
        message: 'Has superado el límite de intentos. Espera 15 minutos e intenta de nuevo.',
        type: 'rate_limit',
      };
    }
    if (detail.toLowerCase().includes('disponible') || detail.toLowerCase().includes('tickets')) {
      return {
        title: 'Entradas agotadas',
        message: 'Las entradas seleccionadas ya no están disponibles.',
        type: 'no_stock',
      };
    }
    return {
      title: 'Error al procesar el pago',
      message: detail || 'Ocurrió un error inesperado. Intenta de nuevo.',
      type: 'generic',
    };
  };

  const handlePseInputChange = (field, value) => {
    setPseData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'bankCode') {
        const bank = colombianBanks.find(b => b.code === value);
        updated.bankName = bank ? bank.name : '';
      }
      return updated;
    });
  };

  const isPseFormValid = () => {
    return pseData.bankCode && pseData.documentType && pseData.documentNumber.length >= 4 && pseData.payerEmail.includes('@');
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setPaymentError(null);

    // PSE: mostrar pantalla de "redireccionando al banco" antes de procesar
    if (selectedPaymentMethod === 'pse') {
      setPseRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPseRedirecting(false);
    }

    setLoading(true);

    try {
      const txnId = generateTransactionId();
      setTransactionId(txnId);

      if (selectedPaymentMethod === 'pse') {
        updateBooking({ pseData, paymentMethod: 'pse' });
      } else {
        updateBooking({ cardData, paymentMethod: 'card' });
      }

      const completedBooking = await completeBooking(txnId);
      setShowConfirmation(true);

      setTimeout(() => {
        navigate('/payment-success', {
          state: { booking: completedBooking, transactionId: txnId, success: true }
        });
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(resolvePaymentError(error));
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de redirección PSE (cosmética)
  if (pseRedirecting) {
    const selectedBank = colombianBanks.find(b => b.code === pseData.bankCode);
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FloatingParticles count={30} className="opacity-20" />
        <div className="max-w-md mx-auto text-center">
          <GlassCard className="p-8">
            <BanknotesIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Conectando con tu banco
            </h2>
            <p className="text-white/70 mb-2">
              {selectedBank?.name || 'Tu banco'}
            </p>
            <p className="text-white/50 text-sm mb-6">
              Validando tu identidad de forma segura...
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-white/40 text-xs">
              No cierres esta ventana
            </p>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Modal de confirmación
  if (showConfirmation) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FloatingParticles count={50} className="opacity-30" />
        <div className="max-w-md mx-auto text-center">
          <GlassCard className="p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Pago Exitoso!
            </h2>
            <p className="text-white/80 mb-4">
              Tu reserva ha sido confirmada
            </p>
            <p className="text-sm text-white/60">
              ID: {transactionId}
            </p>
            <div className="mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-white/60 text-sm mt-2">
                Redirigiendo...
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Verificación de datos
  if (!movie || !theater || !showtime) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Información de pago no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingParticles count={25} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver
            </button>

            <h1 className="text-3xl font-bold text-white mb-2">
              Realizar Pago
            </h1>
            <p className="text-white/70">
              Completa tu reserva con un pago seguro
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Payment Methods */}
              <GlassCard className="p-6">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Método de Pago
                </h3>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`
                          flex items-center p-4 rounded-lg border transition-all duration-200
                          ${method.disabled
                            ? 'border-white/10 opacity-50 cursor-not-allowed'
                            : selectedPaymentMethod === method.id
                              ? 'border-blue-500 bg-blue-500/20 cursor-pointer'
                              : 'border-white/20 hover:border-white/40 cursor-pointer'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => !method.disabled && setSelectedPaymentMethod(e.target.value)}
                          disabled={method.disabled}
                          className="sr-only"
                        />
                        <Icon className="w-6 h-6 text-blue-400 mr-4" />
                        <div className="flex-1">
                          <p className="text-white font-medium">{method.name}</p>
                          <p className="text-white/60 text-sm">{method.description}</p>
                        </div>
                        {method.comingSoon && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                            Próximamente
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </GlassCard>

              {/* PSE Form */}
              {selectedPaymentMethod === 'pse' && (
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BanknotesIcon className="w-6 h-6 text-blue-400" />
                    <h3 className="text-white font-semibold text-lg">Pago con PSE</h3>
                  </div>
                  <p className="text-white/60 text-sm mb-4">
                    Serás autenticado de forma segura con tu banco para completar el débito.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Banco
                      </label>
                      <select
                        value={pseData.bankCode}
                        onChange={(e) => handlePseInputChange('bankCode', e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none appearance-none"
                      >
                        <option value="" className="bg-slate-800">Selecciona tu banco</option>
                        {colombianBanks.map(bank => (
                          <option key={bank.code} value={bank.code} className="bg-slate-800">
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          Tipo de documento
                        </label>
                        <select
                          value={pseData.documentType}
                          onChange={(e) => handlePseInputChange('documentType', e.target.value)}
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
                        <label className="block text-white/80 text-sm mb-2">
                          Número de documento
                        </label>
                        <input
                          type="text"
                          value={pseData.documentNumber}
                          onChange={(e) => handlePseInputChange('documentNumber', e.target.value.replace(/[^0-9]/g, '').substring(0, 15))}
                          placeholder="1234567890"
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={pseData.payerEmail}
                        onChange={(e) => handlePseInputChange('payerEmail', e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                      />
                      <p className="text-white/40 text-xs mt-1">
                        Recibirás el comprobante de pago en este correo.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Card Form - Solo mostrar si está seleccionada */}
              {selectedPaymentMethod === 'card' && (
                <GlassCard className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Información de la Tarjeta
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Nombre del titular
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value.toUpperCase())}
                        placeholder="NOMBRE COMPLETO"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          Fecha de vencimiento
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                          placeholder="123"
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Security Notice */}
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium text-sm">Pago 100% Seguro</p>
                    <p className="text-white/60 text-xs">
                      Tus datos están protegidos con cifrado SSL de 256 bits
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-8">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Resumen de Compra
                </h3>

                {/* Movie Info */}
                <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={movie.images?.poster || movie.poster_url}
                      alt={movie.title}
                      className="w-16 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {movie.title}
                      </h4>
                      <div className="text-xs text-white/70 space-y-1">
                        <p>{theater.name}</p>
                        <p>{showtime.time} - {showtime.format}</p>
                        <p>{new Date(selectedDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">
                      {ticketCount} x Entrada
                    </span>
                    <span className="text-white">
                      {formatPrice(ticketCount * showtime.price)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">
                      Tarifa de servicio
                    </span>
                    <span className="text-white">
                      {formatPrice(ticketCount * 800)}
                    </span>
                  </div>

                  <hr className="border-white/20" />

                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-green-400 font-bold text-xl">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Payment error banner */}
                {paymentError && (
                  <div className={`mb-4 p-4 rounded-lg border text-sm ${
                    paymentError.type === 'declined'
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : paymentError.type === 'unavailable'
                      ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}>
                    <p className="font-semibold mb-1">{paymentError.title}</p>
                    <p className="text-xs opacity-90">{paymentError.message}</p>
                  </div>
                )}

                {/* Pay Button */}
                <PremiumButton
                  onClick={handlePayment}
                  disabled={
                    loading ||
                    (selectedPaymentMethod === 'card' && (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv)) ||
                    (selectedPaymentMethod === 'pse' && !isPseFormValid())
                  }
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : selectedPaymentMethod === 'pse' ? (
                    <>
                      <BanknotesIcon className="w-5 h-5" />
                      Pagar con PSE {formatPrice(totalAmount)}
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5" />
                      Pagar {formatPrice(totalAmount)}
                    </>
                  )}
                </PremiumButton>

                {!isAuthenticated && (
                  <p className="text-yellow-400 text-xs mt-3 text-center">
                    Inicia sesión primero para completar el pago
                  </p>
                )}

                {/* Terms */}
                <div className="mt-4 text-xs text-white/60 space-y-1">
                  <p>Al continuar aceptas nuestros términos y condiciones</p>
                  <p>• Compra no reembolsable</p>
                  <p>• Válido solo para la función seleccionada</p>
                </div>
              </GlassCard>
            </div>
          </div>
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

export default PaymentPage;