// src/hooks/useBookingUIState.js
import { useState, useCallback } from 'react';

export const useBookingUIState = (initialTicketCount = 1) => {
  const [ticketCount, setTicketCount] = useState(initialTicketCount);
  const serviceFee = 800; // Constante

  // Función para cambiar cantidad de tickets
  const handleTicketChange = useCallback((change) => {
    setTicketCount(prevCount => Math.max(1, Math.min(10, prevCount + change)));
  }, []);

  // Función para calcular precios
  const calculatePrices = useCallback((ticketPrice = 18000) => {
    const subtotal = ticketCount * ticketPrice;
    const totalServiceFees = ticketCount * serviceFee;
    const totalAmount = subtotal + totalServiceFees;

    return {
      subtotal,
      totalServiceFees,
      totalAmount,
      serviceFee
    };
  }, [ticketCount, serviceFee]);

  // Función para formatear precios
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // Función para formatear fechas
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return {
    // Estado
    ticketCount,
    serviceFee,

    // Acciones
    handleTicketChange,
    setTicketCount,

    // Utilidades
    calculatePrices,
    formatPrice,
    formatDate
  };
};