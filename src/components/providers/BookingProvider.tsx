// src/providers/BookingProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { BookingContext } from '../contexts/BookingContext.js';
import useAuth from "../../hooks/useAuth.js";
import bookingService from "../../services/bookingService.js";

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    movie: null,
    theater: null,
    showtime: null,
    selectedDate: null,
    ticketCount: 0,
    selectedSeats: [],
    paymentMethod: null,
    pseData: null,
    cardData: null,
    totalAmount: 0,
    step: 1
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [isBookingActive, setIsBookingActive] = useState(false);

  // Guarda el historial en localStorage sin romper el flujo de compra si falla.
  // El historial se recorta a MAX_HISTORY_ITEMS porque nunca se limpiaba solo y
  // en un proyecto demo reusado muchas veces terminaba excediendo la cuota del
  // navegador (QuotaExceededError) — eso hacía que setItem() lanzara DESPUÉS de
  // que el backend ya había confirmado la compra, y completeBooking lo trataba
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
      paymentMethod: null,
      pseData: null,
      cardData: null,
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

  const generateSeatNumbers = useCallback((count) => {
    const rows = ['J', 'K', 'L', 'M', 'N'];
    const seats = [];
    const startSeat = Math.floor(Math.random() * 15) + 1;

    for (let i = 0; i < count; i++) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      seats.push(`${row}${startSeat + i}`);
    }

    return seats.join(', ');
  }, []);

  const clearBooking = useCallback(() => {
    setBookingData({
      movie: null,
      theater: null,
      showtime: null,
      selectedDate: null,
      ticketCount: 0,
      selectedSeats: [],
      paymentMethod: null,
      pseData: null,
      cardData: null,
      totalAmount: 0,
      step: 1
    });
    setIsBookingActive(false);
  }, []);

  // Espera a que la compra pase a CONFIRMED sondeando GET /purchases/{id}.
  // timeoutMs a propósito por encima de INVENTORY_DECISION_TIMEOUT_SECONDS
  // (120s, ver booking-service-cinema/app/core/config.py): así, si el
  // backend cancela por timeout de inventario, el próximo poll alcanza a
  // leer el estado real (cancelled + motivo) en vez de que el frontend se
  // rinda primero con el mensaje genérico. 45s medía la latencia de saga en
  // local (todo en localhost); en producción (Confluent Cloud + Render free
  // tier) se midieron confirmaciones reales de 122-142s — ver HALLAZGOS.md.
  const _pollUntilConfirmed = useCallback(async (purchaseId, { intervalMs = 3000, timeoutMs = 180000 } = {}) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, intervalMs));
      const result = await bookingService.getBookingDetails(purchaseId);
      if (!result.success) continue;
      const { status, tickets, payment_summary } = result.data;
      if (status === 'confirmed' && tickets?.length > 0) return result.data;
      if (status === 'cancelled') {
        const reason = payment_summary?.failure_reason
          || 'Uno o más asientos seleccionados ya fueron adquiridos por otro usuario. Por favor elige otras sillas.';
        throw new Error(reason);
      }
    }
    throw new Error('El pago tardó demasiado en confirmarse. Revisa "Mis Compras" para ver el estado.');
  }, []);

  // 🔥 FUNCIÓN CRÍTICA CORREGIDA - USA /purchases
  //
  // paymentOverride (opcional): { paymentMethod, pseData, cardData }. PaymentPage
  // lo pasa directo desde su propio estado local en vez de depender de que
  // updateBooking() (setState de contexto, asíncrono) ya se haya reflejado en
  // bookingData para cuando esta función lee sus datos — de lo contrario esta
  // función corre con el closure de bookingData de ANTES de esa actualización
  // (React no re-renderiza entre updateBooking() y esta llamada, ambas
  // síncronas en el mismo handler). Ese desfase + que purchasePayload nunca
  // reenviaba pseData/cardData hacía que toda compra se mandara como tarjeta
  // (con un número de relleno hardcodeado en bookingService.ts) sin importar
  // el método elegido en la UI.
  const completeBooking = useCallback(async (transactionId, paymentOverride = null) => {
    try {
      console.log('📝 Iniciando proceso de reserva...');
      console.log('📊 Datos de booking:', bookingData);

      const paymentMethod = paymentOverride?.paymentMethod ?? bookingData.paymentMethod;
      const pseData = paymentOverride?.pseData ?? bookingData.pseData;
      const cardData = paymentOverride?.cardData ?? bookingData.cardData;

      // Paso 1: Crear la compra usando el endpoint correcto /purchases
      const purchasePayload = {
        movie: bookingData.movie,
        theater: bookingData.theater,
        showtime: bookingData.showtime,
        selectedDate: bookingData.selectedDate,
        ticketCount: bookingData.ticketCount,
        selectedSeats: bookingData.selectedSeats || [],
        totalAmount: bookingData.totalAmount,
        paymentMethod,
        pseData,
        cardData,
        // Datos del usuario
        userEmail: user?.email,
        userPhone: user?.phone,
        userName: user ? `${user.first_name} ${user.last_name}` : null
      };

      console.log('🚀 Enviando a /purchases:', purchasePayload);

      const bookingResponse = await bookingService.createBooking(purchasePayload);

      if (!bookingResponse.success) {
        console.error('❌ Error en createBooking:', bookingResponse.message);
        throw new Error(bookingResponse.message);
      }

      console.log('✅ Compra creada (PENDING):', bookingResponse.data);
      const purchaseId = bookingResponse.data.id;

      // Paso 2: Esperar a que el saga de Kafka confirme la compra y genere los tickets reales
      console.log('⏳ Esperando confirmación del pago via saga...');
      const confirmedPurchase = await _pollUntilConfirmed(purchaseId);
      console.log('✅ Compra confirmada:', confirmedPurchase);

      // Paso 3: Construir objeto de reserva completa con datos reales del backend
      const ticketCodes = confirmedPurchase.tickets.map(t => t.ticket_code);
      const backendSeats = confirmedPurchase.tickets.map(t => t.seat_number);
      const completedBooking = {
        id: purchaseId,
        ...bookingData,
        totalAmount: confirmedPurchase.total_amount ?? bookingData.totalAmount,
        transactionId: confirmedPurchase.payment_summary?.transaction_id || transactionId,
        bookingDate: new Date(),
        status: 'confirmed',
        seats: backendSeats,
        bookingNumber: `BK-${purchaseId}`,
        // ticket_codes reales del backend (CINE-XXXXXXX) — usados para generar QR
        ticket_codes: ticketCodes,
        qrCode: ticketCodes[0],
      };

      // Paso 4: Actualizar historial local (la compra ya está confirmada en el
      // backend en este punto — si esto falla, no debe tumbar la compra)
      setBookingHistory(prev => _persistHistory([completedBooking, ...prev]));

      // Paso 5: Limpiar datos de reserva actual
      clearBooking();

      console.log('🎉 Reserva completada exitosamente:', completedBooking);
      return completedBooking;

    } catch (error) {
      console.error('💥 Error completando reserva:', error);

      // Fallback: Guardar localmente si el backend falla
      const fallbackBooking = {
        ...bookingData,
        transactionId: transactionId || `FALLBACK-${Date.now()}`,
        bookingDate: new Date(),
        status: 'pending_sync',
        seats: generateSeatNumbers(bookingData.ticketCount),
        error: error.message,
        bookingNumber: `BK-OFFLINE-${Date.now()}`
      };

      setBookingHistory(prev => _persistHistory([fallbackBooking, ...prev]));

      clearBooking();

      // Re-lanzar el error para que el componente lo maneje
      throw error;
    }
  }, [bookingData, clearBooking, generateSeatNumbers, user, _pollUntilConfirmed, _persistHistory]);

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
    completeBooking,
    clearBooking,

    // Navegación de pasos
    nextStep,
    prevStep,

    // Utilidades
    calculateTotal,
    getBookingsByStatus,
    cancelBooking,
    generateSeatNumbers
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};