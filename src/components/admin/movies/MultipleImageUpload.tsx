// src/components/admin/movies/MultipleImageUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Loader, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useCloudinary } from '../hooks/useCloudinary';

const SLOT_SUFFIX = {
  poster: 'img_poster',
  detail1: 'img_detail1',
  detail2: 'img_detail2',
  backdrop: 'img_backdrop'
};

const buildPublicId = (title, slot) => {
  if (!title || !title.trim()) return null;
  const clean = title
    .trim()
    .replace(/[^\w\s]/g, '')   // quita caracteres especiales
    .replace(/\s+/g, '_');     // espacios → guión bajo
  return `${clean}_${SLOT_SUFFIX[slot]}`;
};

const MultipleImageUpload = ({
  onImagesChange,
  currentImages = {} as Record<string, string>,
  movieTitle = '',
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

  const [draggedSlot, setDraggedSlot] = useState(null);

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

    // Si se está arrastrando un slot existente al otro → intercambiar
    if (draggedSlot && draggedSlot !== imageType) {
      const updatedImages = {
        ...images,
        [imageType]: images[draggedSlot],
        [draggedSlot]: images[imageType]
      };
      setImages(updatedImages);
      onImagesChange(updatedImages);
      setDraggedSlot(null);
      return;
    }

    setDraggedSlot(null);

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

    // Preview local inmediato
    const localPreview = URL.createObjectURL(file);
    setImages(prev => ({ ...prev, [imageType]: localPreview }));

    try {
      const publicId = buildPublicId(movieTitle, imageType);
      const result = await uploadImage(file, { publicId });

      const updatedImages = { ...images, [imageType]: result.url };
      setImages(updatedImages);
      onImagesChange(updatedImages);

    } catch (err) {
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
      <label className="block text-sm font-medium text-board-ink2 mb-4">
        Imágenes de la película (4 imágenes requeridas)
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {imageTypes.map((imageType) => (
          <div key={imageType.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-board-ink2">
                {imageType.label}
              </h3>
              <span className="text-xs text-board-mute">
                {imageType.position}
              </span>
            </div>

            <p className="text-xs text-board-mute mb-2">
              {imageType.description}
            </p>

            <div
              className={`relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
                draggedSlot && draggedSlot !== imageType.key && dragActive[imageType.key]
                  ? 'border-board-ok bg-board-ok/20 scale-[1.02]'
                  : dragActive[imageType.key]
                  ? 'border-board-amber bg-board-amber/20'
                  : 'border-board-line2 hover:border-board-line2'
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
                      draggable={!uploading}
                      onDragStart={() => setDraggedSlot(imageType.key)}
                      onDragEnd={() => setDraggedSlot(null)}
                      className={`mx-auto h-24 w-32 object-cover rounded-lg mb-2 ${!uploading ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedSlot === imageType.key ? 'opacity-50 ring-2 ring-board-amber' : ''}`}
                      title="Arrastra para intercambiar con otra imagen"
                    />
                    {draggedSlot && draggedSlot !== imageType.key && dragActive[imageType.key] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-board-ok/60 rounded-lg">
                        <span className="text-board-okink text-xs font-medium">Intercambiar</span>
                      </div>
                    )}
                    {!uploading && (
                      <button
                        onClick={() => removeImage(imageType.key)}
                        className="absolute -top-1 -right-1 bg-board-alarm text-board-ink rounded-full p-1 hover:bg-board-alarm transition-colors"
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
                      className="text-board-amberink hover:text-board-amberink flex items-center justify-center mx-auto transition-colors text-sm"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Cambiar
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-board-mute mx-auto mb-2" />
                  <div className="text-board-mute mb-1 text-sm">
                    <button
                      onClick={() => onButtonClick(imageType.key)}
                      className="text-board-amberink hover:text-board-amberink underline transition-colors"
                    >
                      Seleccionar archivo
                    </button>
                  </div>
                  <p className="text-xs text-board-mute">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-board-panel/50 rounded-lg">
                  <div className="text-center">
                    <Loader className="h-4 w-4 animate-spin text-board-amberink mx-auto mb-1" />
                    <p className="text-xs text-board-ink2">Subiendo...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-board-alarm/50 border border-board-alarm rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 text-board-alarmink mr-2" />
          <span className="text-board-alarmink text-sm">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-board-alarmink hover:text-board-alarmink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Indicador de progreso */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-board-mute">
            Imágenes subidas: {Object.values(images).filter(Boolean).length}/4
          </span>
          <div className="flex space-x-1">
            {Object.entries(images).map(([key, value]) => (
              <div
                key={key}
                className={`w-3 h-3 rounded-full ${
                  value ? 'bg-board-ok' : 'bg-board-panel2'
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