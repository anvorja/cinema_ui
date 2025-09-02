// src/hooks/useTheaters.js - SOLO LÓGICA, NO JSX
import { useState, useEffect, useCallback } from 'react';
import { theaterService, getErrorMessage } from '../services/api';

// Hook para gestionar todos los teatros
export const useTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTheaters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await theaterService.getAll();
      const theatersData = Array.isArray(response) ? response : response.data || response;
      setTheaters(theatersData);
    } catch (err) {
      console.error('Error fetching theaters:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheaters();
  }, [fetchTheaters]);

  return {
    theaters,
    loading,
    error,
    refetch: fetchTheaters,
    isEmpty: theaters.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para un teatro específico
export const useTheater = (theaterId) => {
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTheater = useCallback(async (id = theaterId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await theaterService.getById(id);
      setTheater(response);
    } catch (err) {
      console.error('Error fetching theater:', err);
      setError(getErrorMessage(err));
      setTheater(null);
    } finally {
      setLoading(false);
    }
  }, [theaterId]);

  useEffect(() => {
    if (theaterId) {
      fetchTheater();
    }
  }, [theaterId, fetchTheater]);

  return {
    theater,
    loading,
    error,
    refetch: fetchTheater,
    isEmpty: !theater && !loading,
    hasError: !!error
  };
};

// Hook para películas de un teatro
export const useTheaterMovies = (theaterId) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async (id = theaterId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await theaterService.getMovies(id);
      const moviesData = Array.isArray(response) ? response : response.data || response;
      setMovies(moviesData);
    } catch (err) {
      console.error('Error fetching theater movies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [theaterId]);

  useEffect(() => {
    if (theaterId) {
      fetchMovies();
    }
  }, [theaterId, fetchMovies]);

  return {
    movies,
    loading,
    error,
    refetch: fetchMovies,
    isEmpty: movies.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para programación de un teatro
export const useTheaterSchedule = (theaterId, date) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async (id = theaterId, scheduleDate = date) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await theaterService.getSchedule(id, scheduleDate);
      const scheduleData = Array.isArray(response) ? response : response.data || response;
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Error fetching theater schedule:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [theaterId, date]);

  useEffect(() => {
    if (theaterId) {
      fetchSchedule();
    }
  }, [theaterId, date, fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
    isEmpty: schedule.length === 0 && !loading,
    hasError: !!error
  };
};

// src/hooks/usePurchases.js - SOLO LÓGICA, NO JSX
import { purchaseService } from '../services/api';

// Hook para gestionar compras del usuario
export const usePurchases = (isAuthenticated = false) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchases = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await purchaseService.getMyPurchases();
      const purchasesData = Array.isArray(response) ? response : response.data || response;
      setPurchases(purchasesData);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurchases();
    } else {
      setPurchases([]);
    }
  }, [isAuthenticated, fetchPurchases]);

  return {
    purchases,
    loading,
    error,
    refetch: fetchPurchases,
    isEmpty: purchases.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para una compra específica
export const usePurchase = (purchaseId, isAuthenticated = false) => {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchase = useCallback(async (id = purchaseId) => {
    if (!id || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const response = await purchaseService.getById(id);
      setPurchase(response);
    } catch (err) {
      console.error('Error fetching purchase:', err);
      setError(getErrorMessage(err));
      setPurchase(null);
    } finally {
      setLoading(false);
    }
  }, [purchaseId, isAuthenticated]);

  useEffect(() => {
    if (purchaseId && isAuthenticated) {
      fetchPurchase();
    }
  }, [purchaseId, isAuthenticated, fetchPurchase]);

  return {
    purchase,
    loading,
    error,
    refetch: fetchPurchase,
    isEmpty: !purchase && !loading,
    hasError: !!error
  };
};

// Hook para realizar compra
export const useCreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createPurchase = useCallback(async (purchaseData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await purchaseService.create(purchaseData);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error('Error creating purchase:', err);
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset states
  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    createPurchase,
    loading,
    error,
    success,
    reset,
    hasError: !!error
  };
};

// src/hooks/useCalendar.js - SOLO LÓGICA, NO JSX
import { calendarService } from '../services/api';

// Hook para calendario semanal
export const useWeekCalendar = (startDate) => {
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCalendar = useCallback(async (date = startDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await calendarService.getWeekCalendar(date);
      setCalendar(response);
    } catch (err) {
      console.error('Error fetching week calendar:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [startDate]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  return {
    calendar,
    loading,
    error,
    refetch: fetchCalendar,
    isEmpty: !calendar && !loading,
    hasError: !!error,

    // Estados derivados útiles
    weekDates: calendar?.week_dates || [],
    theaters: calendar?.theaters || [],
    showtimes: calendar?.showtimes || {}
  };
};

// Hook para programación de teatro específico
export const useTheaterCalendar = (theaterName) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async (name = theaterName) => {
    if (!name) return;

    setLoading(true);
    setError(null);

    try {
      const response = await calendarService.getTheaterSchedule(name);
      const scheduleData = Array.isArray(response) ? response : response.data || response;
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Error fetching theater calendar:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [theaterName]);

  useEffect(() => {
    if (theaterName) {
      fetchSchedule();
    }
  }, [theaterName, fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
    isEmpty: schedule.length === 0 && !loading,
    hasError: !!error
  };
};

// Hook para horarios de película en todos los teatros
export const useMovieCalendar = (movieId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedule = useCallback(async (id = movieId) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await calendarService.getMovieSchedule(id);
      const scheduleData = Array.isArray(response) ? response : response.data || response;
      setSchedule(scheduleData);
    } catch (err) {
      console.error('Error fetching movie calendar:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      fetchSchedule();
    }
  }, [movieId, fetchSchedule]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchSchedule,
    isEmpty: schedule.length === 0 && !loading,
    hasError: !!error
  };
};