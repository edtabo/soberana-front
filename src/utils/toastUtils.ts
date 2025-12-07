
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastResponse {
  toast?: {
    type: ToastType;
    message: string;
  };
}

export function createSuccessToast<T extends Record<string, any>>(message: string, additionalData?: T) {
  return {
    ...additionalData,
    toast: {
      type: 'success' as ToastType,
      message,
    },
  };
}

export function createErrorToast<T extends Record<string, any>>(message: string, additionalData?: T) {
  return {
    ...additionalData,
    toast: {
      type: 'error' as ToastType,
      message,
    },
  };
}

export function createInfoToast<T extends Record<string, any>>(message: string, additionalData?: T) {
  return {
    ...additionalData,
    toast: {
      type: 'info' as ToastType,
      message,
    },
  };
}

export function createWarningToast<T extends Record<string, any>>(message: string, additionalData?: T) {
  return {
    ...additionalData,
    toast: {
      type: 'warning' as ToastType,
      message,
    },
  };
}
