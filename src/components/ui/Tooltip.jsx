// src/components/ui/Tooltip.jsx
import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
  children,
  content,
  position = 'top',
  theme = 'dark',
  delay = 300,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Detectar posición óptima del tooltip
  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Lógica para reposicionar si no cabe
    if (position === 'top' && triggerRect.top - tooltipRect.height < 10) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
      newPosition = 'top';
    } else if (position === 'left' && triggerRect.left - tooltipRect.width < 10) {
      newPosition = 'right';
    } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewport.width - 10) {
      newPosition = 'left';
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(calculatePosition);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Estilos base del tooltip
  const getTooltipStyles = () => {
    const baseStyles = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return baseStyles[actualPosition];
  };

  // Estilos de la flecha
  const getArrowStyles = () => {
    const arrowStyles = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
    };
    return arrowStyles[actualPosition];
  };

  const isDark = theme === 'dark';

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="cursor-help"
      >
        {children}
      </div>

      {/* Tooltip Container */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 pointer-events-none
            ${getTooltipStyles()}
            transition-all duration-300 ease-out
            tooltip-slide-in tooltip-glow
          `}
        >
          {/* Tooltip Body */}
          <div
            className={`
              relative px-3 py-2 sm:px-4 sm:py-3 rounded-xl
              text-xs sm:text-sm font-medium
              max-w-xs sm:max-w-sm md:max-w-md
              backdrop-blur-xl
              border shadow-2xl
              transition-all duration-300
              tooltip-shadow-hover hover:scale-105
              ${isDark 
                ? 'bg-gray-900/80 border-gray-700/50 text-gray-100 shadow-gray-900/50' 
                : 'bg-white/80 border-gray-200/50 text-gray-800 shadow-gray-400/30'
              }
            `}
            style={{
              backdropFilter: 'blur(16px) saturate(1.5)',
              background: isDark
                ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
            }}
          >
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    absolute w-1 h-1 rounded-full opacity-60
                    tooltip-particle-${i + 1}
                    ${isDark ? 'bg-blue-400' : 'bg-blue-500'}
                  `}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                />
              ))}
            </div>

            {/* Brillo superior glassmórfico */}
            <div
              className={`
                absolute top-0 left-0 right-0 h-1/2 rounded-t-xl
                ${isDark ? 'bg-white/10' : 'bg-white/20'}
              `}
              style={{
                background: isDark
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)'
              }}
            />

            {/* Contenido */}
            <div className="relative z-10 break-words">
              {content}
            </div>
          </div>

          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-4
              ${getArrowStyles()}
              ${isDark 
                ? 'border-t-gray-900/80 drop-shadow-lg' 
                : 'border-t-white/80 drop-shadow-md'
              }
            `}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;