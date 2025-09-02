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
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  // Métodos de pago disponibles
  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: BanknotesIcon,
      description: 'Pago Seguro en Línea'
    }
  ];

  useEffect(() => {
    // Verificar que hay datos de pago
    if (!movie || !theater || !showtime) {
      navigate('/cartelera');
      return;
    }

    // Actualizar contexto con método de pago
    updateBookingData({
      paymentMethod: selectedPaymentMethod,
      step: 3
    });
  }, [movie, theater, showtime, selectedPaymentMethod, updateBooking, navigate]);

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

  const handlePayment = async () => {
    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      navigate('/login', {
        state: { returnTo: '/payment', returnData: location.state }
      });
      return;
    }

    setLoading(true);

    try {
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar ID de transacción
      const txnId = generateTransactionId();
      setTransactionId(txnId);

      // Completar booking en el contexto
      const completedBooking = await completeBooking(txnId);

      // Mostrar confirmación
      setShowConfirmation(true);

      // Redirigir a tu página de éxito existente
      setTimeout(() => {
        navigate('/payment-success', {
          state: {
            booking: completedBooking,
            transactionId: txnId
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
                          flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200
                          ${selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="w-6 h-6 text-blue-400 mr-4" />
                        <div>
                          <p className="text-white font-medium">{method.name}</p>
                          <p className="text-white/60 text-sm">{method.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </GlassCard>

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

              {/* PSE Form */}
              {selectedPaymentMethod === 'pse' && (
                <GlassCard className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Pago PSE
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Tipo de persona
                      </label>
                      <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none">
                        <option value="natural">Persona Natural</option>
                        <option value="juridica">Persona Jurídica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Banco
                      </label>
                      <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none">
                        <option value="">Selecciona tu banco</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="davivienda">Davivienda</option>
                        <option value="bbva">BBVA</option>
                        <option value="banco_bogota">Banco de Bogotá</option>
                        <option value="banco_popular">Banco Popular</option>
                      </select>
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

                {/* Pay Button */}
                <PremiumButton
                  onClick={handlePayment}
                  disabled={loading || (selectedPaymentMethod === 'card' && (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv))}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando...
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
                    Serás redirigido al login para completar el pago
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
  );
};

export default PaymentPage;