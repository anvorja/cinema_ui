// src/hooks/useBookingInitialization.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from './useBooking';

export const useBookingInitialization = (movie, theater, showtime, selectedDate) => {
  const navigate = useNavigate();
  const { startBooking, bookingData, isBookingActive } = useBooking();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Si no hay datos y tampoco booking activo, redirigir
    if (!movie && !isBookingActive) {
      navigate('/cartelera');
      return;
    }

    // Solo inicializar una vez cuando hay datos nuevos
    if (movie && theater && showtime && !hasInitialized.current) {
      // Verificar si ya tenemos estos datos en el contexto
      const isDifferentBooking =
        !bookingData.movie ||
        bookingData.movie.id !== movie.id ||
        !bookingData.theater ||
        bookingData.theater.id !== theater.id ||
        !bookingData.showtime ||
        bookingData.showtime.id !== showtime.id;

      if (isDifferentBooking) {
        startBooking(movie, theater, showtime, selectedDate);
        hasInitialized.current = true;
      }
    }

    // Reset flag if movie changes
    return () => {
      if (!movie) {
        hasInitialized.current = false;
      }
    };
  }, [movie, theater, showtime, isBookingActive, navigate, startBooking, bookingData.movie, bookingData.theater, bookingData.showtime, selectedDate]);

  return {
    isInitialized: hasInitialized.current,
    bookingData,
    isBookingActive
  };
};