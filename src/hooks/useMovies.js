// src/hooks/useMovies.js
import { useState, useEffect, useCallback } from 'react';
import { movieService, getErrorMessage, searchMovies, getMovies } from '../services/api';

// Hook principal para gestionar películas con paginación
export const useMovies = (options = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Opciones por defecto
  const {
    autoFetch = true,
    initialLimit = 20,
    filters = {}
  } = options;

  // Función para obtener películas
  const fetchMovies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        skip = pagination.skip,
        limit = pagination.limit,
        replace = true,
        ...otherParams
      } = params;

      const response = await getMovies({
        skip,
        limit,
        ...filters,
        ...otherParams
      });

      // Normalizar respuesta
      const moviesData = Array.isArray(response) ? response : response.data || response;

      if (replace) {
        setMovies(moviesData);
      } else {
        setMovies(prev => [...prev, ...moviesData]);
      }

      // Actualizar paginación
      setPagination(prev => ({
        ...prev,
        skip: skip + limit,
        limit,
        total: response.total || moviesData.length,
        hasMore: moviesData.length === limit
      }));

    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.skip, pagination.limit]);

  // Cargar más películas
  const loadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      fetchMovies({
        skip: pagination.skip,
        replace: false
      });
    }
  }, [fetchMovies, loading, pagination.hasMore, pagination.skip]);

  // Refrescar películas
  const refresh = useCallback(() => {
    setPagination(prev => ({ ...prev, skip: 0 }));
    fetchMovies({ skip: 0, replace: true });
  }, [fetchMovies]);

  // Buscar películas (ACTUALIZADA para usar searchMovies del sidebar)
  const search = useCallback(async (query, searchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Usar searchMovies (función del sidebar) en lugar de movieService.search
      const response = await searchMovies(query, {
        ...filters,
        ...searchFilters,
        limit: initialLimit // Agregar limit para la búsqueda
      });

      const moviesData = Array.isArray(response) ? response : response.data || response;
      setMovies(moviesData);

      // Reset pagination para búsqueda
      setPagination({
        skip: 0,
        limit: initialLimit,
        total: moviesData.length,
        hasMore: false
      });

    } catch (err) {
      console.error('Error searching movies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, initialLimit]);

  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchMovies({ skip: 0, replace: true });
    }
  }, [autoFetch, fetchMovies]);

  return {
    // Estado
    movies,
    loading,
    error,
    pagination,

    // Acciones
    fetchMovies,
    loadMore,
    refresh,
    search,

    // Estados derivados
    isEmpty: movies.length === 0 && !loading,
    hasError: !!error,
    canLoadMore: pagination.hasMore && !loading
  };
};

// Hook para obtener una película específica
export const useMovie = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovie = useCallback(async (id = movieId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await movieService.getById(id);
      setMovie(response);
    } catch (err) {
      console.error('Error fetching movie:', err);
      setError(getErrorMessage(err));
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId, fetchMovie]);

  return {
    movie,
    loading,
    error,
    refetch: fetchMovie,
    isEmpty: !movie && !loading,
    hasError: !!error
  };
};

// Hook para disponibilidad de película
export const useMovieAvailability = (movieId) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async (id = movieId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await movieService.getAvailability(id);
      setAvailability(response);
    } catch (err) {
      console.error('Error fetching movie availability:', err);
      setError(getErrorMessage(err));
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchAvailability();
    }
  }, [movieId, fetchAvailability]);

  return {
    availability,
    loading,
    error,
    refetch: fetchAvailability,
    isEmpty: !availability && !loading,
    hasError: !!error,

    // Estados derivados útiles
    isAvailable: availability?.is_available || false,
    totalCapacity: availability?.total_capacity || 0,
    totalAvailable: availability?.total_available || 0,
    occupancyRate: availability?.occupancy_rate || 0,
    showtimes: availability?.upcoming_showtimes || {},
    purchaseInfo: availability?.purchase_availability || {}
  };
};

// Hook para próximos estrenos
export const useComingSoonMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComingSoon = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await movieService.getComingSoon();
      const moviesData = Array.isArray(response) ? response : response.data || response;
      setMovies(moviesData);
    } catch (err) {
      console.error('Error fetching coming soon movies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComingSoon();
  }, [fetchComingSoon]);

  return {
    movies,
    loading,
    error,
    refetch: fetchComingSoon,
    isEmpty: movies.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para preventas
export const usePresaleMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPresales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await movieService.getPresales();
      const moviesData = Array.isArray(response) ? response : response.data || response;
      setMovies(moviesData);
    } catch (err) {
      console.error('Error fetching presale movies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresales();
  }, [fetchPresales]);

  return {
    movies,
    loading,
    error,
    refetch: fetchPresales,
    isEmpty: movies.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para horarios de una película
export const useMovieShowtimes = (movieId, options = {}) => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    theaterId,
    startDate,
    endDate
  } = options;

  const fetchShowtimes = useCallback(async (params = {}) => {
    if (!movieId) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        theater_id: theaterId,
        start_date: startDate,
        end_date: endDate,
        ...params
      };

      const response = await movieService.getShowtimes(movieId, queryParams);
      const showtimesData = Array.isArray(response) ? response : response.data || response;
      setShowtimes(showtimesData);
    } catch (err) {
      console.error('Error fetching showtimes:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [movieId, theaterId, startDate, endDate]);

  useEffect(() => {
    if (movieId) {
      fetchShowtimes();
    }
  }, [movieId, fetchShowtimes]);

  return {
    showtimes,
    loading,
    error,
    refetch: fetchShowtimes,
    isEmpty: showtimes.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para teatros de una película
export const useMovieTheaters = (movieId) => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTheaters = useCallback(async (id = movieId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await movieService.getTheaters(id);
      const theatersData = Array.isArray(response) ? response : response.data || response;
      setTheaters(theatersData);
    } catch (err) {
      console.error('Error fetching movie theaters:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchTheaters();
    }
  }, [movieId, fetchTheaters]);

  return {
    theaters,
    loading,
    error,
    refetch: fetchTheaters,
    isEmpty: theaters.length === 0 && !loading,
    hasError: !!error
  };
};

export default useMovies;