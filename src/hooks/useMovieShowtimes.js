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

        if (response.success) {
          // Verificar si hay datos válidos
          if (response.data) {
            // Tu backend probablemente devuelve datos en formato diferente
            // Vamos a inspeccionar y transformar
            console.log('Backend showtimes data:', response.data);

            let transformedShowtimes;

            // Si es un array, usar transformación normal
            if (Array.isArray(response.data)) {
              transformedShowtimes = transformBackendShowtimes(response.data);
            }
            // Si es un objeto con showtimes agrupados, usar directamente
            else if (typeof response.data === 'object') {
              transformedShowtimes = response.data;
            }
            // Si no se puede determinar el formato, usar mock
            else {
              console.warn('Unknown data format, using mock data');
              transformedShowtimes = getMockShowtimes();
            }

            setShowtimes(transformedShowtimes);
          } else {
            console.warn('No showtimes data received, using mock data');
            const mockData = getMockShowtimes();
            setShowtimes(mockData);
          }
        } else {
          // Fallback a datos mock si el backend falla
          console.warn('Backend unavailable, using mock data:', response.message);
          const mockData = getMockShowtimes();
          setShowtimes(mockData);
        }

      } catch (err) {
        console.error('Error fetching showtimes:', err);
        setError(err.message);

        // Fallback a datos mock en caso de error
        const mockData = getMockShowtimes();
        setShowtimes(mockData);
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

// Función para transformar datos del backend al formato del frontend
const transformBackendShowtimes = (backendData) => {
  const transformed = {};

  // Verificar que backendData sea un array válido
  if (!backendData || !Array.isArray(backendData)) {
    console.warn('Invalid backend data structure:', backendData);
    return transformed;
  }

  // Agrupar horarios por teatro (ya que tu backend devuelve lista plana)
  const theaterGroups = {};

  backendData.forEach(showtime => {
    const theaterName = showtime.theater_name;

    if (!theaterGroups[theaterName]) {
      theaterGroups[theaterName] = [];
    }

    // Transformar formato individual
    theaterGroups[theaterName].push({
      id: showtime.id,
      time: showtime.show_time,
      format: formatDisplayName(showtime.format), // Convertir "2d_dubbed" a "2D Doblada"
      available: showtime.available_tickets > 0,
      price: calculatePrice(showtime.format), // Calcular precio según formato
      availableSeats: showtime.available_tickets,
      capacity: showtime.capacity,
      date: showtime.show_date
    });
  });

  // Convertir a formato esperado por el frontend (usar índices numéricos)
  let theaterIndex = 1;
  Object.keys(theaterGroups).forEach(theaterName => {
    transformed[theaterIndex] = {
      date: backendData[0]?.show_date || new Date().toISOString().split('T')[0],
      theaterName: theaterName, // Agregar nombre del teatro
      times: theaterGroups[theaterName]
    };
    theaterIndex++;
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