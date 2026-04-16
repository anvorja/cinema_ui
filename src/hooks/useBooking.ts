// src/hooks/useBooking.js
import { useContext } from 'react';
import {BookingContext} from "../components/contexts/BookingContext.js";

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }

  // Alias para mantener compatibilidad
  const { updateBookingData, ...rest } = context;

  return {
    ...rest,
    updateBookingData,
    // Mantener el alias antiguo por compatibilidad
    updateBooking: updateBookingData
  };
};