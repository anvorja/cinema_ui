// src/providers/BookingProvider.jsx
import { useState, useEffect, useCallback } from 'react';
import { BookingContext } from '../contexts/BookingContext.js';

export const BookingProvider = ({ children }) => {
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

  // Función para inicializar una nueva reserva
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

  // Función para actualizar datos de reserva - SOLO para datos críticos
  const updateBookingData = useCallback((updates) => {
    setBookingData(prevData => ({
      ...prevData,
      ...updates
    }));
  }, []);

  // Función para avanzar al siguiente paso
  const nextStep = useCallback(() => {
    setBookingData(prevData => ({
      ...prevData,
      step: prevData.step + 1
    }));
  }, []);

  // Función para retroceder un paso
  const prevStep = useCallback(() => {
    setBookingData(prevData => ({
      ...prevData,
      step: Math.max(1, prevData.step - 1)
    }));
  }, []);

  // Función para calcular el total
  const calculateTotal = useCallback((ticketCount, ticketPrice = 18000, serviceFee = 800) => {
    const subtotal = ticketCount * ticketPrice;
    const totalServiceFees = ticketCount * serviceFee;
    return subtotal + totalServiceFees;
  }, []);

  // Función para completar reserva
  const completeBooking = useCallback((transactionId) => {
    const completedBooking = {
      ...bookingData,
      transactionId,
      bookingDate: new Date(),
      status: 'confirmed',
      seats: generateSeatNumbers(bookingData.ticketCount)
    };

    const newHistory = [completedBooking, ...bookingHistory];
    setBookingHistory(newHistory);

    localStorage.setItem('cinema_booking_history', JSON.stringify(newHistory));
    clearBooking();

    return completedBooking;
  }, [bookingData, bookingHistory]);

  // Función para limpiar reserva actual
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

  // Función para obtener reservas por estado
  const getBookingsByStatus = useCallback((status) => {
    return bookingHistory.filter(booking => booking.status === status);
  }, [bookingHistory]);

  // Función para generar números de asientos simulados
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

  // Función para cancelar una reserva
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
    updateBookingData, // Renombrada para evitar confusión
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