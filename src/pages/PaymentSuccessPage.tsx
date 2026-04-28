// src/pages/PaymentSuccessPage.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import {
  CheckCircleIcon,
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  FilmIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  UserIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import {FloatingParticles, GlassCard, PremiumButton} from '../components/common';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQRCode, setShowQRCode] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extraer datos del estado de navegación
  // PaymentPage navega con { booking: completedBooking, transactionId, success }
  // completedBooking tiene { movie, theater, showtime, selectedDate, ticketCount, totalAmount, paymentMethod, seats }
  const { booking, transactionId } = location.state || {};
  const {
    movie,
    theater,
    showtime,
    selectedDate,
    ticketCount,
    totalAmount,
    paymentMethod,
    seats: realSeats,
  } = booking || {};

  // Redirigir si no hay datos de pago
  useEffect(() => {
    if (!movie || !transactionId) {
      navigate('/');
    }
  }, [movie, transactionId, navigate]);

  // Si no hay datos, no renderizar nada
  if (!movie || !transactionId) {
    return null;
  }

  // Información adicional de las boletas
  // ticket_codes reales del backend (CINE-XXXXXXX), uno por boleta
  const ticketCodes = booking?.ticket_codes || [];

  const ticketInfo = {
    reference: transactionId,
    date: new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    // Usar asientos reales del backend si están disponibles
    seats: Array.isArray(realSeats) ? realSeats.join(', ') : (realSeats || `${ticketCount || 1} x General`),
    // Primer ticket_code como QR principal; si no hay, fallback a transactionId
    qrCode: ticketCodes[0] || booking?.qrCode || transactionId,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')
  };

  // Descarga las boletas como PDF usando la ventana de impresión del navegador.
  // Los QR se renderizan con react-qr-code (SVG nativo), sin dependencias extra.
  const handleDownloadPDF = () => {
    setIsDownloading(true);

    const codes = ticketCodes.length > 0 ? ticketCodes : [ticketInfo.qrCode];
    const showDate = selectedDate
      ? `${selectedDate.dayName} ${selectedDate.dayNumber} de ${selectedDate.monthName} 2025`
      : '';

    // Serializar los SVG de QR que ya están renderizados en el DOM
    const qrNodes = document.querySelectorAll('[data-qr-print]');
    const qrSvgs = Array.from(qrNodes).map(node => node.innerHTML);

    // Si por alguna razón no se encontraron los SVG en el DOM, usar URLs externas
    const ticketBlocks = codes.map((code, idx) => {
      const svgContent = qrSvgs[idx] || '';
      const qrFallback = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(code)}" width="160" height="160" alt="QR ${code}" />`;
      return `
        <div class="ticket-block">
          <div class="ticket-header">
            <span class="ticket-num">Boleta ${idx + 1} de ${codes.length}</span>
            <span class="ticket-movie">${movie?.title || ''}</span>
          </div>
          <div class="ticket-body">
            <div class="ticket-info">
              <div class="info-row"><span class="label">Teatro:</span><span>${theater?.name || ''}</span></div>
              <div class="info-row"><span class="label">Ubicación:</span><span>${theater?.location || ''}</span></div>
              <div class="info-row"><span class="label">Función:</span><span>${showtime?.time || ''} ${showtime?.format || ''}</span></div>
              <div class="info-row"><span class="label">Fecha:</span><span>${showDate}</span></div>
              <div class="info-row"><span class="label">Asiento:</span><span>${ticketInfo.seats}</span></div>
              <div class="info-row code-row"><span class="label">Código:</span><span class="code">${code}</span></div>
              <div class="info-row"><span class="label">Transacción:</span><span class="small">${transactionId}</span></div>
            </div>
            <div class="ticket-qr">
              ${svgContent || qrFallback}
              <p class="qr-label">Escanea en entrada</p>
            </div>
          </div>
        </div>`;
    }).join('');

    const printHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Boletas — ${movie?.title || 'Cinema'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 24px; }
    h1 { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 6px; color: #1e3a5f; }
    .subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 24px; }
    .ticket-block {
      border: 2px solid #2575fc; border-radius: 12px;
      margin-bottom: 20px; overflow: hidden; page-break-inside: avoid;
    }
    .ticket-header {
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      color: white; padding: 12px 16px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .ticket-num { font-size: 11px; font-weight: 600; opacity: 0.85; }
    .ticket-movie { font-size: 15px; font-weight: 700; }
    .ticket-body { display: flex; gap: 0; }
    .ticket-info { flex: 1; padding: 14px 16px; border-right: 1px dashed #c0caff; }
    .info-row { display: flex; gap: 8px; margin-bottom: 7px; font-size: 12px; align-items: flex-start; }
    .label { font-weight: 600; color: #555; min-width: 90px; flex-shrink: 0; }
    .code { font-family: 'Courier New', monospace; font-size: 13px; font-weight: 700; color: #2575fc; }
    .small { font-size: 10px; color: #888; word-break: break-all; }
    .code-row { margin-top: 10px; }
    .ticket-qr {
      width: 180px; flex-shrink: 0;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 14px; background: #f8f9ff;
    }
    .ticket-qr svg { width: 160px !important; height: 160px !important; }
    .ticket-qr img { border: none; }
    .qr-label { font-size: 9px; color: #888; margin-top: 6px; text-align: center; }
    @media print {
      body { padding: 12px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>🎬 Cinema Tickets — Boletas Digitales</h1>
  <p class="subtitle">Referencia: ${transactionId} · Total: $${totalAmount?.toLocaleString('es-CO')} COP</p>
  ${ticketBlocks}
  <p style="text-align:center;font-size:10px;color:#aaa;margin-top:16px;">
    Generado el ${new Date().toLocaleDateString('es-CO')} · Válido solo para la función indicada
  </p>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=700,height=900');
    if (win) {
      win.document.write(printHTML);
      win.document.close();
    }

    setIsDownloading(false);
  };

  // Función para compartir
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Boleta para ${movie.title}`,
          text: `¡Voy a ver ${movie.title} en ${theater.name}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      await navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <FloatingParticles count={30} className="opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">¡Pago Exitoso!</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Tu compra ha sido procesada correctamente. Recibirás un email con los detalles de tus boletas.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* Transaction Details - Main Content */}
            <div className="xl:col-span-2 space-y-6">

              {/* Movie and Booking Info */}
              <GlassCard variant="premium" className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TicketIcon className="w-6 h-6" />
                  Detalles de tu Compra
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Movie Poster and Basic Info */}
                  <div className="flex gap-4">
                    <img
                      src={movie.posterImage}
                      alt={movie.title}
                      className="w-24 sm:w-28 h-36 sm:h-42 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-xl mb-2">{movie.title}</h3>
                      <p className="text-white/80 text-sm mb-2">{movie.originalTitle}</p>
                      <p className="text-white/70 text-sm mb-3">{movie.ageRating}</p>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {movie.genre}
                        </span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                          {movie.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPinIcon className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white/70 font-medium mb-1">Teatro</h4>
                          <p className="text-white font-medium">{theater.name}</p>
                          <p className="text-white/60 text-xs">{theater.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarDaysIcon className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white/70 font-medium mb-1">Fecha y Hora</h4>
                          <p className="text-white font-medium">{showtime.time}</p>
                          <p className="text-white/60 text-xs">
                            {selectedDate?.dayName} {selectedDate?.dayNumber} de {selectedDate?.monthName} 2025
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FilmIcon className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white/70 font-medium mb-1">Formato</h4>
                          <p className="text-white font-medium">{showtime.format}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <TicketIcon className="w-5 h-5 text-white/70 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-white/70 font-medium mb-1">Boletas</h4>
                          <p className="text-white font-medium">{ticketCount} x General</p>
                          <p className="text-white/60 text-xs">Asientos: {ticketInfo.seats}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-white/20 mt-6 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white/70 text-sm mb-1">Total Pagado</h4>
                      <p className="text-2xl font-bold text-green-400">
                        ${totalAmount.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">Referencia</p>
                      <p className="text-white font-mono">{booking?.transactionId || transactionId}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* QR Code Section */}
              <GlassCard variant="premium" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Código QR de Acceso</h3>
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    {showQRCode ? 'Ocultar' : 'Mostrar'} QR
                  </button>
                </div>

                {showQRCode && (
                  <div className="text-center py-6 space-y-4">
                    {ticketCodes.length > 0 ? (
                      ticketCodes.map((code, idx) => (
                        <div key={code} className="flex flex-col items-center gap-2">
                          {ticketCodes.length > 1 && (
                            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                              Boleta {idx + 1}
                            </p>
                          )}
                          <div className="bg-white p-3 rounded-xl shadow-lg inline-block" data-qr-print>
                            <QRCode value={code} size={180} />
                          </div>
                          <p className="text-white/50 font-mono text-xs">{code}</p>
                        </div>
                      ))
                    ) : (
                      /* Fallback si el backend no retornó ticket_codes todavía */
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-3 rounded-xl shadow-lg inline-block" data-qr-print>
                          <QRCode value={ticketInfo.qrCode} size={180} />
                        </div>
                        <p className="text-white/50 font-mono text-xs">{ticketInfo.qrCode}</p>
                      </div>
                    )}
                    <p className="text-white/70 text-sm">
                      Presenta este código QR en la entrada del cine
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar - Actions and Payment Info */}
            <div className="xl:col-span-1 space-y-6">

              {/* Payment Method */}
              <GlassCard variant="premium" className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Método de Pago</h3>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{paymentMethod?.icon}</span>
                  <div>
                    <p className="text-white font-medium">{paymentMethod?.name}</p>
                    <p className="text-white/70 text-sm">Transacción exitosa</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm font-medium">
                    ✓ Pago confirmado el {ticketInfo.date}
                  </p>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="space-y-4">
                <PremiumButton
                  variant="premium"
                  size="lg"
                  className="w-full"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  {isDownloading ? 'Descargando...' : 'Descargar Boletas PDF'}
                </PremiumButton>

                <div className="grid grid-cols-2 gap-3">
                  <PremiumButton
                    variant="secondary"
                    size="default"
                    className="flex-1"
                    onClick={() => navigate('/profile/purchases')}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Mis Compras
                  </PremiumButton>

                  <PremiumButton
                    variant="ghost"
                    size="default"
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Compartir
                  </PremiumButton>
                </div>

                <PremiumButton
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Volver al Inicio
                </PremiumButton>
              </div>

              {/* Instructions */}
              <GlassCard variant="default" className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Instrucciones Importantes</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg flex-shrink-0">📧</span>
                    <div>
                      <p className="font-medium text-white mb-1">Email de confirmación</p>
                      <p>Recibirás un correo con tus boletas digitales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg flex-shrink-0">📱</span>
                    <div>
                      <p className="font-medium text-white mb-1">En el cine</p>
                      <p>Presenta tu boleta digital o el código QR</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg flex-shrink-0">⏰</span>
                    <div>
                      <p className="font-medium text-white mb-1">Llega temprano</p>
                      <p>Te recomendamos llegar 30 minutos antes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-blue-400 text-lg flex-shrink-0">🎫</span>
                    <div>
                      <p className="font-medium text-white mb-1">Conserva tu boleta</p>
                      <p>Mantenla visible durante toda la función</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-lg flex-shrink-0">📅</span>
                    <div>
                      <p className="font-medium text-white mb-1">Válida hasta</p>
                      <p>{ticketInfo.validUntil}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Digital Wallet Options */}
              <GlassCard variant="default" className="p-4">
                <h4 className="text-white font-medium mb-3 text-center">Agregar a Wallet</h4>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <span>🍎</span>
                    Apple Wallet
                  </button>
                  <button className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <span>📱</span>
                    Google Pay
                  </button>
                </div>
              </GlassCard>

              {/* Customer Service */}
              <GlassCard variant="default" className="p-4">
                <h4 className="text-white font-medium mb-2">¿Necesitas ayuda?</h4>
                <p className="text-white/70 text-sm mb-3">
                  Contáctanos si tienes algún problema con tu compra
                </p>
                <div className="space-y-2">
                  <button className="w-full py-2 px-4 glass rounded-lg text-white text-sm hover:glass-hover transition-all">
                    📞 Llamar al (601) 307-0707
                  </button>
                  <button className="w-full py-2 px-4 glass rounded-lg text-white text-sm hover:glass-hover transition-all">
                    📧 supergerencia@cinemaplus.com
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;