// src/providers/BookingProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { BookingContext } from '../contexts/BookingContext.js';
import bookingService from "../../services/bookingService.js";
import { paymentService } from "../../services/api";
import { savePendingCheckout } from "../../utils/pendingCheckout";
import { paymentMethodLabel } from "../../utils/payments";

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    movie: null,
    theater: null,
    showtime: null,
    selectedDate: null,
    ticketCount: 0,
    selectedSeats: [],
    totalAmount: 0,
    step: 1
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [isBookingActive, setIsBookingActive] = useState(false);

  // Guarda el historial en localStorage sin romper el flujo de compra si falla.
  // El historial se recorta a MAX_HISTORY_ITEMS porque nunca se limpiaba solo y
  // en un proyecto demo reusado muchas veces terminaba excediendo la cuota del
  // navegador (QuotaExceededError) — eso hacía que setItem() lanzara DESPUÉS de
  // que el backend ya había confirmado la compra, y el cierre de la compra lo trataba
  // como si la compra hubiera fallado por completo.
  const MAX_HISTORY_ITEMS = 30;
  const _persistHistory = useCallback((history) => {
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    try {
      localStorage.setItem('cinema_booking_history', JSON.stringify(trimmed));
    } catch (error) {
      console.error('No se pudo guardar el historial de compras localmente:', error);
    }
    return trimmed;
  }, []);

  // Cargar historial desde localStorage al inicializar
  useEffect(() => {
    const savedHistory = localStorage.getItem('cinema_booking_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setBookingHistory(history);
      } catch (error) {
        console.error('Error loading booking history:', error);
      }
    }
  }, []);

  const startBooking = useCallback((movie, theater, showtime, selectedDate) => {
    setBookingData({
      movie,
      theater,
      showtime,
      selectedDate,
      ticketCount: 1,
      selectedSeats: [],
      totalAmount: 0,
      step: 1
    });
    setIsBookingActive(true);
  }, []);

  const updateBookingData = useCallback((updates) => {
    setBookingData(prevData => ({
      ...prevData,
      ...updates
    }));
  }, []);

  const nextStep = useCallback(() => {
    setBookingData(prevData => ({
      ...prevData,
      step: prevData.step + 1
    }));
  }, []);

  const prevStep = useCallback(() => {
    setBookingData(prevData => ({
      ...prevData,
      step: Math.max(1, prevData.step - 1)
    }));
  }, []);

  const calculateTotal = useCallback((ticketCount, ticketPrice = 18000, serviceFee = 800) => {
    const subtotal = ticketCount * ticketPrice;
    const totalServiceFees = ticketCount * serviceFee;
    return subtotal + totalServiceFees;
  }, []);

  const clearBooking = useCallback(() => {
    setBookingData({
      movie: null,
      theater: null,
      showtime: null,
      selectedDate: null,
      ticketCount: 0,
      selectedSeats: [],
      totalAmount: 0,
      step: 1
    });
    setIsBookingActive(false);
  }, []);

  const _sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Motivo de cancelación del backend, o uno genérico.
  const _cancelReason = (purchase) =>
    purchase?.payment_summary?.failure_reason
    || 'La compra se canceló. Es posible que los asientos ya no estén disponibles.';

  // Espera a que la compra pase a CONFIRMED (con sus tickets) sondeando
  // GET /purchases/{id}. Se usa al volver de Wompi con el pago aprobado: la
  // saga (payment.success → booking confirma y materializa tickets) tarda
  // unos segundos en local y más en Render (ver HALLAZGOS.md).
  const _pollUntilConfirmed = useCallback(async (purchaseId, { intervalMs = 3000, timeoutMs = 180000 } = {}) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const result = await bookingService.getBookingDetails(purchaseId);
      if (result.success) {
        const { status, tickets } = result.data;
        if (status === 'confirmed' && tickets?.length > 0) return result.data;
        if (status === 'cancelled') throw new Error(_cancelReason(result.data));
      }
      await _sleep(intervalMs);
    }
    throw new Error('El pago se aprobó pero la confirmación está tardando. Revisa "Mis compras" en unos minutos.');
  }, []);

  // Crea la compra (sin datos de pago), espera a que el inventario reserve
  // los asientos y a que payment-service prepare el cobro, y devuelve la URL
  // del Web Checkout de Wompi. Deja guardado el resumen para el recibo.
  //
  // timeoutMs por encima de INVENTORY_DECISION_TIMEOUT_SECONDS (120s en
  // booking-service): si el backend cancela por inventario, el próximo poll
  // alcanza a leer el motivo real.
  const startCheckout = useCallback(async ({ onStage = (_stage) => {}, timeoutMs = 150000, intervalMs = 2000 } = {}) => {
    onStage('reserving');
    const bookingResponse = await bookingService.createBooking({
      movie: bookingData.movie,
      theater: bookingData.theater,
      showtime: bookingData.showtime,
      selectedDate: bookingData.selectedDate,
      ticketCount: bookingData.ticketCount,
      selectedSeats: bookingData.selectedSeats || [],
    });
    if (!bookingResponse.success) throw new Error(bookingResponse.message);
    const purchaseId = bookingResponse.data.id;

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await _sleep(intervalMs);
      const result = await bookingService.getBookingDetails(purchaseId);
      if (!result.success) continue;
      const purchase = result.data;
      if (purchase.status === 'cancelled') throw new Error(_cancelReason(purchase));
      if (purchase.payment_summary?.status !== 'awaiting_payment_result') continue;

      onStage('preparing');
      try {
        const payment = await paymentService.getOrderCheckout(purchaseId);
        if (payment.checkout_url) {
          savePendingCheckout({
            kind: 'tickets',
            purchaseId,
            reference: payment.reference,
            startedAt: new Date().toISOString(),
            booking: {
              movie: bookingData.movie,
              theater: bookingData.theater,
              showtime: bookingData.showtime,
              selectedDate: bookingData.selectedDate,
              ticketCount: bookingData.ticketCount,
              totalAmount: payment.amount,
            },
          });
          onStage('redirecting');
          return payment.checkout_url;
        }
        if (payment.status !== 'pending') {
          throw new Error('Este cobro ya no se puede pagar. Vuelve a elegir tus asientos.');
        }
      } catch (error) {
        // 404: payment-service aún no creó el cobro — seguir esperando.
        if (error?.response?.status !== 404) throw error;
      }
    }
    throw new Error('No pudimos preparar el pago a tiempo. Revisa "Mis compras" o intenta de nuevo.');
  }, [bookingData]);

  // Al volver de Wompi con el pago aprobado: espera los tickets reales y arma
  // la reserva completa para el recibo con QR.
  const finishBooking = useCallback(async (purchaseId, snapshot = {}, reference = null) => {
    const confirmedPurchase = await _pollUntilConfirmed(purchaseId);
    const ticketCodes = confirmedPurchase.tickets.map(t => t.ticket_code);
    const summary = confirmedPurchase.payment_summary || {};
    const completedBooking = {
      id: purchaseId,
      // Sin el resumen guardado (otra pestaña, almacenamiento borrado) el
      // recibo se arma con lo que devuelve el backend.
      movie: { title: confirmedPurchase.movie_title },
      theater: { name: '' },
      showtime: { time: confirmedPurchase.show_time, format: '' },
      selectedDate: confirmedPurchase.show_date,
      ticketCount: confirmedPurchase.quantity,
      ...snapshot,
      totalAmount: confirmedPurchase.total_amount,
      transactionId: reference || summary.payment_reference,
      paymentMethod: {
        icon: summary.payment_method_type === 'CARD' ? '💳' : '🏦',
        name: `Wompi · ${paymentMethodLabel(summary.payment_method_type, summary.last_four)}`,
      },
      bookingDate: new Date(),
      status: 'confirmed',
      seats: confirmedPurchase.tickets.map(t => t.seat_number),
      bookingNumber: `BK-${purchaseId}`,
      // ticket_codes reales del backend (CINE-XXXXXXX) — usados para generar QR
      ticket_codes: ticketCodes,
      qrCode: ticketCodes[0],
    };
    // La compra ya está confirmada en el backend: si guardar el historial
    // local falla, no debe tumbar nada.
    setBookingHistory(prev => _persistHistory([completedBooking, ...prev]));
    clearBooking();
    return completedBooking;
  }, [_pollUntilConfirmed, _persistHistory, clearBooking]);

  const getBookingsByStatus = useCallback((status) => {
    return bookingHistory.filter(booking => booking.status === status);
  }, [bookingHistory]);

  const cancelBooking = useCallback((transactionId) => {
    setBookingHistory(prev => _persistHistory(prev.map(booking =>
      booking.transactionId === transactionId
        ? { ...booking, status: 'cancelled', cancelledDate: new Date() }
        : booking
    )));
  }, [_persistHistory]);

  const value = {
    // Estados
    bookingData,
    bookingHistory,
    isBookingActive,

    // Funciones principales
    startBooking,
    updateBookingData,
    startCheckout,
    finishBooking,
    clearBooking,

    // Navegación de pasos
    nextStep,
    prevStep,

    // Utilidades
    calculateTotal,
    getBookingsByStatus,
    cancelBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};