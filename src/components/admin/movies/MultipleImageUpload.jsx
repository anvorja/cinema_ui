// src/components/admin/movies/MultipleImageUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Loader, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useCloudinary } from '../hooks/useCloudinary';

const MultipleImageUpload = ({
  onImagesChange,
  currentImages = {},
  className = ''
}) => {
  // currentImages debe tener la estructura: { poster: '', detail1: '', detail2: '', backdrop: '' }
  const [images, setImages] = useState({
    poster: currentImages.poster || '',
    detail1: currentImages.detail1 || '',
    detail2: currentImages.detail2 || '',
    backdrop: currentImages.backdrop || ''
  });

  // Sincronizar cuando el padre actualiza las imágenes (ej: al abrir modal de edición)
  useEffect(() => {
    setImages({
      poster: currentImages.poster || '',
      detail1: currentImages.detail1 || '',
      detail2: currentImages.detail2 || '',
      backdrop: currentImages.backdrop || ''
    });
  }, [currentImages.poster, currentImages.detail1, currentImages.detail2, currentImages.backdrop]);

  const [dragActive, setDragActive] = useState({
    poster: false,
    detail1: false,
    detail2: false,
    backdrop: false
  });

  const fileInputRefs = {
    poster: useRef(null),
    detail1: useRef(null),
    detail2: useRef(null),
    backdrop: useRef(null)
  };

  const { uploadImage, uploading, error, clearError } = useCloudinary();

  const imageTypes = [
    {
      key: 'poster',
      label: 'Imagen Poster',
      description: 'Imagen principal de la película (tamaño recomendado: 500x750px)',
      position: 'Izquierda superior'
    },
    {
      key: 'detail1',
      label: 'Imagen Detail 1',
      description: 'Primera imagen de detalle (tamaño recomendado: 400x300px)',
      position: 'Izquierda inferior'
    },
    {
      key: 'detail2',
      label: 'Imagen Detail 2',
      description: 'Segunda imagen de detalle (tamaño recomendado: 400x300px)',
      position: 'Derecha inferior'
    },
    {
      key: 'backdrop',
      label: 'Imagen Backdrop',
      description: 'Imagen de fondo panorámica (tamaño recomendado: 1920x1080px)',
      position: 'Derecha superior'
    }
  ];

  const handleDrag = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(prev => ({
      ...prev,
      [imageType]: e.type === "dragenter" || e.type === "dragover"
    }));
  };

  const handleDrop = (e, imageType) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(prev => ({
      ...prev,
      [imageType]: false
    }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0], imageType);
    }
  };

  const handleChange = (e, imageType) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], imageType);
    }
  };

  const handleFile = async (file, imageType) => {
    clearError();

    // Crear preview local inmediatamente
    const localPreview = URL.createObjectURL(file);
    const newImages = {
      ...images,
      [imageType]: localPreview
    };

    setImages(newImages);

    try {
      const result = await uploadImage(file);
      const updatedImages = {
        ...images,
        [imageType]: result.url
      };

      setImages(updatedImages);
      onImagesChange(updatedImages);

    } catch (err) {
      // En caso de error, restaurar la imagen anterior
      setImages(prev => ({
        ...prev,
        [imageType]: currentImages[imageType] || ''
      }));
      console.error(`Error uploading ${imageType} image:`, err);
    } finally {
      URL.revokeObjectURL(localPreview);
    }
  };

  const onButtonClick = (imageType) => {
    fileInputRefs[imageType].current?.click();
  };

  const removeImage = (imageType) => {
    const updatedImages = {
      ...images,
      [imageType]: ''
    };

    setImages(updatedImages);
    onImagesChange(updatedImages);

    if (fileInputRefs[imageType].current) {
      fileInputRefs[imageType].current.value = '';
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-4">
        Imágenes de la película (4 imágenes requeridas)
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageTypes.map((imageType) => (
          <div key={imageType.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">
                {imageType.label}
              </h3>
              <span className="text-xs text-gray-400">
                {imageType.position}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-2">
              {imageType.description}
            </p>

            <div
              className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                dragActive[imageType.key] 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-600 hover:border-gray-500'
              } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={(e) => handleDrag(e, imageType.key)}
              onDragLeave={(e) => handleDrag(e, imageType.key)}
              onDragOver={(e) => handleDrag(e, imageType.key)}
              onDrop={(e) => handleDrop(e, imageType.key)}
            >
              <input
                ref={fileInputRefs[imageType.key]}
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, imageType.key)}
                className="hidden"
              />

              {images[imageType.key] ? (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={images[imageType.key]}
                      alt={`Preview ${imageType.label}`}
                      className="mx-auto h-24 w-32 object-cover rounded-lg mb-2"
                    />
                    {!uploading && (
                      <button
                        onClick={() => removeImage(imageType.key)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                        title="Eliminar imagen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {!uploading && (
                    <button
                      type="button"
                      onClick={() => onButtonClick(imageType.key)}
                      className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto transition-colors text-sm"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Cambiar
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-400 mb-1 text-sm">
                    <button
                      onClick={() => onButtonClick(imageType.key)}
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      Seleccionar archivo
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                  <div className="text-center">
                    <Loader className="h-4 w-4 animate-spin text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-300">Subiendo...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-md flex items-center">
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

      {/* Indicador de progreso */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Imágenes subidas: {Object.values(images).filter(Boolean).length}/4
          </span>
          <div className="flex space-x-1">
            {Object.entries(images).map(([key, value]) => (
              <div
                key={key}
                className={`w-3 h-3 rounded-full ${
                  value ? 'bg-green-500' : 'bg-gray-600'
                }`}
                title={imageTypes.find(t => t.key === key)?.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleImageUpload;