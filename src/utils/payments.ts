// src/utils/payments.ts — presentación de pagos de Wompi (payment-service).

// payment_method_type de Wompi → nombre legible.
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CARD: 'Tarjeta',
  PSE: 'PSE',
  NEQUI: 'Nequi',
  BANCOLOMBIA_TRANSFER: 'Botón Bancolombia',
  BANCOLOMBIA_QR: 'QR Bancolombia',
  BANCOLOMBIA_COLLECT: 'Corresponsal Bancolombia',
  DAVIPLATA: 'Daviplata',
};

export const paymentMethodLabel = (type?: string | null, lastFour?: string | null): string => {
  const name = (type && PAYMENT_METHOD_LABELS[type]) || 'Pago en línea';
  return lastFour && lastFour !== '****' ? `${name} •••• ${lastFour}` : name;
};

// Estado del pago (vista de payment-service) → etiqueta y estilo.
// expired: el enlace venció sin que empezara ningún pago; no se cobró nada.
export const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  approved: { label: 'Aprobado', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  pending: { label: 'Pendiente', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  declined: { label: 'Rechazado', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
  voided: { label: 'Anulado', className: 'bg-white/10 text-white/60 border-white/20' },
  error: { label: 'Error', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
  expired: { label: 'Sin completar', className: 'bg-white/10 text-white/50 border-white/20' },
};

export const REFUND_LABELS: Record<string, string> = {
  voided: 'Reembolsado (anulado en Wompi)',
  manual_required: 'Reembolso en trámite',
};

export const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
