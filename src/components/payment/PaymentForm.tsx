// src/components/payment/PaymentForm.jsx
import { useNavigate } from 'react-router-dom';
import {FloatingParticles, GlassCard, GlassInput} from '../common';

const PaymentForm = ({ bookingData, onSubmit, isProcessing, formData, setFormData }) => {
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.ownerName && formData.lastName && formData.documentNumber && formData.phoneNumber;

  if (isProcessing) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl mb-2">Procesando pago...</p>
          <p className="text-white/70">Por favor no cierre esta ventana</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={20} className="opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard variant="premium" className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Formulario */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img src="/api/placeholder/60/40" alt="Cine Colombia" className="h-10" />
                  <div>
                    <button
                      onClick={() => navigate(-1)}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Cambiar de cuenta
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-6">Selecciona un método de pago</h2>

                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Selección tarjeta */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.cardType === 'debit' 
                          ? 'border-blue-500 bg-blue-500/20' 
                          : 'border-white/20 bg-white/5'
                      }`}
                      onClick={() => handleInputChange('cardType', 'debit')}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <p className="text-white font-medium">Tarjeta débito</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.cardType === 'credit' 
                          ? 'border-blue-500 bg-blue-500/20' 
                          : 'border-white/20 bg-white/5'
                      }`}
                      onClick={() => handleInputChange('cardType', 'credit')}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <p className="text-white font-medium">Tarjeta crédito</p>
                        <div className="flex justify-center gap-1 mt-2">
                          <span className="text-xs">💎</span>
                          <span className="text-xs">🔷</span>
                          <span className="text-xs">⭐</span>
                          <span className="text-xs">🟦</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Campos */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="glass p-3 rounded-lg text-white bg-white/10"
                        value={formData.personType}
                        onChange={(e) => handleInputChange('personType', e.target.value)}
                      >
                        <option>Personas</option>
                      </select>

                      <select
                        className="glass p-3 rounded-lg text-white bg-white/10"
                        value={formData.bank}
                        onChange={(e) => handleInputChange('bank', e.target.value)}
                      >
                        <option value="">Seleccione su banco</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="davivienda">Davivienda</option>
                        <option value="banco_bogota">Banco de Bogotá</option>
                      </select>
                    </div>

                    <h3 className="text-white font-medium">Datos del propietario</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <GlassInput
                        placeholder="Nombre"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        required
                      />
                      <GlassInput
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <select
                        className="glass p-3 rounded-lg text-white bg-white/10"
                        value={formData.documentType}
                        onChange={(e) => handleInputChange('documentType', e.target.value)}
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="TI">TI</option>
                      </select>

                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Cédula de ciudadanía"
                          value={formData.documentNumber}
                          onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <select
                        className="glass p-3 rounded-lg text-white bg-white/10"
                        value={formData.phoneCountry}
                        onChange={(e) => handleInputChange('phoneCountry', e.target.value)}
                      >
                        <option value="+57">🇨🇴</option>
                      </select>

                      <div className="col-span-2">
                        <GlassInput
                          placeholder="Número de celular"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          required
                        />
                        {!formData.phoneNumber && (
                          <p className="text-red-400 text-xs mt-1">El teléfono no es válido</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all"
                    >
                      Atrás
                    </button>

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                        isFormValid
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Pagar ${bookingData.totalAmount?.toLocaleString('es-CO')}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-xs text-white/70">
                  <p>Al continuar acepto las políticas aplicables para el tratamiento de mis datos personales según la jurisdicción local del responsable y de Evertec PlacetoPay en su calidad de encargado.</p>
                </div>
              </div>

              {/* Resumen */}
              <div>
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">Total a pagar</h3>
                      <p className="text-2xl font-bold">${bookingData.totalAmount?.toLocaleString('es-CO')} COP</p>
                      <p className="text-sm opacity-80">
                        Compra {bookingData.ticketCount} Boleta(s). CN. {bookingData.theater?.name}. {bookingData.movie?.title}
                      </p>
                    </div>
                    <button className="text-white hover:bg-white/20 p-2 rounded">▼</button>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-white/70 font-medium">Referencia</h4>
                    <p className="text-white">17738484</p>
                  </div>
                  <div>
                    <h4 className="text-white/70 font-medium">Fecha de solicitud</h4>
                    <p className="text-white">2025-09-01 02:22:45</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-400">⏰</span>
                    <p className="text-white text-sm">Tu proceso expirará en 9 minutos</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">ℹ️</span>
                    <p className="text-white/70 text-sm">
                      Obtén ayuda en{' '}
                      <button className="text-blue-400 hover:underline">
                        supergerencia@cinecolombia.com
                      </button>
                    </p>
                  </div>

                  <div className="mt-4 text-xs text-white/50">
                    <p>Hecho por PlacetoPay</p>
                    <p>🇨🇴 Español (Colombia) ▼</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export { PaymentForm };
