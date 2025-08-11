// src/components/ui/ImagePreviewModal.jsx
import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, carInfo }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.5));
        if (zoom <= 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetView = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleOverlayClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Header con información del auto */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 text-white">
                    <h3 className="font-semibold text-lg">
                        {carInfo?.brand} {carInfo?.model}
                    </h3>
                    <p className="text-sm text-gray-300">
                        {carInfo?.year} • {carInfo?.color} • {carInfo?.plate_number}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="bg-black/50 backdrop-blur-md rounded-full p-3 text-white hover:bg-black/70 transition-colors"
                    aria-label="Cerrar vista previa"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Controles de zoom */}
            <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="bg-black/50 backdrop-blur-md rounded-full p-3 text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoom >= 3}
                    aria-label="Acercar"
                >
                    <MagnifyingGlassPlusIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="bg-black/50 backdrop-blur-md rounded-full p-3 text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoom <= 0.5}
                    aria-label="Alejar"
                >
                    <MagnifyingGlassMinusIcon className="h-5 w-5" />
                </button>
                {zoom !== 1 && (
                    <button
                        onClick={resetView}
                        className="bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 text-white text-xs hover:bg-black/70 transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Indicador de zoom */}
            {zoom !== 1 && (
                <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 text-white text-sm">
                    Zoom: {Math.round(zoom * 100)}%
                    {zoom > 1 && (
                        <div className="text-xs text-gray-300 mt-1">
                            Arrastra para mover
                        </div>
                    )}
                </div>
            )}

            {/* Container de la imagen */}
            <div className="relative max-w-[90vw] max-h-[90vh] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${carInfo?.brand} ${carInfo?.model} - Vista previa`}
                    className={`max-w-none transition-transform duration-200 ${
                        zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
                    }`}
                    style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        maxWidth: zoom === 1 ? '90vw' : 'none',
                        maxHeight: zoom === 1 ? '90vh' : 'none',
                    }}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={zoom === 1 ? handleZoomIn : resetView}
                    draggable={false}
                    onError={(e) => {
                        console.error('Error cargando imagen:', imageUrl);
                        e.target.src = '/placeholder-car.jpg';
                    }}
                />
            </div>

            {/* Instrucciones */}
            <div className="absolute bottom-4 right-4 z-10 bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 text-white text-xs max-w-48">
                <div className="space-y-1">
                    <div>• Doble clic para acercar/resetear</div>
                    <div>• Click afuera para cerrar</div>
                    {zoom > 1 && <div>• Arrastra para mover</div>}
                </div>
            </div>
        </div>
    );
};

ImagePreviewModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    imageUrl: PropTypes.string,
    carInfo: PropTypes.shape({
        brand: PropTypes.string,
        model: PropTypes.string,
        year: PropTypes.number,
        color: PropTypes.string,
        plate_number: PropTypes.string,
    }),
};

export default ImagePreviewModal;