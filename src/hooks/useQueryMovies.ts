// src/hooks/useQueryMovies.js
/**
 * React Query hooks for movie data.
 *
 * These replace the manual useEffect/useState pattern with automatic caching,
 * deduplication, and stale-while-revalidate. Multiple components requesting
 * the same query key share a single in-flight request and the same cached result.
 */
import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services/api';

// ------------------------------------------------------------------
// Query keys — centralised so invalidation is always consistent
// ------------------------------------------------------------------
export const movieKeys = {
  all: ['movies'],
  home: () => ['movies', 'home'],
  lists: () => ['movies', 'list'],
  list: (filters) => ['movies', 'list', filters],
  detail: (id) => ['movies', 'detail', id],
  showtimes: (id) => ['movies', 'showtimes', id],
  theaters: (id) => ['movies', 'theaters', id],
  availability: (id) => ['movies', 'availability', id],
};

// ------------------------------------------------------------------
// Home page — single aggregated request
// ------------------------------------------------------------------
export const useHomeQuery = (options = {}) =>
  useQuery({
    queryKey: movieKeys.home(),
    queryFn: () => movieService.getHomeData(options),
    // staleTime mirrors the backend cache TTL so we never hit an already-warm cache
    staleTime: 2 * 60 * 1000,
  });

// ------------------------------------------------------------------
// Movie listing (cartelera, search, etc.)
// ------------------------------------------------------------------
export const useMoviesListQuery = (filters = {}, limit = 20) =>
  useQuery({
    queryKey: movieKeys.list({ ...filters, limit }),
    queryFn: () => movieService.getPaginated(0, limit, filters),
    staleTime: 5 * 60 * 1000,
  });

// ------------------------------------------------------------------
// Single movie detail
// ------------------------------------------------------------------
export const useMovieDetailQuery = (movieId) =>
  useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => movieService.getById(movieId),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000,
  });

// ------------------------------------------------------------------
// Movie showtimes
// ------------------------------------------------------------------
export const useMovieShowtimesQuery = (movieId, params = {}) =>
  useQuery({
    queryKey: movieKeys.showtimes(movieId),
    queryFn: () => movieService.getShowtimes(movieId, params),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000,
  });

// ------------------------------------------------------------------
// Movie theaters
// ------------------------------------------------------------------
export const useMovieTheatersQuery = (movieId) =>
  useQuery({
    queryKey: movieKeys.theaters(movieId),
    queryFn: () => movieService.getTheaters(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });

// ------------------------------------------------------------------
// Movie availability
// ------------------------------------------------------------------
export const useMovieAvailabilityQuery = (movieId) =>
  useQuery({
    queryKey: movieKeys.availability(movieId),
    queryFn: () => movieService.getAvailability(movieId),
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,
  });
