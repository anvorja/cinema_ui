// hooks/useSmartSearch.js - HOOK PARA BÚSQUEDA INTELIGENTE (CORREGIDO)
import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { searchMovies } from '../services/api'; // Solo importar searchMovies

export const useSmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función de scoring de resultados
  const scoreSearchResults = useCallback((movies, originalQuery) => {
    const query = originalQuery.toLowerCase().trim();

    return movies.map(movie => {
      let score = 0;

      // Puntuación por coincidencias exactas
      if (movie.title.toLowerCase().includes(query)) {
        score += 10;
      }
      if (movie.genre?.toLowerCase().includes(query)) {
        score += 8;
      }
      if (movie.director?.toLowerCase().includes(query)) {
        score += 6;
      }
      if (movie.description?.toLowerCase().includes(query)) {
        score += 3;
      }

      // Bonus por coincidencias al inicio
      if (movie.title.toLowerCase().startsWith(query)) {
        score += 5;
      }

      // Bonus por películas disponibles
      if (movie.status === 'in_theaters') {
        score += 2;
      }

      return { ...movie, searchScore: score };
    }).sort((a, b) => b.searchScore - a.searchScore);
  }, []);

  // Búsqueda con debounce mejorada
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery) => {
      if (!searchQuery?.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Búsqueda simple y efectiva
        const searchResult = await searchMovies(searchQuery, { limit: 10 });
        const movies = Array.isArray(searchResult) ? searchResult : searchResult.data || [];

        // Aplicar scoring de relevancia
        const scoredResults = scoreSearchResults(movies, searchQuery);

        setResults(scoredResults.slice(0, 8)); // Limitar a 8 resultados

      } catch (err) {
        console.error('Error en búsqueda inteligente:', err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [scoreSearchResults]
  );

  // Función para buscar
  const search = useCallback((searchQuery) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [debouncedSearch]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    debouncedSearch.cancel(); // Cancelar búsquedas pendientes
  }, [debouncedSearch]);

  return {
    query,
    results,
    loading,
    error,
    search,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: results.length === 0 && !loading && query.length > 0
  };
};

// Función auxiliar para búsqueda avanzada (opcional)
export const searchMoviesAdvanced = async (query, options = {}) => {
  // Importar api dentro de la función para evitar errores
  const { api } = await import('../services/api');

  try {
    const params = new URLSearchParams({
      q: query,
      limit: options.limit || 10,
      ...(options.genre && { genre: options.genre }),
      ...(options.director && { director: options.director }),
      ...(options.country && { country: options.country }),
      ...(options.rating && { rating: options.rating }),
      ...(options.min_price && { min_price: options.min_price }),
      ...(options.max_price && { max_price: options.max_price })
    });

    const response = await api.get(`/movies/search?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    throw error;
  }
};

// Función para sugerencias (opcional)
export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const response = await searchMoviesAdvanced(query, { limit: 5 });

    // Extraer sugerencias únicas
    const suggestions = new Set();

    response.forEach(movie => {
      // Agregar título
      if (movie.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(movie.title);
      }

      // Agregar género
      if (movie.genre && movie.genre.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(movie.genre);
      }

      // Agregar director
      if (movie.director && movie.director.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(movie.director);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
    return [];
  }
};