// src/pages/PaymentResultPage.tsx
//
// Wompi devuelve aquí: /pago/resultado?id=<transacción>&env=test.
// 1. Verifica la transacción con payment-service (que consulta Wompi y, si
//    son boletas, publica payment.success/failed a la saga).
// 2. Boletas aprobadas: espera a que booking confirme y muestra el recibo con
//    los QR (PaymentSuccessPage). Recarga aprobada: muestra el comprobante.
// 3. Mientras siga pendiente (p. ej. PSE), vuelve a preguntar.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { PremiumButton } from '../components/common';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { LoginModal } from '../components/auth/LoginModal';
import useAuth from '../hooks/useAuth.js';
import { useBooking } from '../hooks/useBooking';
import { paymentService } from '../services/api';
import { clearPendingCheckout, loadPendingCheckout } from '../utils/pendingCheckout';
import { formatCOP, paymentMethodLabel } from '../utils/payments';

type Phase =
  | { kind: 'verifying' }
  | { kind: 'pending'; payment: Payment }
  | { kind: 'confirming'; payment: Payment }
  | { kind: 'recharged'; payment: Payment }
  | { kind: 'failed'; payment: Payment }
  | { kind: 'error'; message: string };

interface Payment {
  reference: string;
  kind: 'tickets' | 'recharge';
  order_id: number | null;
  amount: number;
  status: string;
  payment_method_type: string | null;
  last_four: string | null;
}

const POLL_MS = 3000;
const PENDING_TIMEOUT_MS = 3 * 60 * 1000;

const FAILURE_COPY: Record<string, { title: string; message: string }> = {
  declined: { title: 'Pago rechazado', message: 'Tu banco o Wompi no aprobaron el pago. No se cobró nada.' },
  voided: { title: 'Pago anulado', message: 'El pago fue anulado. Si ves un cargo, se reversará.' },
  error: { title: 'No se pudo completar el pago', message: 'Wompi reportó un error. No se cobró nada.' },
  expired: { title: 'El enlace de pago venció', message: 'No completaste el pago a tiempo. No se cobró nada.' },
};

const PaymentResultPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = params.get('id');
  const { isAuthenticated, isLoading } = useAuth();
  const { finishBooking } = useBooking();
  const [phase, setPhase] = useState<Phase>({ kind: 'verifying' });

  useEffect(() => {
    // verify es idempotente: si el efecto corre dos veces (StrictMode) no pasa nada.
    if (!transactionId || isLoading || !isAuthenticated) return;
    let cancelled = false;

    const run = async () => {
      const deadline = Date.now() + PENDING_TIMEOUT_MS;
      let payment: Payment;
      while (true) {
        try {
          payment = await paymentService.verify(transactionId);
        } catch (error) {
          const status = error?.response?.status;
          if (cancelled) return;
          setPhase({
            kind: 'error',
            message:
              status === 404
                ? 'No encontramos ese pago en tu cuenta. Revisa que hayas iniciado sesión con la misma cuenta con la que pagaste.'
                : 'No pudimos consultar el pago en este momento. Revisa tu historial de pagos en unos minutos.',
          });
          return;
        }
        if (cancelled) return;
        if (payment.status !== 'pending' || Date.now() > deadline) break;
        setPhase({ kind: 'pending', payment });
        await new Promise(r => setTimeout(r, POLL_MS));
      }

      if (payment.status === 'pending') {
        setPhase({ kind: 'pending', payment });
        return;
      }
      if (payment.status !== 'approved') {
        clearPendingCheckout();
        setPhase({ kind: 'failed', payment });
        return;
      }
      if (payment.kind === 'recharge') {
        clearPendingCheckout();
        setPhase({ kind: 'recharged', payment });
        return;
      }

      setPhase({ kind: 'confirming', payment });
      const pending = loadPendingCheckout();
      const snapshot =
        pending?.kind === 'tickets' && pending.purchaseId === payment.order_id ? pending.booking : {};
      try {
        const booking = await finishBooking(payment.order_id, snapshot, payment.reference);
        clearPendingCheckout();
        if (!cancelled) {
          navigate('/payment-success', {
            replace: true,
            state: { booking, transactionId: payment.reference, success: true },
          });
        }
      } catch (error) {
        if (!cancelled) setPhase({ kind: 'error', message: error.message });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [transactionId, isAuthenticated, isLoading, finishBooking, navigate]);

  const shell = (children) => (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center" aria-live="polite">
        <div className="b-stub p-8" style={{ ['--stub-cut' as any]: '50%' }}>{children}</div>
      </div>
    </div>
  );

  const reference = (payment: Payment) => (
    <p className="mt-4 text-[#8f8b80] text-xs break-all">
      Referencia: <span className="font-mono">{payment.reference}</span>
    </p>
  );

  if (!transactionId) {
    return shell(
      <>
        <ExclamationTriangleIcon className="w-16 h-16 text-[#f2b705] mx-auto mb-4" />
        <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">No hay pago para mostrar</h1>
        <p className="text-[#c3bfb2] mb-6">Esta página se abre sola al volver de Wompi.</p>
        <PremiumButton onClick={() => navigate('/')}>Ir a la cartelera</PremiumButton>
      </>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <>
        {shell(
          <>
            <ClockIcon className="w-16 h-16 text-[#f2b705] mx-auto mb-4" />
            <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">Inicia sesión para ver tu pago</h1>
            <p className="text-[#c3bfb2]">Usa la misma cuenta con la que pagaste.</p>
          </>
        )}
        <LoginModal isOpen onClose={() => navigate('/')} onSwitchToRegister={() => {}} />
      </>
    );
  }

  switch (phase.kind) {
    case 'verifying':
    case 'confirming':
      return shell(
        <>
          <div className="mb-6 flex justify-center"><LoadingSpinner size="xl" /></div>
          <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">
            {phase.kind === 'verifying' ? 'Confirmando tu pago con Wompi' : '¡Pago aprobado! Generando tus boletas'}
          </h1>
          <p className="text-[#8f8b80] text-sm">No cierres esta ventana.</p>
        </>
      );
    case 'pending':
      return shell(
        <>
          <ClockIcon className="w-16 h-16 text-[#f2b705] mx-auto mb-4" />
          <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">Tu pago está en proceso</h1>
          <p className="text-[#c3bfb2]">
            Algunos medios (como PSE) tardan unos minutos. Te avisaremos por correo cuando se confirme; también puedes
            revisarlo en tu historial de pagos.
          </p>
          {reference(phase.payment)}
          <div className="mt-6 flex justify-center">
            <Link to="/profile/payments" className="text-[#f2b705] hover:text-[#f4f1e8] underline">Ver mis pagos</Link>
          </div>
        </>
      );
    case 'recharged':
      return shell(
        <>
          <CheckCircleIcon className="w-16 h-16 text-[#7bd88f] mx-auto mb-4" />
          <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">¡Recarga exitosa!</h1>
          <p className="text-[#c3bfb2] mb-1">Tu tarjeta Cinema+ se recargó con</p>
          <p className="text-3xl font-bold text-[#7bd88f] mb-2">{formatCOP(phase.payment.amount)}</p>
          <p className="text-[#8f8b80] text-sm">
            {paymentMethodLabel(phase.payment.payment_method_type, phase.payment.last_four)}
          </p>
          {reference(phase.payment)}
          <div className="mt-6 flex flex-col gap-3">
            <PremiumButton onClick={() => navigate('/')}>Ir a la cartelera</PremiumButton>
            <Link to="/profile/payments" className="text-[#f2b705] hover:text-[#f4f1e8] underline text-sm">Ver mis pagos</Link>
          </div>
        </>
      );
    case 'failed': {
      const copy = FAILURE_COPY[phase.payment.status] || FAILURE_COPY.error;
      const retryTo = phase.payment.kind === 'recharge' ? '/recharge' : '/';
      return shell(
        <>
          <XCircleIcon className="w-16 h-16 text-[#f0644d] mx-auto mb-4" />
          <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">{copy.title}</h1>
          <p className="text-[#c3bfb2]">{copy.message}</p>
          {phase.payment.kind === 'tickets' && (
            <p className="text-[#8f8b80] text-sm mt-2">Tus asientos se liberaron. Puedes elegirlos de nuevo.</p>
          )}
          {reference(phase.payment)}
          <div className="mt-6">
            <PremiumButton onClick={() => navigate(retryTo)}>Intentar de nuevo</PremiumButton>
          </div>
        </>
      );
    }
    case 'error':
      return shell(
        <>
          <ExclamationTriangleIcon className="w-16 h-16 text-[#f2b705] mx-auto mb-4" />
          <h1 className="font-board text-3xl font-bold tracking-wide uppercase mb-2">Algo no salió como esperábamos</h1>
          <p className="text-[#c3bfb2]">{phase.message}</p>
          <div className="mt-6 flex flex-col gap-3">
            <PremiumButton onClick={() => navigate('/profile/payments')}>Ver mis pagos</PremiumButton>
            <Link to="/profile/purchases" className="text-[#f2b705] hover:text-[#f4f1e8] underline text-sm">Mis compras</Link>
          </div>
        </>
      );
  }
};

export default PaymentResultPage;
