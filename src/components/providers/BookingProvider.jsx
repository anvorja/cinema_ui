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
    totalAmount: 0,
    step: 1
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [isBookingActive, setIsBookingActive] = useState(false);

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
      totalAmount: 0,
      step: 1
    });
    setIsBookingActive(false);
  }, []);

  // Espera a que la compra pase a CONFIRMED sondeando GET /purchases/{id}
  const _pollUntilConfirmed = useCallback(async (purchaseId, { intervalMs = 2000, timeoutMs = 45000 } = {}) => {
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
  const completeBooking = useCallback(async (transactionId) => {
    try {
      console.log('📝 Iniciando proceso de reserva...');
      console.log('📊 Datos de booking:', bookingData);

      // Paso 1: Crear la compra usando el endpoint correcto /purchases
      const purchasePayload = {
        movie: bookingData.movie,
        theater: bookingData.theater,
        showtime: bookingData.showtime,
        selectedDate: bookingData.selectedDate,
        ticketCount: bookingData.ticketCount,
        selectedSeats: bookingData.selectedSeats || [],
        totalAmount: bookingData.totalAmount,
        paymentMethod: bookingData.paymentMethod,
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

      // Paso 4: Actualizar historial local
      const newHistory = [completedBooking, ...bookingHistory];
      setBookingHistory(newHistory);
      localStorage.setItem('cinema_booking_history', JSON.stringify(newHistory));

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

      const newHistory = [fallbackBooking, ...bookingHistory];
      setBookingHistory(newHistory);
      localStorage.setItem('cinema_booking_history', JSON.stringify(newHistory));

      clearBooking();

      // Re-lanzar el error para que el componente lo maneje
      throw error;
    }
  }, [bookingData, bookingHistory, clearBooking, generateSeatNumbers, user, _pollUntilConfirmed]);

  const getBookingsByStatus = useCallback((status) => {
    return bookingHistory.filter(booking => booking.status === status);
  }, [bookingHistory]);

  const cancelBooking = useCallback((transactionId) => {
    const updatedHistory = bookingHistory.map(booking =>
      booking.transactionId === transactionId
        ? { ...booking, status: 'cancelled', cancelledDate: new Date() }
        : booking
    );

    setBookingHistory(updatedHistory);
    localStorage.setItem('cinema_booking_history', JSON.stringify(updatedHistory));
  }, [bookingHistory]);

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