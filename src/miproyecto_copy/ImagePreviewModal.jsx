// src/components/ui/ImagePreviewModal.jsx
import { useState } from 'react';
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, carInfo }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Estados para touch events
    const [initialTouchDistance, setInitialTouchDistance] = useState(0);
    const [touchStartZoom, setTouchStartZoom] = useState(1);

    if (!isOpen) return null;

    // Función para calcular distancia entre dos toques
    const getTouchDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.5));
        if (zoom <= 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    // Eventos de mouse (desktop)
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

    // NUEVO: Zoom con scroll del mouse
    const handleWheel = (e) => {
        e.preventDefault(); // Prevenir scroll de la página

        const zoomIntensity = 0.1; // Intensidad del zoom (ajustable)
        const wheel = e.deltaY < 0 ? 1 : -1; // Dirección del scroll
        const newZoom = Math.max(0.5, Math.min(3, zoom + wheel * zoomIntensity));

        // Zoom hacia el cursor (más natural)
        if (wheel > 0) { // Zoom in
            // Calcular posición del mouse relativa a la imagen
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Ajustar posición para que el zoom se centre en el cursor
            const zoomFactor = newZoom / zoom;
            setPosition({
                x: position.x - (mouseX - position.x) * (zoomFactor - 1) * 0.5,
                y: position.y - (mouseY - position.y) * (zoomFactor - 1) * 0.5
            });
        }

        setZoom(newZoom);

        if (newZoom <= 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    // Eventos táctiles (mobile)
    const handleTouchStart = (e) => {
        e.preventDefault(); // Prevenir zoom del navegador

        if (e.touches.length === 1 && zoom > 1) {
            // Un dedo: preparar para arrastrar
            const touch = e.touches[0];
            setIsDragging(true);
            setDragStart({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y
            });
        } else if (e.touches.length === 2) {
            // Dos dedos: preparar para pellizcar
            const distance = getTouchDistance(e.touches[0], e.touches[1]);
            setInitialTouchDistance(distance);
            setTouchStartZoom(zoom);
            setIsDragging(false);
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault(); // Prevenir scroll del navegador

        if (e.touches.length === 1 && isDragging && zoom > 1) {
            // Un dedo: arrastrar
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        } else if (e.touches.length === 2) {
            // Dos dedos: pellizcar para zoom
            const distance = getTouchDistance(e.touches[0], e.touches[1]);
            const scale = distance / initialTouchDistance;
            const newZoom = Math.max(0.5, Math.min(3, touchStartZoom * scale));
            setZoom(newZoom);

            if (newZoom <= 1) {
                setPosition({ x: 0, y: 0 });
            }
        }
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setInitialTouchDistance(0);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm touch-none"
            onClick={handleOverlayClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ touchAction: 'none' }}
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
            <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
                <button
                    onClick={handleZoomIn}
                    className="bg-black/50 backdrop-blur-md rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoom >= 3}
                    aria-label="Acercar"
                >
                    <MagnifyingGlassPlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="bg-black/50 backdrop-blur-md rounded-full p-2 sm:p-3 text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={zoom <= 0.5}
                    aria-label="Alejar"
                >
                    <MagnifyingGlassMinusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                {zoom !== 1 && (
                    <button
                        onClick={resetView}
                        className="bg-black/50 backdrop-blur-md rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white text-xs hover:bg-black/70 transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Indicador de zoom */}
            {zoom !== 1 && (
                <div className="absolute bottom-12 sm:bottom-4 left-2 sm:left-4 z-10 bg-black/50 backdrop-blur-md rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white text-xs sm:text-sm">
                    Zoom: {Math.round(zoom * 100)}%
                    {zoom > 1 && (
                        <div className="text-xs text-gray-300 mt-1 hidden sm:block">
                            Arrastra para mover
                        </div>
                    )}
                </div>
            )}

            {/* Container de la imagen */}
            <div className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${carInfo?.brand} ${carInfo?.model} - Vista previa`}
                    className={`max-w-none transition-transform duration-200 ${
                        zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
                    }`}
                    style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        maxWidth: zoom === 1 ? '95vw' : 'none',
                        maxHeight: zoom === 1 ? '85vh' : 'none',
                        touchAction: 'none'
                    }}
                    onMouseDown={handleMouseDown}
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onDoubleClick={zoom === 1 ? handleZoomIn : resetView}
                    draggable={false}
                    onError={(e) => {
                        console.error('Error cargando imagen:', imageUrl);
                        e.target.src = '/placeholder-car.jpg';
                    }}
                />
            </div>

            {/* Instrucciones */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10 bg-black/50 backdrop-blur-md rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white text-xs max-w-36 sm:max-w-48">
                <div className="space-y-1">
                    <div className="hidden sm:block">• Scroll para zoom</div>
                    <div className="hidden sm:block">• Doble clic para resetear</div>
                    <div>• Click afuera para cerrar</div>
                    {zoom > 1 && <div className="hidden sm:block">• Arrastra para mover</div>}
                    <div className="sm:hidden">• Pellizca para zoom</div>
                    {zoom > 1 && <div className="sm:hidden">• Un dedo para mover</div>}
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