// src/hooks/useUserColors.js
import { useMemo } from 'react';

/**
 * Hook optimizado para generar colores únicos por usuario
 * @param {string} userEmail - Email del usuario para generar colores consistentes
 * @returns {Object} Objeto con colores from, via, to en formato HSL
 */
export const useUserColors = (userEmail) => {
    return useMemo(() => {
        if (!userEmail) {
            return {
                from: '#667eea',
                via: '#764ba2',
                to: '#f093fb'
            };
        }

        // Algoritmo para distribución uniforme de colores
        let hash = 0;
        for (let i = 0; i < userEmail.length; i++) {
            hash = userEmail.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Asegurar colores vibrantes y accesibles
        const hue = Math.abs(hash) % 360;
        const saturation = 65 + (Math.abs(hash >> 8) % 15); // 65-80%
        const lightness = 55 + (Math.abs(hash >> 16) % 15); // 55-70%

        // Crear triada armónica
        const hue2 = (hue + 120) % 360;
        const hue3 = (hue + 240) % 360;

        return {
            from: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            via: `hsl(${hue2}, ${saturation + 5}%, ${lightness + 5}%)`,
            to: `hsl(${hue3}, ${saturation + 10}%, ${lightness + 10}%)`
        };
    }, [userEmail]);
};