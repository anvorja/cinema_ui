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

// Función para convertir formato del backend a display.
// El catálogo puede enviar snake_case (2d_dubbed) o SCREAMING_SNAKE_CASE
// (TWO_D_DUBBED). Normalizamos antes de comparar.
const formatDisplayName = (backendFormat) => {
  if (!backendFormat) return '2D Doblada';
  const key = backendFormat.toLowerCase().replace(/_/g, '');
  const formatMap = {
    '2ddubbed':      '2D Doblada',
    '2dsubtitled':   '2D Subtitulada',
    'twoddubbed':    '2D Doblada',
    'twodsubtitled': '2D Subtitulada',
    'twod':          '2D Doblada',
    '3ddubbed':      '3D Doblada',
    '3dsubtitled':   '3D Subtitulada',
    'threedddubbed': '3D Doblada',
    'threedsubtitled':'3D Subtitulada',
    'imax':          'IMAX',
    'imaxdubbed':    'IMAX Doblada',
    'imaxsubtitled': 'IMAX Subtitulada',
  };
  return formatMap[key] || backendFormat;
};

// Función para calcular precios según formato
const calculatePrice = (format) => {
  if (!format) return 18000;
  const key = format.toLowerCase().replace(/_/g, '');
  const priceMap = {
    '2ddubbed':      18000,
    '2dsubtitled':   18000,
    'twoddubbed':    18000,
    'twodsubtitled': 18000,
    'twod':          18000,
    '3ddubbed':      22000,
    '3dsubtitled':   22000,
    'threedddubbed': 22000,
    'threedsubtitled':22000,
    'imax':          28000,
    'imaxdubbed':    28000,
    'imaxsubtitled': 28000,
  };
  return priceMap[key] || 18000;
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