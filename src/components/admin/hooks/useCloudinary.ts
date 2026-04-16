// src/components/admin/hooks/useCloudinary.js
import { useState } from 'react';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Solicita la firma al backend (solo cuando se usa public_id con preset Signed).
   * Usa fetch directo con el token de localStorage para evitar problemas con interceptores.
   */
  const getSignature = async (publicId, folder = 'cinema/movies') => {
    const token = localStorage.getItem('cinema_token');
    if (!token) throw new Error('No autenticado. Inicia sesión nuevamente.');

    const response = await fetch(`${API_BASE_URL}/admin/cloudinary/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ public_id: publicId, folder }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Error obteniendo firma de Cloudinary');
    }

    return response.json(); // { signature, timestamp, api_key, upload_preset }
  };

  /**
   * Sube una imagen a Cloudinary.
   * - Si se pasa publicId, usa upload Signed (sobrescribe la imagen existente).
   * - Si no se pasa publicId, usa upload anónimo básico (sin public_id fijo).
   */
  const uploadImage = async (file, { publicId }: { publicId?: string } = {}) => {
    if (!file) throw new Error('No file provided');
    if (!file.type.startsWith('image/')) throw new Error('Por favor selecciona solo archivos de imagen');
    if (file.size > 10 * 1024 * 1024) throw new Error('El archivo es muy grande. Máximo 10MB');

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      if (publicId) {
        // Upload Signed: backend genera la firma
        const { signature, timestamp, api_key, upload_preset } = await getSignature(publicId);

        formData.append('api_key', api_key);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('upload_preset', upload_preset);
        formData.append('public_id', publicId);
        formData.append('folder', 'cinema/movies');
      } else {
        // Upload sin public_id fijo (preset debe ser Unsigned para este caso)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'cinema/movies');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Error subiendo imagen a Cloudinary');
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
      };
    } catch (err) {
      const errorMessage = err.message || 'Error subiendo imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error,
    clearError: () => setError(null),
  };
};
