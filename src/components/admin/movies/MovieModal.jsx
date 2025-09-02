// src/components/admin/movies/MovieModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import ImageUpload from './ImageUpload';

const MovieModal = ({ movie, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    price: '',
    max_capacity: '',
    image_url: '',
    director: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        image_url: movie.image_url || '',
        director: movie.director || '',
        country: movie.country || ''
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
        image_url: '',
        director: '',
        country: ''
      });
    }
    setErrors({});
  }, [movie, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.genre) {
      newErrors.genre = 'El género es requerido';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }

    if (!formData.rating) {
      newErrors.rating = 'La clasificación es requerida';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.max_capacity || formData.max_capacity <= 0) {
      newErrors.max_capacity = 'La capacidad debe ser mayor a 0';
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
      // Convertir strings numéricos a números
      const processedData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        max_capacity: parseInt(formData.max_capacity)
      };

      await onSave(processedData);
    } catch (error) {
      console.error('Error saving movie:', error);
      // Aquí podrías mostrar un error toast o notification
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.image_url}
          />

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
                placeholder="15000"
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
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Descripción de la película..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

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