// src/hooks/useMovieShowtimes.js
import { useState, useEffect } from 'react';

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
        // Simular datos de horarios hasta que tengas la API real
        const mockShowtimes = {
          1: { // Theater ID 1 (Chipichape)
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
          2: { // Theater ID 2 (Cosmocentro)
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
          3: { // Theater ID 3 (Palmetto)
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
          },
          4: { // Theater ID 4 (Río Cauca)
            date: new Date().toISOString().split('T')[0],
            times: [
              {
                id: 11,
                time: "14:00",
                format: "2D Doblada",
                available: true,
                price: 18000,
                availableSeats: 42
              },
              {
                id: 12,
                time: "19:00",
                format: "2D Subtitulada",
                available: true,
                price: 18000,
                availableSeats: 28
              }
            ]
          },
          5: { // Theater ID 5 (Unicali)
            date: new Date().toISOString().split('T')[0],
            times: [
              {
                id: 13,
                time: "15:30",
                format: "2D Doblada",
                available: true,
                price: 18000,
                availableSeats: 51
              },
              {
                id: 14,
                time: "18:30",
                format: "2D Doblada",
                available: false,
                price: 18000,
                availableSeats: 0
              },
              {
                id: 15,
                time: "21:30",
                format: "2D Subtitulada",
                available: true,
                price: 18000,
                availableSeats: 37
              }
            ]
          }
        };

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));
        setShowtimes(mockShowtimes);

        // En el futuro, reemplazar con:
        // const response = await showtimeService.getByMovieId(movieId);
        // setShowtimes(response.data);

      } catch (err) {
        console.error('Error fetching showtimes:', err);
        setError(err.message);
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