// src/components/admin/movies/MovieModal.jsx - CAMPOS CORREGIDOS
import React, { useState, useEffect } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { getErrorMessage } from '../../../services/api';
import MultipleImageUpload from './MultipleImageUpload';

const MovieModal = ({ movie, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    price: '',
    max_capacity: '',
    available_tickets: '',
    director: '',
    country: '',
    release_date: '',
    status: 'in_theaters',
    is_presale: false,
    theater_ids: [1, 2, 3, 4, 5], // IDs por defecto, puedes ajustar según tus teatros
    // Estructura de 4 imágenes obligatorias con nombres correctos
    images: {
      poster: '',
      detail1: '',
      detail2: '',
      backdrop: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  // Opciones para los selects
  const genres = [
    'Acción', 'Aventura', 'Animación', 'Biografía', 'Comedia', 'Crimen',
    'Documental', 'Drama', 'Familia', 'Fantasía', 'Film-Noir', 'Historia',
    'Terror', 'Música', 'Musical', 'Misterio', 'Romance', 'Ciencia Ficción',
    'Deporte', 'Thriller', 'Guerra', 'Western'
  ];

  const ratings = [
    { value: 'G', label: 'G - Apta para todos' },
    { value: 'PG', label: 'PG - Orientación parental' },
    { value: 'PG-13', label: 'PG-13 - Mayores de 13' },
    { value: 'R', label: 'R - Restringida' },
    { value: 'NC-17', label: 'NC-17 - Solo adultos' }
  ];

  const statusOptions = [
    { value: 'in_theaters', label: 'En cartelera' },
    { value: 'coming_soon', label: 'Próximamente' },
    { value: 'ended', label: 'Terminada' }
  ];

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        genre: movie.genre || '',
        duration: movie.duration || '',
        rating: movie.rating || '',
        price: movie.price || '',
        max_capacity: movie.max_capacity || '',
        available_tickets: movie.available_tickets || movie.max_capacity || '',
        director: movie.director || '',
        country: movie.country || '',
        release_date: movie.release_date || '',
        status: movie.status || 'in_theaters',
        is_presale: movie.is_presale || false,
        theater_ids: movie.theater_ids || [1, 2, 3, 4, 5],
        images: {
          poster: movie.poster_url || '',
          detail1: movie.detail_1_url || '',
          detail2: movie.detail_2_url || '',
          backdrop: movie.backdrop_url || ''
        }
      });
    } else {
      setFormData({
        title: '',
        description: '',
        genre: '',
        duration: '',
        rating: '',
        price: '',
        max_capacity: '',
        available_tickets: '',
        director: '',
        country: '',
        release_date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        status: 'in_theaters',
        is_presale: false,
        theater_ids: [1, 2, 3, 4, 5],
        images: {
          poster: '',
          detail1: '',
          detail2: '',
          backdrop: ''
        }
      });
    }
    setErrors({});
    setApiError('');
  }, [movie, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length > 1000) {
      newErrors.description = `La descripción no puede superar 1000 caracteres (actualmente: ${formData.description.length})`;
    }

    if (!formData.genre) {
      newErrors.genre = 'El género es requerido';
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }

    if (!formData.rating) {
      newErrors.rating = 'La clasificación es requerida';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.max_capacity || Number(formData.max_capacity) <= 0) {
      newErrors.max_capacity = 'La capacidad debe ser mayor a 0';
    }

    if (!formData.release_date) {
      newErrors.release_date = 'La fecha de estreno es requerida';
    }

    // Validar que todas las 4 imágenes estén presentes
    const requiredImages = ['poster', 'detail1', 'detail2', 'backdrop'];
    const missingImages = requiredImages.filter(imageType => !formData.images[imageType]);

    if (missingImages.length > 0) {
      newErrors.images = `Faltan las siguientes imágenes: ${missingImages.join(', ')}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos exactamente como los espera el backend
      const processedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        genre: formData.genre,
        duration: parseInt(formData.duration),
        rating: formData.rating,
        price: parseFloat(formData.price),
        max_capacity: parseInt(formData.max_capacity),
        available_tickets: parseInt(formData.available_tickets || formData.max_capacity),
        director: formData.director.trim() || null,
        country: formData.country.trim() || null,
        release_date: formData.release_date,
        status: formData.status,
        is_presale: formData.is_presale,
        theater_ids: formData.theater_ids,

        // Mapear las imágenes a los campos exactos que espera el backend
        poster_url: formData.images.poster,
        detail_1_url: formData.images.detail1,
        detail_2_url: formData.images.detail2,
        backdrop_url: formData.images.backdrop
      };

      // DEBUG: Mostrar en consola lo que se va a enviar
      console.log('Datos que se van a enviar al backend:', processedData);
      console.log('Tipos de datos:', {
        title: typeof processedData.title,
        duration: typeof processedData.duration,
        price: typeof processedData.price,
        max_capacity: typeof processedData.max_capacity,
        available_tickets: typeof processedData.available_tickets,
        is_presale: typeof processedData.is_presale,
        theater_ids: Array.isArray(processedData.theater_ids)
      });

      setApiError('');
      await onSave(processedData);
    } catch (error) {
      console.error('Error completo:', error);
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Si cambia max_capacity, actualizar available_tickets automáticamente
    if (name === 'max_capacity') {
      setFormData(prev => ({
        ...prev,
        available_tickets: value
      }));
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));

    // Limpiar error de imágenes si se agregan
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {movie ? 'Editar Película' : 'Nueva Película'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Componente de múltiples imágenes */}
          <MultipleImageUpload
            onImagesChange={handleImagesChange}
            currentImages={formData.images}
            movieTitle={formData.title}
          />
          {errors.images && (
            <p className="text-red-400 text-sm">{errors.images}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Título *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Título de la película"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
                Género *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.genre ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="">Seleccionar género</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              {errors.genre && (
                <p className="mt-1 text-sm text-red-400">{errors.genre}</p>
              )}
            </div>

            <div>
              <label htmlFor="director" className="block text-sm font-medium text-gray-300 mb-2">
                Director
              </label>
              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del director"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                País
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Colombia, Estados Unidos"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Duración (minutos) *
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.duration ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="120"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-400">{errors.duration}</p>
              )}
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
                Clasificación *
              </label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rating ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="">Seleccionar clasificación</option>
                {ratings.map(rating => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-400">{errors.rating}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                Precio (COP) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="18000"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-300 mb-2">
                Capacidad máxima *
              </label>
              <input
                id="max_capacity"
                name="max_capacity"
                type="number"
                min="1"
                value={formData.max_capacity}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.max_capacity ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="100"
              />
              {errors.max_capacity && (
                <p className="mt-1 text-sm text-red-400">{errors.max_capacity}</p>
              )}
            </div>

            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de estreno *
              </label>
              <input
                id="release_date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.release_date ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.release_date && (
                <p className="mt-1 text-sm text-red-400">{errors.release_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Estado
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="available_tickets" className="block text-sm font-medium text-gray-300 mb-2">
                Tickets disponibles
              </label>
              <input
                id="available_tickets"
                name="available_tickets"
                type="number"
                min="0"
                value={formData.available_tickets}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>

            <div className="flex items-center">
              <input
                id="is_presale"
                name="is_presale"
                type="checkbox"
                checked={formData.is_presale}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_presale" className="ml-2 block text-sm text-gray-300">
                Es preventa
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Descripción *
              </label>
              <span className={`text-xs ${formData.description.length > 1000 ? 'text-red-400 font-medium' : formData.description.length > 900 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {formData.description.length}/1000
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Descripción de la película..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-900/50 border border-red-500 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-200 text-sm">{apiError}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
            >
              {loading && (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              )}
              {movie ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieModal;