// src/pages/PaymentSuccessPage.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import {
  CheckCircleIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  UserIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { PremiumButton } from '../components/common';

// Fecha de la función: llega como "YYYY-MM-DD" (del backend) o, en reservas
// guardadas por versiones anteriores, como { dayName, dayNumber, monthName }.
// "YYYY-MM-DD" se arma en hora local para que no se corra un día por UTC.
const formatShowDate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    const [y, m, d] = value.split('T')[0].split('-').map(Number);
    if (!y || !m || !d) return value;
    return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
  return [value.dayName, value.dayNumber, value.monthName && `de ${value.monthName}`].filter(Boolean).join(' ');
};

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    const showDate = formatShowDate(selectedDate);

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
  <title>Boletas — ${movie?.title || 'CinemaPlus'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=B612:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { margin: 12mm; }
    body { font-family: 'B612', Arial, sans-serif; background: #0c0c0d; color: #f4f1e8; padding: 24px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    h1 { font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif; font-size: 30px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 4px; }
    h1 span { color: #f2b705; }
    .subtitle { font-size: 11px; color: #c3bfb2; margin-bottom: 22px; }
    .ticket-block { border: 1px solid #46464c; background: #151517; margin-bottom: 18px; page-break-inside: avoid; }
    .ticket-header { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 16px; border-bottom: 2px dashed #46464c; }
    .ticket-num { font-size: 10px; font-weight: 700; color: #f2b705; text-transform: uppercase; }
    .ticket-movie { font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif; font-size: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .ticket-body { display: flex; }
    .ticket-info { flex: 1; padding: 14px 16px; border-right: 2px dashed #46464c; }
    .info-row { display: flex; gap: 8px; margin-bottom: 7px; font-size: 12px; align-items: flex-start; }
    .label { font-size: 10px; text-transform: uppercase; color: #8f8b80; min-width: 90px; flex-shrink: 0; padding-top: 2px; }
    .code { font-size: 13px; font-weight: 700; color: #f2b705; }
    .small { font-size: 10px; color: #8f8b80; word-break: break-all; }
    .code-row { margin-top: 10px; }
    .ticket-qr { width: 190px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px; }
    .ticket-qr svg, .ticket-qr img { background: #f4f1e8; padding: 8px; width: 160px !important; height: 160px !important; }
    .qr-label { font-size: 9px; color: #8f8b80; margin-top: 6px; text-align: center; }
    .foot { text-align: center; font-size: 10px; color: #8f8b80; margin-top: 16px; }
  </style>
</head>
<body>
  <h1>CINEMA<span>PLUS</span> · Tus boletas</h1>
  <p class="subtitle">Referencia: ${transactionId} · Total: $${totalAmount?.toLocaleString('es-CO')} COP</p>
  ${ticketBlocks}
  <p class="foot">Generado el ${new Date().toLocaleDateString('es-CO')} · Válido solo para la función indicada</p>
  <script>window.onload = () => { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => window.print(), 300)); }</script>
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

  const codes = ticketCodes.length > 0 ? ticketCodes : [ticketInfo.qrCode];

  return (
    <div>
      <div className="border-b border-board-line bg-board-ground">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <CheckCircleIcon className="h-6 w-6 text-board-okink" aria-hidden="true" />
          <p className="font-data text-sm font-bold text-board-okink">PAGO CONFIRMADO · {ticketInfo.date}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-board text-4xl font-bold tracking-[0.06em] uppercase sm:text-5xl">Tu salida está lista</h1>
        <p className="mt-2 max-w-[65ch] text-[17px] text-board-ink2">
          Presenta el código QR en la entrada del cine. También te enviamos las boletas por correo.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            {/* Pases de abordaje */}
            {codes.map((code, idx) => (
              <article key={code} className="b-stub grid sm:grid-cols-[minmax(0,1fr)_240px]" style={{ ['--stub-cut' as any]: '50%' }} aria-label={`Boleta ${idx + 1} de ${codes.length}`}>
                <div className="min-w-0 p-5 sm:p-6">
                  <div className="flex gap-4">
                    <img src={movie.posterImage} alt="" className="h-28 w-[76px] shrink-0 border border-board-line object-cover" />
                    <div className="min-w-0">
                      <h2 className="font-board text-3xl font-bold leading-none tracking-wide uppercase">{movie.title}</h2>
                      <p className="mt-1 font-data text-xs text-board-mute">{[showtime.format, movie.ageRating].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-dashed border-board-line2 pt-4">
                    <div><dt className="font-data text-[10px] uppercase text-board-mute">Cine</dt><dd className="mt-1 font-data text-sm font-bold">{theater.name}</dd></div>
                    <div><dt className="font-data text-[10px] uppercase text-board-mute">Hora</dt><dd className="mt-1 font-data text-2xl font-bold leading-none text-board-amberink">{showtime.time}</dd></div>
                    <div className="col-span-2"><dt className="font-data text-[10px] uppercase text-board-mute">Fecha</dt><dd className="mt-1 font-data text-sm font-bold">{formatShowDate(selectedDate)}</dd></div>
                    <div className="col-span-2"><dt className="font-data text-[10px] uppercase text-board-mute">Sillas de la compra</dt><dd className="mt-1 font-data text-sm font-bold">{ticketInfo.seats}</dd></div>
                  </dl>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 border-t-2 border-dashed border-board-line2 p-5 sm:border-l-2 sm:border-t-0">
                  <div className="bg-[#f4f1e8] p-3" data-qr-print>
                    <QRCode value={code} size={176} bgColor="#f4f1e8" fgColor="#0c0c0d" />
                  </div>
                  <p className="break-all text-center font-data text-[11px] text-board-mute">{code}</p>
                  {codes.length > 1 && <span className="b-tag">Boleta {idx + 1} de {codes.length}</span>}
                </div>
              </article>
            ))}

            {/* Cobro */}
            <section className="border border-board-line bg-board-panel p-5" aria-labelledby="cobro-titulo">
              <h2 id="cobro-titulo" className="mb-3 font-board text-2xl font-bold tracking-wide uppercase">Lo que pagaste</h2>
              {booking?.lines?.length > 0 && (
                <ul className="mb-4 space-y-1 font-data text-sm">
                  {booking.lines.map(line => (
                    <li key={`${line.kind}-${line.code}`} className="flex justify-between gap-3 text-board-ink2">
                      <span>{line.quantity} × {line.description}</span>
                      <span className="shrink-0">${line.line_total.toLocaleString('es-CO')}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-board-line pt-3">
                <div>
                  <p className="font-data text-[11px] uppercase text-board-mute">Total pagado</p>
                  <p className="font-data text-2xl font-bold text-board-amberink">${totalAmount.toLocaleString('es-CO')} COP</p>
                </div>
                <div className="text-right">
                  <p className="font-data text-[11px] uppercase text-board-mute">Referencia</p>
                  <p className="font-data text-sm">{booking?.transactionId || transactionId}</p>
                </div>
              </div>
              {paymentMethod?.name && <p className="mt-3 font-data text-xs text-board-mute">Medio de pago: {paymentMethod.name}</p>}
            </section>
          </div>

          {/* Acciones e indicaciones */}
          <aside className="space-y-6" aria-label="Acciones">
            <div className="space-y-3">
              <PremiumButton size="lg" className="w-full" onClick={handleDownloadPDF} disabled={isDownloading}>
                <ArrowDownTrayIcon className="h-5 w-5" />
                {isDownloading ? 'Preparando…' : 'Descargar boletas en PDF'}
              </PremiumButton>
              <div className="grid grid-cols-2 gap-3">
                <PremiumButton variant="secondary" onClick={() => navigate('/profile/purchases')}>
                  <UserIcon className="h-4 w-4" /> Mis compras
                </PremiumButton>
                <PremiumButton variant="secondary" onClick={handleShare}>
                  <ShareIcon className="h-4 w-4" /> Compartir
                </PremiumButton>
              </div>
              <PremiumButton variant="ghost" className="w-full" onClick={() => navigate('/')}>
                <HomeIcon className="h-5 w-5" /> Volver al inicio
              </PremiumButton>
            </div>

            <section className="border border-board-line p-5" aria-labelledby="indicaciones">
              <h2 id="indicaciones" className="mb-3 font-board text-2xl font-bold tracking-wide uppercase">Antes de entrar</h2>
              <ul className="space-y-3 text-[15px] text-board-ink2">
                <li><strong className="block text-board-ink">En la puerta</strong>Muestra el código QR de cada boleta desde tu celular.</li>
                <li><strong className="block text-board-ink">Llega con tiempo</strong>Te recomendamos llegar 30 minutos antes.</li>
                <li><strong className="block text-board-ink">Válida hasta</strong>{ticketInfo.validUntil}</li>
              </ul>
            </section>

            <section className="border border-board-line p-5" aria-labelledby="ayuda">
              <h2 id="ayuda" className="mb-2 font-board text-2xl font-bold tracking-wide uppercase">¿Algún problema?</h2>
              <p className="text-[15px] text-board-ink2">Escríbenos a <a className="text-board-amberink underline" href="mailto:supergerencia@cinemaplus.com">supergerencia@cinemaplus.com</a> o llama al <a className="text-board-amberink underline" href="tel:+576013070707">(601) 307-0707</a>.</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;