// src/components/ui/Toast.jsx - Versión alternativa usando clases CSS
import { useState, useCallback, useMemo } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { ToastContext } from '../../hooks/useToast';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2);
    const toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const toastMethods = useMemo(() => ({
    success: (message, duration = 2000) => addToast(message, 'success', duration),
    error: (message, duration = 4000) => addToast(message, 'error', duration),
    warning: (message, duration = 3000) => addToast(message, 'warning', duration),
    info: (message, duration = 3000) => addToast(message, 'info', duration),
    showToast: (message, type = 'info', duration) => addToast(message, type, duration),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const styles = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info',
  };

  const Icon = icons[toast.type];

  return (
    <Transition
      appear
      show={true}
      enter="toast-enter"
      leave="toast-exit"
    >
      <div className={styles[toast.type]}>
        <div className="flex items-start p-4">
          {/* Icono */}
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5 toast-icon" />
          </div>

          {/* Mensaje */}
          <div className="ml-3 w-0 flex-1">
            <p className="toast-text">
              {toast.message}
            </p>
          </div>

          {/* Botón de cerrar */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="toast-close"
              onClick={onRemove}
            >
              <span className="sr-only">Cerrar</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};