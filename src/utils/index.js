// src/utils/index.js
import clsx from "clsx";

export const cn = (...classes) => clsx(classes);

// Validaciones
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePlateNumber = (plateNumber) => {
  if (!plateNumber) return false;
  const plateRegex = /^[A-Z]{3}[0-9]{3}$|^[A-Z]{3}[0-9]{2}[A-Z]$/;
  return plateRegex.test(plateNumber.toUpperCase());
};

export const validateCarData = (carData) => {
  const errors = {};

  if (!carData.brand || carData.brand.trim().length < 2) {
    errors.brand = 'La marca debe tener al menos 2 caracteres';
  }

  if (!carData.model || carData.model.trim().length < 1) {
    errors.model = 'El modelo es requerido';
  }

  if (!carData.year || carData.year < 1900 || carData.year > new Date().getFullYear()) {
    errors.year = 'El año debe estar entre 1900 y el año actual';
  }

  if (!carData.plateNumber || !validatePlateNumber(carData.plateNumber)) {
    errors.plateNumber = 'La placa debe tener formato colombiano válido (ABC123 o ABC12D)';
  }

  if (!carData.color || carData.color.trim().length < 3) {
    errors.color = 'El color debe tener al menos 3 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Formateo de fechas
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Funciones para autos
export const getCarAge = (year) => {
  return new Date().getFullYear() - year;
};

export const isVintage = (year) => {
  return getCarAge(year) >= 25;
};

export const isNew = (year) => {
  return getCarAge(year) <= 3;
};

export const getCarStatusBadge = (year) => {
  if (isVintage(year)) {
    return { label: '🏺 Clásico', className: 'bg-yellow-100 text-yellow-800' };
  }
  if (isNew(year)) {
    return { label: '✨ Nuevo', className: 'bg-green-100 text-green-800' };
  }
  return null;
};

// Función para truncar texto
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Función para capitalizar texto
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función para limpiar y normalizar input
export const normalizeInput = (text) => {
  if (!text) return '';
  return text.trim();
};

// Función para normalizar placa
export const normalizePlate = (plate) => {
  if (!plate) return '';
  return plate.trim().toUpperCase().replace(/\s/g, '');
};

// Debounce function para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Función para generar ID único
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Función para formatear números
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-CO').format(num);
};

// Función para extraer mensaje de error
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Ha ocurrido un error inesperado';
};

// Función para validar URL
export const isValidUrl = (url) => {
  if (!url) return true; // URL opcional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};