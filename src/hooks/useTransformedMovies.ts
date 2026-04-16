// src/hooks/useTransformedMovies.js - Hook para obtener datos transformados del backend
import { useMemo } from 'react';
import { useMovies, useComingSoonMovies, usePresaleMovies } from './useMovies';
import { useHomeQuery } from './useQueryMovies';
import { transformMoviesData, getMoviesByCategory, sortMoviesByReleaseDate } from '../utils/movieUtils';

/**
 * Hook principal para obtener todas las películas transformadas
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Datos transformados y estados
 */
export const useTransformedMovies = (options: Record<string, any> = {}) => {
  const {
    autoFetch = true,
    initialLimit = 20,
    filters = {},
    category = 'all'
  } = options;

  // Obtener datos del hook original
  const {
    movies: rawMovies,
    loading,
    error,
    fetchMovies,
    loadMore,
    refresh,
    search,
    isEmpty,
    hasError,
    canLoadMore
  } = useMovies({ autoFetch, initialLimit, filters });

  // Transformar y filtrar películas
  const transformedMovies = useMemo(() => {
    const transformed = transformMoviesData(rawMovies);

    if (category !== 'all') {
      return getMoviesByCategory(transformed, category);
    }

    return transformed;
  }, [rawMovies, category]);

  return {
    movies: transformedMovies,
    rawMovies,
    loading,
    error,
    fetchMovies,
    loadMore,
    refresh,
    search,
    isEmpty,
    hasError,
    canLoadMore
  };
};

/**
 * Hook para próximos estrenos transformados
 * @returns {Object} - Próximos estrenos transformados
 */
export const useTransformedComingSoon = () => {
  const {
    movies: rawMovies,
    loading,
    error,
    refetch
  } = useComingSoonMovies();

  const transformedMovies = useMemo(() => {
    const transformed = transformMoviesData(rawMovies);
    return sortMoviesByReleaseDate(transformed, 'asc');
  }, [rawMovies]);

  return {
    movies: transformedMovies,
    rawMovies,
    loading,
    error,
    refetch,
    isEmpty: transformedMovies.length === 0 && !loading,
    hasError: !!error
  };
};

/**
 * Hook para preventas transformadas
 * @returns {Object} - Preventas transformadas
 */
export const useTransformedPresales = () => {
  const {
    movies: rawMovies,
    loading,
    error,
    refetch
  } = usePresaleMovies();

  const transformedMovies = useMemo(() => {
    const transformed = transformMoviesData(rawMovies);
    return sortMoviesByReleaseDate(transformed, 'asc');
  }, [rawMovies]);

  return {
    movies: transformedMovies,
    rawMovies,
    loading,
    error,
    refetch,
    isEmpty: transformedMovies.length === 0 && !loading,
    hasError: !!error
  };
};

/**
 * Hook para obtener películas destacadas para el carrusel
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Películas destacadas transformadas
 */
export const useTransformedFeatured = (options: Record<string, any> = {}) => {
  const { maxCartelera = 3, maxPresales = 2 } = options;

  // Obtener datos
  const { movies: carteleraMovies, loading: loadingCartelera } = useTransformedMovies({
    category: 'cartelera',
    initialLimit: maxCartelera
  });

  const { movies: presalesMovies, loading: loadingPresales } = useTransformedPresales();

  // Combinar y procesar para carrusel
  const featuredMovies = useMemo(() => {
    const featured = [
      ...carteleraMovies.slice(0, maxCartelera),
      ...presalesMovies.slice(0, maxPresales)
    ];

    // Priorizar películas con mejores imágenes
    return featured.sort((a, b) => {
      const aHasBackdrop = !!a.backdrop_url;
      const bHasBackdrop = !!b.backdrop_url;

      if (aHasBackdrop && !bHasBackdrop) return -1;
      if (!aHasBackdrop && bHasBackdrop) return 1;

      return 0;
    });
  }, [carteleraMovies, presalesMovies, maxCartelera, maxPresales]);

  return {
    movies: featuredMovies,
    loading: loadingCartelera || loadingPresales,
    isEmpty: featuredMovies.length === 0,
    hasBackdrops: featuredMovies.some(movie => movie.backdrop_url)
  };
};

/**
 * Hook para obtener películas de todas las categorías para la página Home.
 * Usa un único endpoint agregado — una sola petición HTTP en lugar de tres.
 * React Query deduplica automáticamente si varios componentes lo invocan.
 */
export const useTransformedHomeData = () => {
  const { data, isLoading, error, refetch } = useHomeQuery();

  const cartelaraMovies = useMemo(
    () => transformMoviesData(data?.cartelera ?? []),
    [data?.cartelera]
  );

  const comingSoonMovies = useMemo(() => {
    const transformed = transformMoviesData(data?.coming_soon ?? []);
    return sortMoviesByReleaseDate(transformed, 'asc');
  }, [data?.coming_soon]);

  const presalesMovies = useMemo(() => {
    const transformed = transformMoviesData(data?.presales ?? []);
    return sortMoviesByReleaseDate(transformed, 'asc');
  }, [data?.presales]);

  const prontoMovies = useMemo(() => {
    const upcoming = [
      ...comingSoonMovies.slice(0, 4),
      ...presalesMovies.slice(0, 4)
    ];
    return sortMoviesByReleaseDate(upcoming, 'asc').slice(0, 8);
  }, [comingSoonMovies, presalesMovies]);

  const featuredMovies = useMemo(() => {
    const featured = [
      ...cartelaraMovies.slice(0, 3),
      ...presalesMovies.slice(0, 2)
    ];
    return featured.sort((a, b) => {
      const aHasBackdrop = !!a.backdrop_url;
      const bHasBackdrop = !!b.backdrop_url;
      if (aHasBackdrop && !bHasBackdrop) return -1;
      if (!aHasBackdrop && bHasBackdrop) return 1;
      return 0;
    });
  }, [cartelaraMovies, presalesMovies]);

  const hasError = !!error;
  const isEmpty = cartelaraMovies.length === 0 && comingSoonMovies.length === 0 && presalesMovies.length === 0;

  return {
    cartelera: {
      movies: cartelaraMovies.slice(0, 8),
      loading: isLoading,
      hasError,
      isEmpty: cartelaraMovies.length === 0 && !isLoading,
      refetch,
    },
    comingSoon: {
      movies: comingSoonMovies.slice(0, 4),
      loading: isLoading,
      hasError,
      isEmpty: comingSoonMovies.length === 0 && !isLoading,
      refetch,
    },
    presales: {
      movies: presalesMovies.slice(0, 4),
      loading: isLoading,
      hasError,
      isEmpty: presalesMovies.length === 0 && !isLoading,
      refetch,
    },

    featured: featuredMovies,
    pronto: prontoMovies,

    loading: isLoading,
    error: hasError,
    isEmpty,
    refresh: refetch,
  };
};

/**
 * Hook para estadísticas del Home
 * @param {Object} homeData - Datos del home
 * @returns {Object} - Estadísticas calculadas
 */
export const useHomeStats = (homeData) => {
  return useMemo(() => {
    if (!homeData) return null;

    const totalMovies = homeData.cartelera.movies.length +
                       homeData.comingSoon.movies.length +
                       homeData.presales.movies.length;

    const availableMovies = [
      ...homeData.cartelera.movies,
      ...homeData.comingSoon.movies,
      ...homeData.presales.movies
    ].filter(movie => movie.isAvailable).length;

    const totalCapacity = [
      ...homeData.cartelera.movies,
      ...homeData.comingSoon.movies,
      ...homeData.presales.movies
    ].reduce((sum, movie) => sum + (movie.max_capacity || 0), 0);

    const totalAvailableTickets = [
      ...homeData.cartelera.movies,
      ...homeData.comingSoon.movies,
      ...homeData.presales.movies
    ].reduce((sum, movie) => sum + (movie.available_tickets || 0), 0);

    return {
      totalMovies,
      availableMovies,
      soldOutMovies: totalMovies - availableMovies,
      totalCapacity,
      totalAvailableTickets,
      occupancyRate: totalCapacity > 0 ?
        ((totalCapacity - totalAvailableTickets) / totalCapacity) * 100 : 0,
      hasContent: totalMovies > 0,
      genres: [...new Set([
        ...homeData.cartelera.movies,
        ...homeData.comingSoon.movies,
        ...homeData.presales.movies
      ].map(movie => movie.genre).filter(Boolean))]
    };
  }, [homeData]);
};

/**
 * Hook simplificado para usar en componentes que solo necesitan películas transformadas
 * @param {Array} rawMovies - Películas sin transformar
 * @returns {Array} - Películas transformadas
 */
export const useSimpleTransform = (rawMovies = []) => {
  return useMemo(() => {
    return transformMoviesData(rawMovies);
  }, [rawMovies]);
};