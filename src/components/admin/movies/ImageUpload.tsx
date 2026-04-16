// src/components/admin/movies/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { Upload, Edit2, Loader, X, AlertCircle } from 'lucide-react';
import { useCloudinary } from '../hooks/useCloudinary';

const ImageUpload = ({
  onImageUpload,
  currentImage = '',
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const fileInputRef = useRef(null);

  const { uploadImage, uploading, error, clearError } = useCloudinary();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    clearError();

    // Crear preview local inmediatamente
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const result = await uploadImage(file);
      onImageUpload(result.url);
      // Mantener el preview hasta que se confirme la subida
    } catch (err) {
      // En caso de error, restaurar la imagen anterior
      setPreviewUrl(currentImage);
      console.error('Error uploading image:', err);
    } finally {
      URL.revokeObjectURL(localPreview);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Imagen de la película
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-900/20' 
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg mb-4"
              />
              {!uploading && (
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  title="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {!uploading && (
              <button
                onClick={onButtonClick}
                className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Cambiar imagen
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-400 mb-2">
              Arrastra y suelta una imagen aquí, o{' '}
              <button
                onClick={onButtonClick}
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                selecciona un archivo
              </button>
            </div>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
            <div className="text-center">
              <Loader className="h-6 w-6 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Subiendo imagen...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-900/50 border border-red-500 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
          <span className="text-red-200 text-sm">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;