// src/utils/storage.js

// Claves para localStorage
export const STORAGE_KEYS = {
    PAGINATION_SETTINGS: 'tucarro_pagination_settings',
    USER_PREFERENCES: 'tucarro_user_preferences'
};

// Configuración por defecto
const DEFAULT_PAGINATION = {
    size: 6,
    sortBy: 'createdAt',
    sortDirection: 'desc'
};

/**
 * Guarda configuración de paginación en localStorage
 * @param {Object} settings - Configuraciones a guardar
 */
export const savePaginationSettings = (settings) => {
    try {
        const currentSettings = getPaginationSettings();
        const newSettings = { ...currentSettings, ...settings };
        localStorage.setItem(STORAGE_KEYS.PAGINATION_SETTINGS, JSON.stringify(newSettings));
        return true;
    } catch (error) {
        console.warn('Error saving pagination settings:', error);
        return false;
    }
};

/**
 * Obtiene configuración de paginación desde localStorage
 * @returns {Object} Configuración de paginación
 */
export const getPaginationSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.PAGINATION_SETTINGS);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validar que el tamaño sea uno de los valores permitidos
            const validSizes = [6, 12, 20, 50];
            if (parsed.size && !validSizes.includes(parsed.size)) {
                parsed.size = DEFAULT_PAGINATION.size;
            }
            return { ...DEFAULT_PAGINATION, ...parsed };
        }
        return DEFAULT_PAGINATION;
    } catch (error) {
        console.warn('Error loading pagination settings:', error);
        return DEFAULT_PAGINATION;
    }
};

/**
 * Limpia configuración de paginación
 */
export const clearPaginationSettings = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.PAGINATION_SETTINGS);
        return true;
    } catch (error) {
        console.warn('Error clearing pagination settings:', error);
        return false;
    }
};

/**
 * Verifica si localStorage está disponible
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
    try {
        const test = 'storage_test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};