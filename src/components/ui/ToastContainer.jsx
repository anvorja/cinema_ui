// src/components/ui/ToastContainer.jsx
import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            top: `${16 + (index * 80)}px`
          }}
          className="fixed right-4 z-[10000]"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
};

export default ToastContainer;