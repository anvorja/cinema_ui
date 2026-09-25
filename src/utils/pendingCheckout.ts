// src/utils/pendingCheckout.ts
//
// Pagar en Wompi saca al navegador de la app: el estado de React se pierde.
// Antes de redirigir se guarda lo que la página de resultado necesita para
// mostrar el recibo (película, sala, función, asientos). sessionStorage
// sobrevive a la ida y vuelta en la misma pestaña y no se comparte entre
// pestañas. La fuente de verdad sigue siendo el backend: esto es solo
// presentación.

const KEY = 'cinema_pending_checkout';

export type PendingCheckout =
  | {
      kind: 'tickets';
      purchaseId: number;
      reference: string;
      booking: Record<string, unknown>;
      startedAt: string;
    }
  | {
      kind: 'recharge';
      reference: string;
      amount: number;
      startedAt: string;
    };

export const savePendingCheckout = (checkout: PendingCheckout): void => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(checkout));
  } catch {
    // Sin almacenamiento (modo privado estricto): el resultado se arma solo con el backend.
  }
};

export const loadPendingCheckout = (): PendingCheckout | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
};

export const clearPendingCheckout = (): void => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nada que limpiar
  }
};
