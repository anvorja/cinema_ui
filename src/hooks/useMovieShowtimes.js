// src/hooks/useMovieShowtimes.js
import { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';

export const useMovieShowtimes = (movieId) => {
  const [showtimes, setShowtimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await bookingService.getShowtimes(movieId);

        if (response.success && Array.isArray(response.data)) {
          setShowtimes(transformBackendShowtimes(response.data));
        } else {
          console.warn('No showtimes data from backend:', response.message);
          setShowtimes({});
        }

      } catch (err) {
        console.error('Error fetching showtimes:', err);
        setError(err.message);
        setShowtimes({});
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  // Funciones utilitarias
  const getShowtimeById = (theaterId, showtimeId) => {
    const theaterShowtimes = showtimes[theaterId];
    if (!theaterShowtimes) return null;

    return theaterShowtimes.times.find(time => time.id === parseInt(showtimeId));
  };

  const getAvailableShowtimes = (theaterId) => {
    const theaterShowtimes = showtimes[theaterId];
    if (!theaterShowtimes) return [];

    return theaterShowtimes.times.filter(time => time.available);
  };

  const getTotalAvailableSeats = (theaterId) => {
    const availableShowtimes = getAvailableShowtimes(theaterId);
    return availableShowtimes.reduce((total, showtime) => {
      return total + showtime.availableSeats;
    }, 0);
  };

  return {
    showtimes,
    loading,
    error,
    getShowtimeById,
    getAvailableShowtimes,
    getTotalAvailableSeats
  };
};

// Función para transformar datos del backend al formato del frontend.
// Agrupa por theater_id (campo real del backend) para que TheatersWithShowtimes
// pueda hacer showtimes[theater.id] correctamente.
const transformBackendShowtimes = (backendData) => {
  const transformed = {};

  if (!backendData || !Array.isArray(backendData)) return transformed;

  backendData.forEach(showtime => {
    const tid = showtime.theater_id;
    if (!tid) return;

    if (!transformed[tid]) {
      transformed[tid] = {
        date: showtime.show_date,
        theaterName: showtime.theater_name,
        times: [],
      };
    }

    transformed[tid].times.push({
      id: showtime.id,
      time: showtime.show_time,
      format: formatDisplayName(showtime.format),
      available: showtime.available_tickets > 0,
      price: calculatePrice(showtime.format),
      availableSeats: showtime.available_tickets,
      capacity: showtime.capacity,
      date: showtime.show_date,
    });
  });

  return transformed;
};

// Función para convertir formato del backend a display
const formatDisplayName = (backendFormat) => {
  const formatMap = {
    '2d_dubbed': '2D Doblada',
    '2d_subtitled': '2D Subtitulada',
    '3d_dubbed': '3D Doblada',
    '3d_subtitled': '3D Subtitulada',
    'imax': 'IMAX',
    'imax_dubbed': 'IMAX Doblada',
    'imax_subtitled': 'IMAX Subtitulada'
  };

  return formatMap[backendFormat] || backendFormat;
};

// Función para calcular precios según formato
const calculatePrice = (format) => {
  const priceMap = {
    '2d_dubbed': 18000,
    '2d_subtitled': 18000,
    '3d_dubbed': 22000,
    '3d_subtitled': 22000,
    'imax': 28000,
    'imax_dubbed': 28000,
    'imax_subtitled': 28000
  };

  return priceMap[format] || 18000;
};

// Función de fallback con datos mock
const getMockShowtimes = () => {
  return {
    1: {
      date: new Date().toISOString().split('T')[0],
      times: [
        {
          id: 1,
          time: "14:30",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 45
        },
        {
          id: 2,
          time: "17:00",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 23
        },
        {
          id: 3,
          time: "19:30",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 67
        },
        {
          id: 4,
          time: "22:00",
          format: "2D Subtitulada",
          available: false,
          price: 18000,
          availableSeats: 0
        }
      ]
    },
    2: {
      date: new Date().toISOString().split('T')[0],
      times: [
        {
          id: 5,
          time: "15:00",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 34
        },
        {
          id: 6,
          time: "18:00",
          format: "3D Doblada",
          available: true,
          price: 22000,
          availableSeats: 12
        },
        {
          id: 7,
          time: "20:45",
          format: "2D Subtitulada",
          available: true,
          price: 18000,
          availableSeats: 56
        }
      ]
    },
    3: {
      date: new Date().toISOString().split('T')[0],
      times: [
        {
          id: 8,
          time: "13:45",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 78
        },
        {
          id: 9,
          time: "16:30",
          format: "IMAX",
          available: true,
          price: 28000,
          availableSeats: 15
        },
        {
          id: 10,
          time: "21:15",
          format: "2D Doblada",
          available: true,
          price: 18000,
          availableSeats: 89
        }
      ]
    }
  };
};