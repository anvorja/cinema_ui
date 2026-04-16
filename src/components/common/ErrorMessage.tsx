// src/components/ui/ErrorMessage.jsx
import React from 'react';
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ErrorMessage = ({
  title = 'Error',
  message = 'Ha ocurrido un error inesperado',
  type = 'error', // 'error' | 'warning' | 'info'
  onRetry = null,
  onDismiss = null,
  className = '',
  showIcon = true,
  retryText = 'Reintentar',
  dismissText = 'Cerrar',
  ..._rest
}: { title?: string; message?: string; type?: string; onRetry?: any; onDismiss?: any; className?: string; showIcon?: boolean; retryText?: string; dismissText?: string; [key: string]: any }) => {
  // Configuración por tipo
  const typeConfig = {
    error: {
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      textColor: 'text-red-200',
      Icon: XCircleIcon
    },
    warning: {
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
      textColor: 'text-yellow-200',
      Icon: ExclamationTriangleIcon
    },
    info: {
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      textColor: 'text-blue-200',
      Icon: ExclamationTriangleIcon
    }
  };

  const config = typeConfig[type] || typeConfig.error;
  const { Icon } = config;

  const containerClasses = `rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${className}`;

  return (
    <div className={containerClasses}>
      <div className="flex items-start space-x-3">
        {/* Icono */}
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
        )}

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h3>

          <div className={`mt-1 text-sm ${config.textColor}`}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              message
            )}
          </div>

          {/* Acciones */}
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex space-x-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>{retryText}</span>
                </button>
              )}

              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {dismissText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;