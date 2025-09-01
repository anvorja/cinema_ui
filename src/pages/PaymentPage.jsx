// src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {FloatingParticles, GlassCard, PremiumButton} from '../components/ui';
import {PaymentForm, PaymentMethodSelector} from "../components/payment/index.js";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};
  const { movie, theater, showtime, selectedDate, ticketCount, ticketPrice, serviceFee, totalAmount } = bookingData;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Payment form data
  const [paymentForm, setPaymentForm] = useState({
    cardType: '',
    personType: 'Personas',
    bank: '',
    ownerName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    phoneCountry: '+57',
    phoneNumber: ''
  });

  useEffect(() => {
    if (!movie || !theater || !showtime) {
      navigate('/cartelera');
    }
  }, [movie, theater, showtime, navigate]);

  const paymentMethods = [
    {
      id: 'cineco_card',
      name: 'Tarjeta Cineco',
      description: 'Paga con tu Tarjeta Cineco y obtén un Precio Especial',
      icon: '🎫',
      type: 'card'
    },
    {
      id: 'platinum_card',
      name: 'Tarjeta Platino',
      description: 'Completa 30 visitas para ser Cliente Platino el próximo año',
      icon: '💎',
      type: 'card'
    },
    {
      id: 'cineco_points',
      name: 'Puntos Cineco',
      description: 'Usa tus Puntos Cineco para pagar tus entradas',
      icon: '⭐',
      type: 'points'
    },
    {
      id: 'debit_card',
      name: 'Tarjeta débito',
      description: 'Pago seguro con tu tarjeta débito',
      icon: '💳',
      type: 'card'
    },
    {
      id: 'credit_card',
      name: 'Tarjeta crédito',
      description: 'Visa, Mastercard, American Express, Diners',
      icon: '💳',
      type: 'card'
    }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setIsConfirmed(false);
  };

  const handlePayment = () => {
    setShowPaymentForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Navigate to success page or show success message
    setIsProcessing(false);
    navigate('/payment-success', {
      state: {
        ...bookingData,
        paymentMethod: selectedPaymentMethod,
        transactionId: 'T' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }
    });
  };

  if (!movie || !theater || !showtime) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Información de pago no encontrada</p>
          <PremiumButton onClick={() => navigate('/cartelera')}>
            Volver a Cartelera
          </PremiumButton>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return <PaymentForm
      bookingData={bookingData}
      paymentMethod={selectedPaymentMethod}
      onSubmit={handleFormSubmit}
      isProcessing={isProcessing}
      formData={paymentForm}
      setFormData={setPaymentForm}
    />;
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={25} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ESCOGER MEDIO DE PAGO</h1>
            <p className="text-white/80">1 de 3</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Payment Methods */}
            <div>
              <PaymentMethodSelector
                methods={paymentMethods}
                selectedMethod={selectedPaymentMethod}
                onSelect={handlePaymentMethodSelect}
              />

              {selectedPaymentMethod && (
                <div className="mt-6">
                  <PremiumButton
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                  >
                    CONTINUAR
                  </PremiumButton>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div>
              <GlassCard variant="premium" className="p-6">
                <div className="flex gap-4 mb-6">
                  <img
                    src={movie.posterImage}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-2">{movie.title}</h2>
                    <p className="text-white/80 text-sm mb-1">{movie.originalTitle}</p>
                    <p className="text-white/70 text-sm">{movie.ageRating}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white">
                    <span>Teatro:</span>
                    <span>{theater.name}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Función:</span>
                    <span>
                      {showtime.time}, {selectedDate?.dayName} {selectedDate?.dayNumber} de {selectedDate?.monthName} 2025
                    </span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Formato:</span>
                    <span>{showtime.format}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Boletas:</span>
                    <span>{ticketCount} x General</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-white">
                    <span>Subtotal boletas:</span>
                    <span>${(ticketCount * ticketPrice).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Tarifa de servicio:</span>
                    <span>${(ticketCount * serviceFee).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2">
                    <span>Total a pagar:</span>
                    <span>${totalAmount.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                {!isConfirmed && selectedPaymentMethod && (
                  <div className="mt-6">
                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg mb-4">
                      <input
                        type="checkbox"
                        id="confirm-purchase"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="confirm-purchase" className="text-white text-sm leading-relaxed">
                        Al pagar aceptas los{' '}
                        <button className="text-blue-400 hover:underline">
                          Términos y Condiciones
                        </button>{' '}
                        por favor{' '}
                        <button className="text-blue-400 hover:underline">
                          revisa los detalles de tu compra
                        </button>{' '}
                        antes de continuar con el pago.
                      </label>
                    </div>

                    <p className="text-white/70 text-sm mb-4">
                      Tienes máximo 10 minutos para completar tu compra. Una vez finalizada la transacción no es posible realizar cambios.
                    </p>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-xl">✓</span>
                      </div>
                      <h3 className="text-white font-bold text-lg">Confirmar Compra</h3>
                    </div>
                  </div>
                )}

                {isConfirmed && (
                  <div className="mt-6">
                    <PremiumButton
                      variant="premium"
                      size="lg"
                      className="w-full"
                      onClick={handlePayment}
                    >
                      PAGAR
                    </PremiumButton>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;