// src/components/admin/components/ToastProvider.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastProvider } from '../hooks/useToast';

const ToastIcon = ({ type }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />
  };
  return icons[type] || icons.info;
};

const Toast = ({ toast, onRemove }) => {
  const getToastClasses = () => {
    const baseClasses = "mb-4 w-full max-w-sm bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out";
    const typeClasses = {
      success: "border-green-500",
      error: "border-red-500",
      warning: "border-yellow-500",
      info: "border-blue-500"
    };
    return `${baseClasses} ${typeClasses[toast.type]}`;
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ToastIcon type={toast.type} />
        </div>
        <div className="ml-3 w-0 flex-1">
          {toast.title && (
            <p className="text-sm font-medium text-white">
              {toast.title}
            </p>
          )}
          <p className="text-sm text-gray-300">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(toast.id)}
            className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const { toasts, toast, removeToast, ToastContext } = useToastProvider();

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] max-w-sm">
        {toasts.map(toastItem => (
          <Toast
            key={toastItem.id}
            toast={toastItem}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};