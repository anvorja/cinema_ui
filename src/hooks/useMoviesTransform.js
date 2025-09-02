// src/hooks/useMoviesTransform.js - Hook para normalizar datos del backend
import { useMemo } from 'react';

/**
 * Hook para transformar datos de películas del backend al formato esperado por el frontend
 * Normaliza los nombres de campos y añade campos calculados
 */
export const useMoviesTransform = (movies = []) => {
  return useMemo(() => {
    return movies.map(movie => ({
      // Campos originales del backend
      ...movie,

      // Campos normalizados para compatibilidad con componentes existentes
      posterImage: movie.poster_url,
      backdropImage: movie.backdrop_url,
      image_url: movie.poster_url, // Fallback para componentes que usen este campo

      // Campos calculados
      ageRating: formatRatingForDisplay(movie.rating),
      duration_formatted: formatDuration(movie.duration),
      price_formatted: formatPrice(movie.price),
      release_date_formatted: formatReleaseDate(movie.release_date),

      // Estado de disponibilidad
      isAvailable: (movie.available_tickets || 0) > 0,
      isSoldOut: (movie.available_tickets || 0) === 0,

      // Badges de estado
      statusBadge: getStatusBadge(movie),

      // URLs de imágenes con fallbacks
      images: {
        poster: movie.poster_url || '/placeholder-movie.jpg',
        backdrop: movie.backdrop_url || movie.poster_url || '/placeholder-movie.jpg',
        detail1: movie.detail_1_url || movie.poster_url || '/placeholder-movie.jpg',
        detail2: movie.detail_2_url || movie.backdrop_url || '/placeholder-movie.jpg'
      }
    }));
  }, [movies]);
};

/**
 * Formatear duración de minutos a formato legible
 */
const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Formatear precio a formato de moneda colombiana
 */
const formatPrice = (price) => {
  if (!price) return 'Precio no disponible';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Formatear rating del backend al formato de visualización
 */
const formatRatingForDisplay = (rating) => {
  const ratingMap = {
    'G': 'Todos los públicos',
    'PG': 'Mayores de 7 años',
    'PG-13': 'Mayores de 13 años',
    'R': 'Mayores de 17 años',
    'NC-17': 'Mayores de 18 años'
  };
  return ratingMap[rating] || rating;
};

/**
 * Formatear fecha de lanzamiento
 */
const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Obtener badge de estado basado en los datos de la película
 */
const getStatusBadge = (movie) => {
  if (movie.is_presale) {
    return {
      text: 'PREVENTA',
      color: 'yellow',
      className: 'bg-yellow-600 text-white'
    };
  }

  if (movie.status === 'coming_soon') {
    return {
      text: 'PRÓXIMAMENTE',
      color: 'blue',
      className: 'bg-blue-600 text-white'
    };
  }

  if (movie.status === 'in_theaters') {
    return {
      text: 'EN CARTELERA',
      color: 'green',
      className: 'bg-green-600 text-white'
    };
  }

  return null;
};

/**
 * Hook para transformar una sola película
 */
export const useMovieTransform = (movie) => {
  return useMemo(() => {
    if (!movie) return null;

    return {
      // Campos originales del backend
      ...movie,

      // Campos normalizados
      posterImage: movie.poster_url,
      backdropImage: movie.backdrop_url,
      image_url: movie.poster_url,

      // Campos calculados
      ageRating: formatRatingForDisplay(movie.rating),
      duration_formatted: formatDuration(movie.duration),
      price_formatted: formatPrice(movie.price),
      release_date_formatted: formatReleaseDate(movie.release_date),

      // Estado de disponibilidad
      isAvailable: (movie.available_tickets || 0) > 0,
      isSoldOut: (movie.available_tickets || 0) === 0,

      // Badge de estado
      statusBadge: getStatusBadge(movie),

      // URLs de imágenes con fallbacks
      images: {
        poster: movie.poster_url || '/placeholder-movie.jpg',
        backdrop: movie.backdrop_url || movie.poster_url || '/placeholder-movie.jpg',
        detail1: movie.detail_1_url || movie.poster_url || '/placeholder-movie.jpg',
        detail2: movie.detail_2_url || movie.backdrop_url || '/placeholder-movie.jpg'
      }
    };
  }, [movie]);
};

/**
 * Función utilitaria para validar URLs de imágenes
 */
export const validateImageUrl = (url) => {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:' &&
           /\.(jpg|jpeg|png|webp)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

/**
 * Hook para obtener la mejor imagen disponible según prioridad
 */
export const useBestImageUrl = (movie, imageType = 'poster') => {
  return useMemo(() => {
    if (!movie) return '/placeholder-movie.jpg';

    const imageUrls = {
      poster: [movie.poster_url, movie.backdrop_url, movie.detail_1_url],
      backdrop: [movie.backdrop_url, movie.poster_url, movie.detail_2_url],
      detail1: [movie.detail_1_url, movie.poster_url, movie.backdrop_url],
      detail2: [movie.detail_2_url, movie.backdrop_url, movie.detail_1_url]
    };

    const urls = imageUrls[imageType] || imageUrls.poster;

    // Retornar la primera URL válida
    for (const url of urls) {
      if (validateImageUrl(url)) {
        return url;
      }
    }

    return '/placeholder-movie.jpg';
  }, [movie, imageType]);
};