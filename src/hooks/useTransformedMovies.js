// src/hooks/useTransformedMovies.js - Hook para obtener datos transformados del backend
import { useMemo } from 'react';
import { useMovies, useComingSoonMovies, usePresaleMovies } from './useMovies';
import { transformMoviesData, getMoviesByCategory, sortMoviesByReleaseDate } from '../utils/movieUtils';

/**
 * Hook principal para obtener todas las películas transformadas
 * @param {Object} options - Opciones de configuración
 * @returns {Object} - Datos transformados y estados
 */
export const useTransformedMovies = (options = {}) => {
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
export const useTransformedFeatured = (options = {}) => {
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
 * Hook para obtener películas de todas las categorías para la página Home
 * @returns {Object} - Datos organizados por categoría
 */
export const useTransformedHomeData = () => {
  // Obtener datos de todas las fuentes
  const cartelera = useTransformedMovies({
    category: 'cartelera',
    initialLimit: 8
  });

  const comingSoon = useTransformedComingSoon();
  const presales = useTransformedPresales();

  // Combinar para sección "Pronto"
  const prontoMovies = useMemo(() => {
    const upcoming = [
      ...comingSoon.movies.slice(0, 4),
      ...presales.movies.slice(0, 4)
    ];

    return sortMoviesByReleaseDate(upcoming, 'asc').slice(0, 8);
  }, [comingSoon.movies, presales.movies]);

  // Películas destacadas para carrusel
  const featuredMovies = useMemo(() => {
    const featured = [
      ...cartelera.movies.slice(0, 3),
      ...presales.movies.slice(0, 2)
    ];

    return featured.sort((a, b) => {
      const aHasBackdrop = !!a.backdrop_url;
      const bHasBackdrop = !!b.backdrop_url;

      if (aHasBackdrop && !bHasBackdrop) return -1;
      if (!aHasBackdrop && bHasBackdrop) return 1;

      return 0;
    });
  }, [cartelera.movies, presales.movies]);

  // Estados globales
  const isLoading = cartelera.loading || comingSoon.loading || presales.loading;
  const hasError = cartelera.hasError || comingSoon.hasError || presales.hasError;
  const isEmpty = cartelera.isEmpty && comingSoon.isEmpty && presales.isEmpty;

  return {
    // Datos por categoría
    cartelera: {
      ...cartelera,
      movies: cartelera.movies.slice(0, 8)
    },
    comingSoon: {
      ...comingSoon,
      movies: comingSoon.movies.slice(0, 4)
    },
    presales: {
      ...presales,
      movies: presales.movies.slice(0, 4)
    },

    // Datos combinados
    featured: featuredMovies,
    pronto: prontoMovies,

    // Estados globales
    loading: isLoading,
    error: hasError,
    isEmpty,

    // Funciones de recarga
    refresh: () => {
      cartelera.refresh();
      comingSoon.refetch();
      presales.refetch();
    }
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