// src/components/admin/components/ToastProvider.jsx
import React from 'react';
import { useToastProvider } from '../hooks/useToast';
import ToastContainer from '../../ui/ToastContainer';

export const ToastProvider = ({ children }) => {
  const { toasts, toast, removeToast, ToastContext } = useToastProvider();

  // Normalizar los toasts del admin (que tienen title + message) al formato
  // que espera ToastContainer (solo message)
  const normalizedToasts = toasts.map(t => ({
    ...t,
    message: t.title ? `${t.title}: ${t.message}` : t.message
  }));

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer
        toasts={normalizedToasts}
        onRemoveToast={removeToast}
      />
    </ToastContext.Provider>
  );
};
