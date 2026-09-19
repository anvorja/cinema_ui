// src/utils/movieUtils.js - Utilidades para manejar datos de películas del backend

/**
 * Formatear duración de minutos a formato legible
 * @param {number} minutes - Duración en minutos
 * @returns {string} - Formato legible (ej: "2h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Formatear precio a formato de moneda colombiana
 * @param {number} price - Precio en COP
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return 'Precio no disponible';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Formatear rating del backend al formato de visualización
 * @param {string} rating - Rating del backend
 * @returns {string} - Rating formateado para mostrar
 */
export const formatRatingForDisplay = (rating) => {
  const ratingMap = {
    'G': 'Todos los públicos',
    'PG': 'Mayores de 7 años',
    'PG-13': 'Mayores de 13 años',
    'R': 'Mayores de 17 años',
    'NC-17': 'Mayores de 18 años'
  };
  return ratingMap[rating] || rating || 'Sin clasificar';
};

/**
 * Formatear fecha de lanzamiento
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    console.warn('Error formatting date:', dateString);
    return dateString;
  }
};

/**
 * Formatear fecha de forma corta
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} - Fecha formateada corta (ej: "07 Ago 2025")
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    console.warn('Error formatting short date:', dateString);
    return dateString;
  }
};

/**
 * Obtener badge de estado basado en los datos de la película
 * @param {Object} movie - Objeto película del backend
 * @returns {Object|null} - Badge de estado o null
 */
export const getStatusBadge = (movie) => {
  if (!movie) return null;

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

  // Si es nuevo (menos de 7 días desde release_date)
  if (movie.release_date) {
    const releaseDate = new Date(movie.release_date);
    const now = new Date();
    const diffDays = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 0 && diffDays <= 7) {
      return {
        text: 'ESTRENO',
        color: 'red',
        className: 'bg-red-600 text-white'
      };
    }
  }

  return null;
};

/**
 * Inserta parámetros de transformación de Cloudinary (f_auto,q_auto,w_N) en
 * la URL para servir la imagen ya redimensionada/comprimida al vuelo, sin
 * volver a subir nada. Las URLs venían sin ningún parámetro — el navegador
 * descargaba el poster a resolución original (varios MB) hasta para un
 * thumbnail de card. Si la URL no es de Cloudinary, se devuelve intacta.
 * @param {string} url - URL original de Cloudinary
 * @param {number} width - Ancho objetivo en px
 * @returns {string} - URL con transformación aplicada
 */
export const optimizeCloudinaryUrl = (url, width = 500) => {
  if (!url || typeof url !== 'string') return url;
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const insertAt = idx + marker.length;
  return `${url.slice(0, insertAt)}f_auto,q_auto,w_${width}/${url.slice(insertAt)}`;
};

/**
 * Validar URL de imagen
 * @param {string} url - URL a validar
 * @returns {boolean} - True si es válida
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
 * Obtener la mejor imagen disponible según prioridad
 * @param {Object} movie - Objeto película
 * @param {string} imageType - Tipo de imagen ('poster', 'backdrop', 'detail1', 'detail2')
 * @returns {string} - URL de la mejor imagen disponible
 */
const _IMAGE_WIDTHS = { poster: 500, backdrop: 1200, detail1: 800, detail2: 800 };

export const getBestImageUrl = (movie, imageType = 'poster') => {
  if (!movie) return '/placeholder-movie.jpg';

  const imageUrls = {
    poster: [movie.poster_url, movie.backdrop_url, movie.detail_1_url],
    backdrop: [movie.backdrop_url, movie.poster_url, movie.detail_2_url],
    detail1: [movie.detail_1_url, movie.poster_url, movie.backdrop_url],
    detail2: [movie.detail_2_url, movie.backdrop_url, movie.detail_1_url]
  };

  const urls = imageUrls[imageType] || imageUrls.poster;

  // Retornar la primera URL válida, ya optimizada para el ancho de este uso
  for (const url of urls) {
    if (validateImageUrl(url)) {
      return optimizeCloudinaryUrl(url, _IMAGE_WIDTHS[imageType] || 500);
    }
  }

  return '/placeholder-movie.jpg';
};

/**
 * Transformar película del backend al formato esperado por el frontend
 * @param {Object} movie - Película del backend
 * @returns {Object} - Película transformada
 */
export const transformMovieData = (movie) => {
  if (!movie) return null;

  return {
    // Campos originales del backend
    ...movie,

    // Campos normalizados para compatibilidad con componentes existentes
    posterImage: movie.poster_url,
    backdropImage: movie.backdrop_url,
    image_url: movie.poster_url, // Fallback para componentes legacy

    // Campos calculados
    ageRating: formatRatingForDisplay(movie.rating),
    duration_formatted: formatDuration(movie.duration),
    price_formatted: formatPrice(movie.price),
    release_date_formatted: formatReleaseDate(movie.release_date) || movie.formatted_release_date || '',
    release_date_short: formatDateShort(movie.release_date) || movie.formatted_release_date || '',

    // Estado de disponibilidad
    isAvailable: (movie.available_tickets || 0) > 0,
    isSoldOut: (movie.available_tickets || 0) === 0,
    soldOutPercentage: movie.max_capacity > 0
      ? ((movie.max_capacity - (movie.available_tickets || 0)) / movie.max_capacity) * 100
      : 0,

    // Badge de estado
    statusBadge: getStatusBadge(movie),

    // URLs de imágenes con fallbacks
    images: {
      poster: getBestImageUrl(movie, 'poster'),
      backdrop: getBestImageUrl(movie, 'backdrop'),
      detail1: getBestImageUrl(movie, 'detail1'),
      detail2: getBestImageUrl(movie, 'detail2')
    }
  };
};

/**
 * Transformar array de películas
 * @param {Array} movies - Array de películas del backend
 * @returns {Array} - Array de películas transformadas
 */
export const transformMoviesData = (movies = []) => {
  return movies.map(transformMovieData).filter(Boolean);
};

/**
 * Filtrar películas por disponibilidad
 * @param {Array} movies - Array de películas
 * @returns {Array} - Películas disponibles
 */
export const getAvailableMovies = (movies = []) => {
  return movies.filter(movie => movie.isAvailable);
};

/**
 * Ordenar películas por fecha de estreno
 * @param {Array} movies - Array de películas
 * @param {string} order - 'asc' | 'desc'
 * @returns {Array} - Películas ordenadas
 */
export const sortMoviesByReleaseDate = (movies = [], order = 'desc') => {
  return [...movies].sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);

    return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });
};

/**
 * Obtener películas por categoría
 * @param {Array} movies - Array de películas
 * @param {string} category - Categoría a filtrar
 * @returns {Array} - Películas filtradas
 */
export const getMoviesByCategory = (movies = [], category) => {
  switch (category) {
    case 'cartelera':
    case 'in_theaters':
      return movies.filter(movie => movie.status === 'in_theaters' && !movie.is_presale);

    case 'coming_soon':
    case 'pronto':
      return movies.filter(movie => movie.status === 'coming_soon');

    case 'presales':
    case 'preventa':
      return movies.filter(movie => movie.is_presale);

    case 'available':
      return getAvailableMovies(movies);

    default:
      return movies;
  }
};

/**
 * Buscar películas por texto
 * @param {Array} movies - Array de películas
 * @param {string} query - Texto a buscar
 * @returns {Array} - Películas que coinciden
 */
export const searchMovies = (movies = [], query) => {
  if (!query || typeof query !== 'string') return movies;

  const searchTerm = query.toLowerCase().trim();

  return movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm) ||
    movie.original_title?.toLowerCase().includes(searchTerm) ||
    movie.genre?.toLowerCase().includes(searchTerm) ||
    movie.description?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Obtener estadísticas de una película
 * @param {Object} movie - Película
 * @returns {Object} - Estadísticas
 */
export const getMovieStats = (movie) => {
  if (!movie) return {};

  const maxCapacity = movie.max_capacity || 0;
  const availableTickets = movie.available_tickets || 0;
  const soldTickets = maxCapacity - availableTickets;

  return {
    maxCapacity,
    availableTickets,
    soldTickets,
    occupancyRate: maxCapacity > 0 ? (soldTickets / maxCapacity) * 100 : 0,
    isAlmostSoldOut: availableTickets <= maxCapacity * 0.1, // Menos del 10% disponible
    isSoldOut: availableTickets === 0
  };
};