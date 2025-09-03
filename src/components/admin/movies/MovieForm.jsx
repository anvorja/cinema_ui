// src/components/admin/movies/MovieForm.jsx
import React, { useState } from 'react';
import MultipleImageUpload from './MultipleImageUpload';

const MovieForm = ({ movie = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    genre: movie?.genre || '',
    duration: movie?.duration || '',
    rating: movie?.rating || '',
    price: movie?.price || '',
    max_capacity: movie?.max_capacity || '',
    available_tickets: movie?.available_tickets || '',

    // Nuevas imágenes - estructura esperada por el backend
    images: {
      poster: movie?.poster_image || '',
      detail1: movie?.detail1_image || '',
      detail2: movie?.detail2_image || '',
      backdrop: movie?.backdrop_image || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones básicas
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.genre.trim()) newErrors.genre = 'El género es requerido';
    if (!formData.duration) newErrors.duration = 'La duración es requerida';
    if (!formData.rating) newErrors.rating = 'La calificación es requerida';
    if (!formData.price) newErrors.price = 'El precio es requerido';
    if (!formData.max_capacity) newErrors.max_capacity = 'La capacidad máxima es requerida';

    // Validar que todas las imágenes estén presentes
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
      // Preparar datos para enviar al backend
      const movieData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating),
        price: parseFloat(formData.price),
        max_capacity: parseInt(formData.max_capacity),
        available_tickets: parseInt(formData.available_tickets || formData.max_capacity),

        // URLs de las imágenes
        poster_image: formData.images.poster,
        detail1_image: formData.images.detail1,
        detail2_image: formData.images.detail2,
        backdrop_image: formData.images.backdrop
      };

      await onSubmit(movieData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-6">
        {movie ? 'Editar Película' : 'Nueva Película'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa el título de la película"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Género *
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Acción, Drama, Comedia"
            />
            {errors.genre && (
              <p className="text-red-400 text-sm mt-1">{errors.genre}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe la película..."
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración (min) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.duration && (
              <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Calificación *
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.rating && (
              <p className="text-red-400 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Capacidad máxima *
            </label>
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.max_capacity && (
              <p className="text-red-400 text-sm mt-1">{errors.max_capacity}</p>
            )}
          </div>
        </div>

        {/* Componente de múltiples imágenes */}
        <MultipleImageUpload
          onImagesChange={handleImagesChange}
          currentImages={formData.images}
        />
        {errors.images && (
          <p className="text-red-400 text-sm">{errors.images}</p>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              movie ? 'Actualizar Película' : 'Crear Película'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;