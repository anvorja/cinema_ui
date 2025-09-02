// src/components/admin/hooks/useCloudinary.js
import { useState } from 'react';

// Configura estos valores según tu configuración de Cloudinary
const CLOUDINARY_UPLOAD_PRESET = 'cinema_movies';
const CLOUDINARY_CLOUD_NAME = 'dv2xu8dwr';

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Por favor selecciona solo archivos de imagen');
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('El archivo es muy grande. Máximo 10MB');
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'cinema/movies'); // Opcional: organizar en carpetas

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error subiendo imagen a Cloudinary');
      }

      const data = await response.json();

      return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes
      };
    } catch (err) {
      const errorMessage = err.message || 'Error subiendo imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (publicId) => {
    // Para eliminar imágenes necesitas configurar un endpoint en tu backend
    // o usar la API de Admin de Cloudinary (requiere signature server-side)
    console.log('Delete image:', publicId);
    // Implementar según tus necesidades
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
    clearError: () => setError(null)
  };
};