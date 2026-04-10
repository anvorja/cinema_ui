// src/components/ui/ToastContainer.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
