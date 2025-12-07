'use client';

import { toast as reactToastify, ToastOptions } from 'react-toastify';

/**
 * Hook personalizado para manejar toasts en client components
 * Wrapper sobre react-toastify con configuración consistente
 */
export function useToast() {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  return {
    success: (message: string, options?: ToastOptions) => {
      reactToastify.success(message, { ...defaultOptions, ...options });
    },
    error: (message: string, options?: ToastOptions) => {
      reactToastify.error(message, { ...defaultOptions, ...options });
    },
    info: (message: string, options?: ToastOptions) => {
      reactToastify.info(message, { ...defaultOptions, ...options });
    },
    warning: (message: string, options?: ToastOptions) => {
      reactToastify.warning(message, { ...defaultOptions, ...options });
    },
  };
}
